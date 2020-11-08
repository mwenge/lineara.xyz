function draw() {
  // create some nodes
  // create a network
  var container = document.getElementById("mynetwork");
  var data = {
    nodes: nodes,
    edges: edges
  };
  var options = {
    edges: {
      font: {
        background: 'yellow',
      },
    },
    nodes: {
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

  function getEdge(id) {
    for (var e of edges) {
      if (e.id === id) {
        return e;
      }
    }
    return null;
  }

  function showTablet(params) {
    // find corresponding edge
    var edge = getEdge(params.edge);

    var f = network.body.nodes[edge.from];
    var t = network.body.nodes[edge.to];
    var container = document.getElementById("inscription-container");
    container.innerHTML = "";
    for (var n of [f, t]) {
      var inscription = n.labelModule.elementOptions.label;
      if (!inscription) {
        continue;
      }
      var inscriptionData = inscriptions.get(inscription);
      if (inscriptionData.element) {
        container.appendChild(inscriptionData.element);
      } else {
        loadInscription(inscriptionData, container, "../");
      }

      for (var i = 0; i < inscriptionData.words.length; i++) {
        clearHighlight(inscription, i)();
      }
      for (var i = 0; i < inscriptionData.words.length; i++) {
        var w = inscriptionData.transliteratedWords[i];
        if (edge.label.split('\n').includes(w)) {
          highlightWords(inscription, i, false)();
        }
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

