var zip = (...rows) => [...rows[0]].map((_,c) => rows.map(row => row[c]));

function createNodes() {
  // Create a list of senders and recipients of the form:
  // [{ group: "HT", label: "P-AI-TO"}]
  // First add the senders/recipients from the words in the tablets.
	var masterList =  transactions.map(x => x.words).flat()
    .map(x => ["sender", "recipient"].includes(x.description) ?
      ({ group : x.transactionID.substring(0, 2), label: x.transliteratedWord }) : "");
  // Then add the senders/recipients implicit in tablet, e.g. the magazines.
	masterList = masterList.concat(transactions.map(x => x.transactions).flat()
    .map(x => ["sender", "recipient"].includes(x.description) ?
      ({ group : x.transactionID.substring(0, 2), label: x.transliteratedWord }) : ""));

  // Create a list of unique nodes
  var nodeList = masterList.map(x => x.label)
    .filter((v, i, a) => v != undefined && a.indexOf(v) === i);

  // A lookup table for entities to their group, e.g. HT113 is in group HT.
  var groupForNode =  new Map(masterList.map(x => [x.label, x.group]));

  // Create an array of type: [{ id: 1, label: "P-AI-TO", group: "HT" }]
  // This is our final list of nodes.
  var nodes = zip(nodeList, [...Array(nodeList.length).keys()])
    .map(function(x) { return { 'id' : x[1], 'label' : x[0], 'group': groupForNode.get(x[0]) }});

  // Create a lookup Map for label to id.
  var nodeLookup =  new Map(nodes.map(x => [x.label, x.id]));
  var nodeIDLookup =  new Map(nodes.map(x => [x.id, x.label]));
  return { nodes: nodes, nodeLookup: nodeLookup, nodeIDLookup: nodeIDLookup};
}

function createEdges(nodeLookup) {
  function createEdge(words, x, i, prevWord) {
    function getIndex(i) {
      if (i < words.length) {
        return i;
      }
      var transliteratedWords = words.map(x => x.transliteratedWord);
      var w = transliteratedWords.indexOf(x.transliteratedWord);
      if (w > -1) {
        return w;
      }
      return i;
    }

    var tranID = x.transactionID;

    if (!normalizedTransactions.has(tranID)) {
      normalizedTransactions.set(tranID, {});
    };
    var description = x.description;
    var name = x.transliteratedWord;
    if (description == "recipient") {
      normalizedTransactions.get(tranID).to = nodeLookup.get(name);
      normalizedTransactions.get(tranID).recipient = name;
      normalizedTransactions.get(tranID).recipientIndex = [getIndex(i)];
    }
    if (description == "sender") {
      normalizedTransactions.get(tranID).from = nodeLookup.get(name);
      normalizedTransactions.get(tranID).sender = name;
      normalizedTransactions.get(tranID).senderIndex = [getIndex(i)];
    }
    if (description == "commodity") {
      // Have to cater for more than one commodity/quantity per tran ID. Ideally
      // I would have used unique tranIDs per commodoty/quantity
      if (!normalizedTransactions.get(tranID).commodities) {
        normalizedTransactions.get(tranID).commodities = [name];
        if (commodities.has(x.word)) {
          name = commodities.get(x.word);
        }
        normalizedTransactions.get(tranID).labels = [name];
        normalizedTransactions.get(tranID).title = tranID.split('-')[0];
        normalizedTransactions.get(tranID).commodityIndex = [[getIndex(i)]];
      } else {
        normalizedTransactions.get(tranID).commodities.push(name);
        if (commodities.has(x.word)) {
          name = commodities.get(x.word);
        }
        normalizedTransactions.get(tranID).labels.push(name);
        normalizedTransactions.get(tranID).commodityIndex.push([getIndex(i)]);
      }
    }
    if (description == "quantity") {
      // Have to cater for more than one commodity/quantity per tran ID. Ideally
      // I would have used unique tranIDs per commodoty/quantity
      if (!normalizedTransactions.get(tranID).quantityIndex) {
        normalizedTransactions.get(tranID).quantityIndex = [[getIndex(i)]];
        normalizedTransactions.get(tranID).quantity = [name];
        normalizedTransactions.get(tranID).width = [Math.log2(parseInt(name))];
      } else if (prevWord.description == "quantity") {
        // Add fractions to an existing quantity
        normalizedTransactions.get(tranID).quantityIndex.slice(-1)[0].push(getIndex(i));
        var l = normalizedTransactions.get(tranID).quantity.length;
        normalizedTransactions.get(tranID).quantity[l - 1] = 
          normalizedTransactions.get(tranID).quantity[l - 1] + name;
      } else {
        normalizedTransactions.get(tranID).quantityIndex.push([getIndex(i)]);
        normalizedTransactions.get(tranID).quantity.push(name);
        normalizedTransactions.get(tranID).width.push(Math.log2(parseInt(name)));
      }
    }
  }

  var normalizedTransactions = new Map();
  for (var t of transactions) {
    if (!t) {
      continue;
    }
    var words = t.words.concat(t.transactions).flat();
    for (var i = 0; i < words.length; i++) {
      createEdge(t.words, words[i], i, words[i-1]);
    }
  }

  var edges = [];
  for (var x of Array.from(normalizedTransactions.values())) {
    if (!x.commodities) {
      edges.push({
        from: x.from, 
        to: x.to, 
        inscription: x.title, 
        title: x.title, 
        recipientIndex: x.recipientIndex, senderIndex: x.senderIndex,
        commodityIndex: x.commodityIndex, quantityIndex: x.quantityIndex
      });
      continue;
    }
    for (var i = 0; i < x.commodities.length; i++) {
      edges.push({
        from: x.from, 
        to: x.to, 
        label: x.labels[i] + ' ' + (x.quantity ? x.quantity[i] : ""),
        inscription: x.title, 
        title: x.title, width: 1,
        recipientIndex: x.recipientIndex, senderIndex: x.senderIndex,
        commodityIndex: x.commodityIndex[i],
        quantityIndex: (x.quantityIndex ? x.quantityIndex[i] : [])
      });
    }
  }

  return edges.filter(e => e.label != undefined);
}

