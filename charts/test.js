function addLetterImagesToChart(img, image, inscription, container) {
  return function (e) {
    if (!coordinates.has(image)) {
      return;
    }
    var imageCoords = coordinates.get(image);
    var imagesToCache = [];

    var item = null;
    var span = null;
    var letters = lettersWithImages(inscription.parsedInscription);
    for (var i = 0; i < imageCoords.length; i++) {
      var area = imageCoords[i].coords;
      var word = letters[i];

      if (word == "—" || word == '') {
        continue;
      }

      item = document.getElementById(word);
      if (!item) {
        var d1 = document.createElement("div");
        container.appendChild(d1);
        
        var item = document.createElement("div");
        item.id = word;
        item.name = word;
        d1.appendChild(item);

        var label = document.createElement("div");
        label.textContent = word + " in the Linear A corpus";
        d1.appendChild(label);

      }
      var d1 = document.createElement("div");

      var imageContainer = document.createElement("div");
      imageContainer.className = "concordance-item";
      d1.appendChild(imageContainer);

      var span = document.createElement("div");
      span.textContent = inscription.name;
      d1.appendChild(span);

      item.appendChild(d1);
      
      span = document.createElement("span");
      imageContainer.appendChild(span);

      var canvas = document.createElement('canvas');
      var w = area.width;
      var h = area.height;
      if (h > w) {
        canvas.height = 50;
        canvas.width = 50 * w / h;
      } else {
        canvas.width = 50;
        canvas.height = 50 * h / w;
      }
      var ctx = canvas.getContext('2d', {alpha: false});
      ctx.drawImage(img, area.x, area.y, area.width, area.height, 0, 0, canvas.width, canvas.height);
      span.appendChild(canvas);
    }
  };
}

function loadWords(inscription, type, container) {
  var imagesToLoad = [];
  imagesToLoad = imagesToLoad.concat(inscription.facsimileImages);
  imagesToLoad.forEach( image => {
    var img = new Image();
    img.src = "../" + encodeURIComponent(image);
    img.addEventListener("load", addLetterImagesToChart(img, image, inscription, container));
  });
}

function initializeChart() {
  for (var inscription of inscriptions.values()) {
    loadWords(inscription, "letter", container);
  }
}
