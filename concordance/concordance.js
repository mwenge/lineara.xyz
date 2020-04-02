/*
# Copyright (c) 2019 Robert Hogan (robhogan at gmail.com) All rights reserved.
#
# Redistribution and use in source and binary forms, with or without
# modification, are permitted provided that the following conditions are
# met:
#
#    * Redistributions of source code must retain the above copyright
# notice, this list of conditions and the following disclaimer.
#    * Redistributions in binary form must reproduce the above
# copyright notice, this list of conditions and the following disclaimer
# in the documentation and/or other materials provided with the
# distribution.
#    * Neither the name of Google Inc. nor the names of its
# contributors may be used to endorse or promote products derived from
# this software without specific prior written permission.
#
# THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
# "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
# LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
# A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
# OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
# SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
# LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
# DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
# THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
# (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
# OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

document.onkeydown = checkKey;
function checkKey(e) {
  if (e.defaultPrevented) {
    return; // Do nothing if the event was already processed
  }
  switch(e.key) {
    case "s": // 't' - toggle translation
      var output = "var cachedImages = new Map([\n";
      for (let [key, value] of coordinates) {
          var images = Array.prototype.map.call(value, x => x.src);
          output += "[\"" + key + "\",[\"" + images.join("\",\"") + "]],\n";
      }
      output += "]);\n"
      let a = document.createElement('a');
      a.href = "data:application/octet-stream," + encodeURIComponent(output);
      a.download = 'letterimages-' + new Date().toISOString() + '.txt';
      a.click();
      break;
    default:
      return;
  }
  // Cancel the default action to avoid it being handled twice
  e.preventDefault();
}

function stripErased(word) {
  return word.replace(/\u{1076b}/gu, "");
}

function wordIndexForLetterIndex(name, index, from) {
  var splitter = new GraphemeSplitter();
  var words = inscriptions.get(name).words;
  var letters = 0;
  for (var i = 0; i < words.length; i++) {
    var word = words[i];
    if (word == '\u{1076b}' || word == '\n' || word == '𐄁') {
      continue;
    }
    letters += splitter.countGraphemes(stripErased(word));
    if (letters > index) {
      return i;
    }
  }
  return 0;
}

// Concordance
function loadWords(inscription, type, container) {
  inscription.facsimileImages.forEach( image => {
    if (cachedImages.has(image)) {
      if (["word", "number", "ideogram"].includes(type)) {
        addWordImagesToConcordance(img, image, inscription, type, container)();
      } else if (["letter"].includes(type)) {
        addLetterImagesToConcorance(img, image, inscription, container)();
      }
    } else {
      var img = new Image();
      img.src = "../" + encodeURIComponent(image);
      if (["word", "number", "ideogram"].includes(type)) {
        img.addEventListener("load", addWordImagesToConcordance(img, image, inscription, type, container));
      } else if (["letter"].includes(type)) {
        img.addEventListener("load", addLetterImagesToConcorance(img, image, inscription, container));
      }
    }
  });
}

function shouldIncludeWord(word, type, tagsForWord) {
  if (word == '—') {
    return false;
  }
  if (tagsForWord.includes(type)) {
    return true;
  }
  var splitter = new GraphemeSplitter();
  var letters = splitter.countGraphemes(word);
  if (type == "ideogram" && !tagsForWord.includes("number") && letters == 1) {
    return true;
  }
  if (type == "word" && letters > 1 && !tagsForWord.includes("number")) {
    return true;
  }
  if (type == "letter" && !tagsForWord.includes("number")) {
    return true;
  }
  return false;
}

function lettersWithImages(parsedInscription) {
  var splitter = new GraphemeSplitter();
  var letters = stripErased(parsedInscription);
  letters = letters.replace(/\n/gu, "");
  letters = letters.replace(/𐄁/gu, "");
  return splitter.splitGraphemes(letters);
}

function isNumber(character) {
  var unicode = character.codePointAt(0);
  if (unicode < 65792 || unicode > 65855) {
    return false;
  }
  return true;
}

function addLetterImagesToConcorance(img, image, inscription, container) {
  return function (e) {
    if (!coordinates.has(image)) {
      return;
    }
    // We're no longer displaying letters, abort.
    if (container.type != "letter") {
      return;
    }
    var imageCoords = coordinates.get(image);
    var imagesToCache = [];

    var item = null;
    var span = null;
    var letters = lettersWithImages(inscription.parsedInscription);
    if (inscription.name == "TLZa1" || inscription.name == "HTWa1464") {
      console.log(letters);
    }
    var addedLabels = [];
    var concordanceItem = null;
    for (var i = 0; i < imageCoords.length; i++) {
      var area = imageCoords[i].coords;
      var word = letters[i];

      item = document.getElementById(word);
      if (!item) {
        var item = document.createElement("div");
        item.className = 'item-container concordance-item-container';
        item.id = word;

        var label = document.createElement("div");
        label.className = "label concordance-container-label";
        label.textContent = word;
        item.appendChild(label);
        container.appendChild(item);
      }
      concordanceItem = document.createElement("div");
      concordanceItem.className = "concordance-item";
      item.appendChild(concordanceItem);
      if (!addedLabels.includes(word)) {
        span = document.createElement("span");
        span.className = "concordance-label";
        span.textContent = inscription.name;
        concordanceItem.appendChild(span);
        addedLabels.push(word);
      }
      span = document.createElement("span");
      concordanceItem.appendChild(span);

      var imgToAdd = document.createElement('img');
      if (cachedImages.has(image)) {
        imgToAdd.src = cachedImages.get(image)[i];
      } else {
        var canvas = document.createElement('canvas');
        canvas.height = 40;
        canvas.width = 40 * (area.width / area.height);
        var ctx = canvas.getContext('2d', {alpha: false});
        ctx.drawImage(img, area.x, area.y, area.width, area.height, 0, 0, canvas.width, canvas.height);
        var dataURI = canvas.toDataURL();
        imgToAdd.src = dataURI;
        imagesToCache[i] = dataURI;
      }
      span.appendChild(imgToAdd);
    }
    if (!cachedImages.has(image)) {
      cachedImages.set(image, imagesToCache);
    }
  };
}

function addWordImagesToConcordance(img, image, inscription, type, container) {
  return function (e) {
    if (!coordinates.has(image)) {
      return;
    }
    // We're no longer displaying the type we loaded, abort.
    if (container.type != type) {
      return;
    }
    var imageCoords = coordinates.get(image);
    var imagesToCache = [];

    var currentWord = 0;
    var prevWord = -1;
    var item = null;
    var span = null;
    var letters = lettersWithImages(inscription.parsedInscription);
    for (var i = 0; i < imageCoords.length; i++) {
      var area = imageCoords[i].coords;
      currentWord = wordIndexForLetterIndex(inscription.name, i, currentWord);

      var tagsForWord = inscription.wordTags[currentWord];
      var word = stripErased(inscription.words[currentWord]);
      if (!shouldIncludeWord(word, type, tagsForWord)) {
        prevWord = currentWord;
        continue;
      }

      if (currentWord != prevWord) {
        item = document.getElementById(type + "-" + word);
        if (!item) {
          var item = document.createElement("div");
          item.className = 'item-container concordance-item-container';
          item.id = type + "-" + word;

          var label = document.createElement("div");
          label.className = "label";
          label.textContent = word;
          item.appendChild(label);
          container.appendChild(item);
        }
        var concordanceItem = document.createElement("div");
        concordanceItem.className = "concordance-item";
        var span = document.createElement("span");
        span.className = "concordance-label";
        span.textContent = inscription.name;
        concordanceItem.appendChild(span);
        span = document.createElement("span");
        concordanceItem.appendChild(span);
        item.appendChild(concordanceItem);
      }
      prevWord = currentWord;

      var imgToAdd = document.createElement('img');
      if (cachedImages.has(image)) {
        imgToAdd.src = cachedImages.get(image)[i];
      } else {
        var canvas = document.createElement('canvas');
        canvas.height = 40;
        canvas.width = 40 * (area.width / area.height);
        var ctx = canvas.getContext('2d', {alpha: false});
        ctx.drawImage(img, area.x, area.y, area.width, area.height, 0, 0, canvas.width, canvas.height);
        var dataURI = canvas.toDataURL();
        imgToAdd.src = dataURI;
        imagesToCache[i] = dataURI;
      }
      span.appendChild(imgToAdd);
    }
    if (!cachedImages.has(image)) {
      cachedImages.set(image, imagesToCache);
    }
  };
}

function loadConcordance(evt, type) {

  Array.prototype.map.call(document.getElementsByClassName("filters-container")[0]
   .getElementsByClassName("filter-command"), x => x.style.backgroundColor = "black");
  evt.target.style.backgroundColor = "purple";

  container.innerHTML = "";
  container.type = type;
  for (var inscription of inscriptions.values()) {
    loadWords(inscription, type, container);
  }
}

function initializeConcordance() {
  loadInscriptionLevelTags();
  loadAnnotations();

  container.type = "letter";
  for (var inscription of inscriptions.values()) {
    loadWords(inscription, "letter", container);
  }
}