function filterNodesAndEdges(nodes, edges, nodeLookup) {
  if (!searchTerms.length) {
    return { nodes: nodes, edges: edges };
  }
  // Get all the edges that either match a search term or have a
  // node that matches the search term.
  var matchingEdges = edges.filter(v => {
    return searchTerms.some(x => {
      var f = nodeLookup.get(x.toUpperCase());
      if (f == undefined) f = -1;
      return (v.from == f || v.to == f || v.label.includes(x) || v.inscription == x)
    });
  });
  var matchingNodeIDs = matchingEdges.map(e => [e.from, e.to]).flat()
    .filter((v, i, a) => v != undefined && a.indexOf(v) === i);

  var matchingNodes = nodes.filter(x => matchingNodeIDs.includes(x.id));
  // Create an array of type: [{ id: 1, label: "P-AI-TO", group: "HT" }]
  // This is our final list of nodes.
  return { nodes: matchingNodes, edges: matchingEdges };
}

function draw() {
  // create some nodes
  var nodeInfo = createNodes();
  var nodes = nodeInfo.nodes;
  var nodeLookup = nodeInfo.nodeLookup;
  var edges = createEdges(nodeLookup);
  var filtered = filterNodesAndEdges(nodes, edges, nodeLookup);

  // create a network
  var container = document.getElementById("mynetwork");
  var data = {
    nodes: filtered.nodes,
    edges: filtered.edges
  };
  var options = {
    edges: {
      font: {
        background: 'yellow',
        face: 'Routed',
      },
    },
    nodes: {
      font: {
        face: 'Routed',
      },
      shape: "dot",
      size: 16
    },
    interaction:{hover:true},
    layout: {
      randomSeed: 34,
      improvedLayout: false,
    },
    physics: {
      forceAtlas2Based: {
        gravitationalConstant: -26,
        centralGravity: 0.005,
        springLength: 230,
        springConstant: 0.09,
        damping: 0.1,
      },
      maxVelocity: 146,
      solver: "forceAtlas2Based",
      timestep: 0.35,
      stabilization: {
        enabled: false,
        iterations: 2000,
        updateInterval: 25
      }
    }
  };
  var network = new vis.Network(container, data, options);

  network.on("stabilizationProgress", function(params) {
    var maxWidth = 496;
    var minWidth = 20;
    var widthFactor = params.iterations / params.total;
    var width = Math.max(minWidth, maxWidth * widthFactor);

    document.getElementById("bar").style.width = width + "px";
    document.getElementById("text").innerHTML =
      Math.round(widthFactor * 100) + "%";
  });
  network.once("stabilizationIterationsDone", function() {
    document.getElementById("text").innerHTML = "100%";
    document.getElementById("bar").style.width = "496px";
    document.getElementById("loadingBar").style.opacity = 0;
    // really clean the dom element
    setTimeout(function() {
      document.getElementById("loadingBar").style.display = "none";
    }, 500);
  });

  network.on("hoverEdge", showTablet);
  network.on("blurEdge", resetColors);
  network.on("selectNode", addNodeToFilter);

  function addNodeToFilter(params) {
    let nodeName = nodeInfo.nodeIDLookup.get(params.nodes[0]);
    updateSearchTerms(nodeName)();
  }

  function getEdge(id) {
    for (var e of edges) {
      if (e.id === id) {
        return e;
      }
    }
    return null;
  }

  function resetColors(params) {
    var edge = getEdge(params.edge);
    var from = network.body.nodes[edge.from];
    // Highlight the relevant nodes
    var parties = [ 
      { i: edge.senderIndex, c: 'coral', e: network.body.nodes[edge.from], t: 'background' },
      { i: edge.recipientIndex, c: 'lightgreen', e: network.body.nodes[edge.to] , t: 'background'},
    ];
    for (var p of parties) {
      if (p.e) {
        p.e.setOptions({
          color: p.e.options.originalColor
        });
      }
    }
  }

  function showTablet(params) {
    // find corresponding edge
    var edge = getEdge(params.edge);
    var inscription = edge.inscription;
    if (!inscription) {
      return;
    }
    var container = document.getElementById("inscription-container");
    container.innerHTML = "";
    var inscriptionData = inscriptions.get(inscription);
    if (inscriptionData.element) {
      container.appendChild(inscriptionData.element);
    } else {
      loadInscription(inscriptionData, container, "../");
    }

    for (var i = 0; i < inscriptionData.words.length; i++) {
      clearHighlight(inscription, i)();
    }

    // Highlight the relevant nodes
    var parties = [ 
      { i: edge.senderIndex, c: "rgba(255, 127, 80", e: network.body.nodes[edge.from], t: 'node' },
      { i: edge.recipientIndex, c: "rgba(144, 238, 144", e: network.body.nodes[edge.to] , t: 'node'},
      { i: edge.commodityIndex, c: "rgba(255, 255, 0", e: null , t: 'edge'},
      { i: edge.quantityIndex, c: "rgba(255, 255, 0", e: null , t: ''},
    ];
    for (var p of parties) {
      for (var i of p.i) {
        highlightWords(inscription, i, false, p.c + ", 0.5)")();
      }
      if (p.e) {
        if (!p.e.options.originalColor) {
          p.e.setOptions({
            originalColor: p.e.options.color
          });
        }
        p.e.setOptions({
          color: {
            background: p.c + ")",
            highlight: {
              background: p.c + ")"
            }
          }
        });
      }
    }
  }

}

window.addEventListener("load", () => {
  for (var obj of inscriptionCoordinates) {
    coordinates.delete(obj.img);
    coordinates.set("../" + obj.img, obj.areas);
  }
  loadAnnotations();
  draw();
});

autocomplete(document.getElementById("search"), false /*useGlyphs*/);
showSearch();
var searchTerms = [];
function applySearchTerms() {
  var searchTermEl = document.getElementById("search-terms");
  var numberOfSearchTerms = searchTermEl.children.length;
  searchTerms = Array.prototype.slice.call(searchTermEl.children)
                         .map(x => stripErased(x.textContent));
  draw();
}
