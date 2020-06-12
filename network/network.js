var zip = (...rows) => [...rows[0]].map((_,c) => rows.map(row => row[c]));

function createNodes() {
	var nodeList =  transactions.map(x => x.words).flat()
    .map(x => ["sender", "recipient"].includes(x.description) ? x.transliteratedWord : "")
    .filter((v, i, a) => v != "" && a.indexOf(v) === i); // Removes empty and duplicate elements
	nodeList = (nodeList.concat(transactions.map(x => x.transactions).flat()
    .map(x => ["sender", "recipient"].includes(x.description) ? x.transliteratedWord : ""))
    .filter((v, i, a) => v != "" && a.indexOf(v) === i));

  var nodes = zip(nodeList, [...Array(nodeList.length).keys()])
    .map(function(x) { return { 'id' : x[1], 'label' : x[0] }});

  var nodeLookup =  new Map(nodes.map(x => [x.label, x.id]));
  return { nodes: nodes, nodeLookup: nodeLookup};
}

function createEdges(nodeLookup) {
  function createEdge(x) {
    var tranID = x.transactionID;

    if (!normalizedTransactions.has(tranID)) {
      normalizedTransactions.set(tranID, {});
    };
    var description = x.description;
    var name = x.transliteratedWord;
    if (description == "recipient") {
      normalizedTransactions.get(tranID).to = nodeLookup.get(name);
      normalizedTransactions.get(tranID).recipient = name;
    }
    if (description == "sender") {
      normalizedTransactions.get(tranID).from = nodeLookup.get(name);
      normalizedTransactions.get(tranID).sender = name;
    }
    if (description == "commodity") {
      normalizedTransactions.get(tranID).commodity = name;
      normalizedTransactions.get(tranID).label = name + "(" + tranID + ")";
    }
    if (description == "quantity") {
      normalizedTransactions.get(tranID).quantity = name;
      normalizedTransactions.get(tranID).width = name;
    }
  }

  var normalizedTransactions = new Map();
	transactions.map(x => x.words.concat(x.transactions)).flat()
    .map(x => createEdge(x));
  return normalizedTransactions;

}

function draw() {
  // create some nodes
  var nodeInfo = createNodes();
  var nodes = nodeInfo.nodes;
  var nodeLookup = nodeInfo.nodeLookup;
  var normalizedTransactions = createEdges(nodeLookup);

  var edges = Array.from(normalizedTransactions.values())
    .map((x) => ({ from: x.from, to: x.to, label: x.label}));
  console.log(edges);

  // create a network
  var container = document.getElementById("mynetwork");
  var data = {
    nodes: nodes,
    edges: edges
  };
  var options = {
    nodes: {
      shape: "dot",
      size: 16
    },
    layout: {
      randomSeed: 34
    },
    physics: {
      forceAtlas2Based: {
        gravitationalConstant: -26,
        centralGravity: 0.005,
        springLength: 230,
        springConstant: 0.18
      },
      maxVelocity: 146,
      solver: "forceAtlas2Based",
      timestep: 0.35,
      stabilization: {
        enabled: true,
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
}

window.addEventListener("load", () => {
  draw();
});

