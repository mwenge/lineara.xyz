var zip = (...rows) => [...rows[0]].map((_,c) => rows.map(row => row[c]));

function createNodes() {
  // Add senders and recipients
	var masterList =  transactions.map(x => x.words).flat()
    .map(x => ["sender", "recipient"].includes(x.description) ?
      ({ group : x.transactionID.substring(0, 2), label: x.transliteratedWord }) : "");
	masterList = masterList.concat(transactions.map(x => x.transactions).flat()
    .map(x => ["sender", "recipient"].includes(x.description) ?
      ({ group : x.transactionID.substring(0, 2), label: x.transliteratedWord }) : ""));

  var nodeList = masterList.map(x => x.label)
    .filter((v, i, a) => v != undefined && a.indexOf(v) === i);

  var groupForNode =  new Map(masterList.map(x => [x.label, x.group]));

  var nodes = zip(nodeList, [...Array(nodeList.length).keys()])
    .map(function(x) { return { 'id' : x[1], 'label' : x[0], 'group': groupForNode.get(x[0]) }});

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
			if (commodities.has(x.word)) {
        name = commodities.get(x.word);
      }
      normalizedTransactions.get(tranID).label = name;
      normalizedTransactions.get(tranID).title = tranID.split('-')[0];
    }
    if (description == "quantity") {
      normalizedTransactions.get(tranID).quantity = name;
      normalizedTransactions.get(tranID).width = Math.log2(parseInt(name));
    }
  }

  var normalizedTransactions = new Map();
	transactions.map(x => x.words.concat(x.transactions)).flat()
    .map(x => createEdge(x));

  var edges = Array.from(normalizedTransactions.values())
    .map((x) => ({ from: x.from, to: x.to, label: x.label, title: x.title + ' ' + x.quantity, width: x.width}));

  return edges;
}

function draw() {
  // create some nodes
  var nodeInfo = createNodes();
  var nodes = nodeInfo.nodes;
  console.log(nodes);
  var nodeLookup = nodeInfo.nodeLookup;
  var edges = createEdges(nodeLookup);

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
      randomSeed: 34,
      improvedLayout: false,
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

  network.on("click", neighbourhoodHighlight);

	function neighbourhoodHighlight(params) {
		// if something is selected:
		if (params.nodes.length > 0) {
			highlightActive = true;
			var i, j;
			var selectedNode = params.nodes[0];
			var degrees = 2;

			// mark all nodes as hard to read.
			for (var nodeId in allNodes) {
				allNodes[nodeId].color = "rgba(200,200,200,0.5)";
				if (allNodes[nodeId].hiddenLabel === undefined) {
					allNodes[nodeId].hiddenLabel = allNodes[nodeId].label;
					allNodes[nodeId].label = undefined;
				}
			}
			var connectedNodes = network.getConnectedNodes(selectedNode);
			var allConnectedNodes = [];

			// get the second degree nodes
			for (i = 1; i < degrees; i++) {
				for (j = 0; j < connectedNodes.length; j++) {
					allConnectedNodes = allConnectedNodes.concat(
						network.getConnectedNodes(connectedNodes[j])
					);
				}
			}

			// all second degree nodes get a different color and their label back
			for (i = 0; i < allConnectedNodes.length; i++) {
				allNodes[allConnectedNodes[i]].color = "rgba(150,150,150,0.75)";
				if (allNodes[allConnectedNodes[i]].hiddenLabel !== undefined) {
					allNodes[allConnectedNodes[i]].label =
						allNodes[allConnectedNodes[i]].hiddenLabel;
					allNodes[allConnectedNodes[i]].hiddenLabel = undefined;
				}
			}

			// all first degree nodes get their own color and their label back
			for (i = 0; i < connectedNodes.length; i++) {
				allNodes[connectedNodes[i]].color = undefined;
				if (allNodes[connectedNodes[i]].hiddenLabel !== undefined) {
					allNodes[connectedNodes[i]].label =
						allNodes[connectedNodes[i]].hiddenLabel;
					allNodes[connectedNodes[i]].hiddenLabel = undefined;
				}
			}

			// the main node gets its own color and its label back.
			allNodes[selectedNode].color = undefined;
			if (allNodes[selectedNode].hiddenLabel !== undefined) {
				allNodes[selectedNode].label = allNodes[selectedNode].hiddenLabel;
				allNodes[selectedNode].hiddenLabel = undefined;
			}
		} else if (highlightActive === true) {
			// reset all nodes
			for (var nodeId in allNodes) {
				allNodes[nodeId].color = undefined;
				if (allNodes[nodeId].hiddenLabel !== undefined) {
					allNodes[nodeId].label = allNodes[nodeId].hiddenLabel;
					allNodes[nodeId].hiddenLabel = undefined;
				}
			}
			highlightActive = false;
		}

		// transform the object into an array
		var updateArray = [];
		for (nodeId in allNodes) {
			if (allNodes.hasOwnProperty(nodeId)) {
				updateArray.push(allNodes[nodeId]);
			}
		}
		nodesDataset.update(updateArray);
	}

}

window.addEventListener("load", () => {
  draw();
});

