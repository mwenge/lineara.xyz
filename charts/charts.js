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
    case "/": // '/' - focus search bar
      toggleColor(document.getElementById("search-command"));
      showSearch();
      break;
    case "c": // 'c' - clear search terms
      var container = document.getElementById("search-terms");
      container.innerHTML = "";
      applySearchTerms();
      break;
    default:
      return;
  }
  // Cancel the default action to avoid it being handled twice
  e.preventDefault();
}

function showSearch() {
  var search = document.getElementById('search');
  var isVisible = search.style.visibility == "visible";
  if (isVisible) {
    search.style.visibility = 'hidden';
    return;
  }

  var container = document.getElementById("chart-filter-details-container");
  container.style.visibility = "hidden";

  search.style.visibility = "visible";
  search.focus();
  search.addEventListener("keyup", function(event) {
      if (event.keyCode === 13) {
        event.preventDefault();
        updateSearch(event);
      }
  }); 
}

var highlightedSearchElements = [];
function updateSearch(event) {
  var searchTerm = event.target.value;
  if (!searchTerm.length) {
    return;
  }
  updateSearchTerms(event, searchTerm);
}

function updateSearchTerms(evt, searchTerm) {
  var searchTerm = stripErased(searchTerm);
  var container = document.getElementById("search-terms");
  var existingElement = document.getElementById("search-for-" +  searchTerm);
  if (existingElement) {
    return;
  }
  var item = document.createElement("div");
  item.className = 'search-term';
  item.textContent = searchTerm;
  item.id = "search-for-" + searchTerm;
  item.setAttribute("term", searchTerm);
  item.setAttribute("onclick", "removeFilter(event)");

  var color = cycleColor();
  item.style.backgroundColor = color;
  item.style.opacity = "0.8";
  item.setAttribute("highlightColor", color);

  container.appendChild(item);
  applySearchTerms();
  evt.stopPropagation();
}

function removeFilter(evt) {
  evt.target.parentElement.removeChild(evt.target);
  applySearchTerms();
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

function lettersInWord(word) {
  var splitter = new GraphemeSplitter();
  return splitter.countGraphemes(word);
}

// Chart
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

function isNumber(character) {
  var unicode = character.codePointAt(0);
  if (unicode < 65792 || unicode > 65855) {
    return false;
  }
  return true;
}

function applySearchTerms() {
  var searchTerms = document.getElementById("search-terms");
  var numberOfSearchTerms = searchTerms.children.length;	
  var searchTermValues = Array.prototype.slice.call(searchTerms.children)
                         .map(x => stripErased(x.textContent));
  var numberOfTags = activeTags.length;
  var hasSearchTerm = (numberOfSearchTerms + numberOfTags > 0)

  for (index in container.children) {
    var element = container.children.item(index);
    if (!hasSearchTerm) {
      element.style.display = "block";
      continue;
    }
    element.style.display = "none";
    [activeTags, searchTermValues].flat(2).forEach( tag => {
      if (element.name == tag) {
        element.style.display = "block";
      }
    });
  }
}

function toggleTag(event, tag) {
  if (activeTags.includes(tag)) {
    activeTags.splice(activeTags.indexOf(tag), 1);
  } else {
    activeTags.push(tag);
  }
  var element = event.target;
  // Don't change the color of the tag if it is not being clicked from the menu
  if (element.className == "charts-filter-tag") {
    var color = element.style.backgroundColor;
    element.style.color = color == tagColors[tag] ? "white" : "black";
    element.style.backgroundColor = color == tagColors[tag] ? "black" : tagColors[tag];
  }
  applySearchTerms();
}

var tagColors = {};
function toggleMetadatum(event, datum) {
  if (!tagColors[datum]) {
    tagColors[datum] = cycleColor(); 
  }

  toggleTag(event, datum);
  event.stopPropagation();
}

function addLetterImagesToChart(img, image, inscription, container) {
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
    for (var i = 0; i < imageCoords.length; i++) {
      var area = imageCoords[i].coords;
      var word = letters[i];

      if (word == "—" || word == '') {
        continue;
      }

      item = document.getElementById(word);
      if (!item) {
        var d1 = document.createElement("div");
        d1.className = 'concordance-item-wrapper';
        container.appendChild(d1);
        
        var item = document.createElement("div");
        item.className = 'concordance-item-container';
        item.id = word;
        item.name = word;
        d1.appendChild(item);

        var label = document.createElement("div");
        label.className = "concordance-container-label";
        label.textContent = word + " in the Linear A corpus";
        d1.appendChild(label);

        var filterItem = document.createElement("div");
        filterItem.className = 'charts-filter-tag';
        filterItem.textContent = word;
        filterItem.setAttribute("onclick", "toggleMetadatum(event, '" + word + "')");
        filterItem.style.backgroundColor = "black";
        filterItem.style.color = "white";
        filterDetailsContainer.appendChild(filterItem);
      }
      var d1 = document.createElement("div");
      d1.className = "inscription-container";

      var imageContainer = document.createElement("div");
      imageContainer.className = "concordance-item";
      d1.appendChild(imageContainer);

      var span = document.createElement("div");
      span.className = "concordance-label";
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

function addLetterImagesToScribeChart(img, image, inscription, container) {
  return function (e) {
    if (!coordinates.has(image)) {
      return;
    }
    // We're no longer displaying letters, abort.
    if (container.type != "scribe") {
      return;
    }
    var scribe = (inscription.scribe != '') ? inscription.scribe : inscription.name;
    if (!scribesAndMultipleGlyphs.has(scribe)) {
      return;
    }
    let multipleGlyphs = scribesAndMultipleGlyphs.get(scribe);
    var imageCoords = coordinates.get(image);
    var imagesToCache = [];

    var item = null;
    var span = null;
    var letters = lettersWithImages(inscription.parsedInscription);
    for (var i = 0; i < imageCoords.length; i++) {
      var area = imageCoords[i].coords;
      var word = letters[i];
      if (!multipleGlyphs.includes(word)) {
        continue;
      }

      if (word == "—" || word == '') {
        continue;
      }
  
      var scribeContainer = document.getElementById(scribe);
      if (!scribeContainer) {
        var scribeContainer = document.createElement("div");
        scribeContainer.className = 'concordance-item-wrapper';
        scribeContainer.id = scribe;
        container.appendChild(scribeContainer);

        var label = document.createElement("div");
        label.className = "concordance-container-label";
        label.textContent = scribe;
        scribeContainer.appendChild(label);
        
      }

      var wordInScribe = word + '-' + scribe;
      var wordInScribeContainer = document.getElementById(wordInScribe);
      if (!wordInScribeContainer) {
        var d1  = document.createElement("div");
        d1.className = 'scribeview-concordance-item-container';
        scribeContainer.appendChild(d1);
        var wordInScribeContainer = document.createElement("div");
        wordInScribeContainer.className = 'scribeview-concordance-item-container';
        wordInScribeContainer.id = wordInScribe
        wordInScribeContainer.name = wordInScribe;
        d1.appendChild(wordInScribeContainer);

        var label = document.createElement("div");
        label.className = "concordance-container-label";
        label.textContent = word;
        d1.appendChild(label);


      }

      var d1 = document.createElement("div");
      d1.className = "scribeview-inscription-container";

      var imageContainer = document.createElement("div");
      imageContainer.className = "concordance-item";
      d1.appendChild(imageContainer);

      var span = document.createElement("div");
      span.className = "concordance-label";
      span.textContent = inscription.name;
      d1.appendChild(span);

      wordInScribeContainer.appendChild(d1);
      
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
function addWordImagesToChart(img, image, inscription, type, container) {
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
    var imageSpan = null;
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
          var d1 = document.createElement("div");
          d1.className = 'concordance-item-wrapper';
          container.appendChild(d1);
          
          var item = document.createElement("div");
          item.className = 'concordance-item-container';
          if (lettersInWord(word) > 1) {
            item.className += " concordance-item-word-container";
          }

          item.id = type + "-" + word;
          item.name = type + "-" + word;
          d1.appendChild(item);

          var label = document.createElement("div");
          label.className = "concordance-container-label";
          label.textContent = word + " in the Linear A corpus";
          d1.appendChild(label);

          var filterItem = document.createElement("div");
          filterItem.className = 'charts-filter-tag';
          filterItem.textContent = word;
          filterItem.setAttribute("onclick", "toggleMetadatum(event, '" + word + "')");
          filterItem.style.backgroundColor = "black";
          filterItem.style.color = "white";
          filterDetailsContainer.appendChild(filterItem);
        }
        var d1 = document.createElement("div");
        d1.className = "inscription-container";

        var imageContainer = document.createElement("div");
        imageContainer.className = "concordance-item";
        d1.appendChild(imageContainer);
        imageSpan = document.createElement("span");
        imageContainer.appendChild(imageSpan);

        var span = document.createElement("div");
        span.className = "concordance-label";
        span.textContent = inscription.name;
        d1.appendChild(span);

        item.appendChild(d1);
      }
      prevWord = currentWord;

      var canvas = document.createElement('canvas');
      canvas.height = 40;
      canvas.width = 40 * (area.width / area.height);
      var ctx = canvas.getContext('2d', {alpha: false});
      ctx.drawImage(img, area.x, area.y, area.width, area.height, 0, 0, canvas.width, canvas.height);
      imageSpan.appendChild(canvas);
    }
  };
}

function loadWords(inscription, type, container) {
  var imagesToLoad = [];
  if (loadFacsimiles) {
    imagesToLoad = imagesToLoad.concat(inscription.facsimileImages);
  }
  if (loadPhotos) {
    imagesToLoad = imagesToLoad.concat(inscription.images);
  }
  imagesToLoad.forEach( image => {
    var img = new Image();
    img.src = "../" + encodeURIComponent(image);
    if (["word", "number", "ideogram"].includes(type)) {
      img.addEventListener("load", addWordImagesToChart(img, image, inscription, type, container));
    } else if (["scribe"].includes(type)) {
      img.addEventListener("load", addLetterImagesToScribeChart(img, image, inscription, container));
    } else if (["letter"].includes(type)) {
      img.addEventListener("load", addLetterImagesToChart(img, image, inscription, container));
    }
  });
}

function loadChart(evt, type) {

  Array.prototype.map.call(document.getElementsByClassName("filters-container")[0]
   .getElementsByClassName("filter-command"), x => x.style.backgroundColor = "black");
  evt.target.style.backgroundColor = "purple";

  if (container.type == type) {
    filterDetailsContainer.style.visibility = filterDetailsContainer.style.visibility == "hidden" ? "visible" : "hidden";
    var search = document.getElementById('search');
    search.style.visibility = 'hidden';
    return;
  }

  container.innerHTML = "";
  filterDetailsContainer.innerHTML = "";
  filterDetailsContainer.style.visibility = "hidden";
  document.getElementById("search-terms").innerHTML = "";

  container.type = type;
  activeTags = [];
  for (var inscription of inscriptions.values()) {
    loadWords(inscription, type, container);
  }
}

var loadPhotos = false;
var loadFacsimiles = true;
var togglePhotos = function(e) {
    if (loadPhotos && !loadFacsimiles) {
      return;
    }
    loadPhotos = !loadPhotos;
    e.target.style.backgroundColor = e.target.style.backgroundColor == "black" ? "purple" : "black"; 
};
var toggleFacsimiles = function(e) {
    if (loadFacsimiles && !loadPhotos) {
      return;
    }
    loadFacsimiles = !loadFacsimiles;
    e.target.style.backgroundColor = e.target.style.backgroundColor == "black" ? "purple" : "black"; 
};

function getAllScribes() {
  function getLetters(parsedInscription) {
    var splitter = new GraphemeSplitter();
    var letters = stripErased(parsedInscription);
    letters = letters.replace(/\n/gu, "");
    letters = letters.replace(/𐄁/gu, "");
    return splitter.splitGraphemes(letters);
  }
  let scribes = new Map();
  for (var inscription of inscriptions.values()) {
    let name = inscription.name.replace(/[a-z]$/g, "");
    let scribe = (inscription.scribe != '') ? inscription.scribe : name;
    let parsedInscription = getLetters(inscription.parsedInscription);
    if (scribes.has(scribe)) {
      let ins = scribes.get(scribe);
      ins = ins.concat(Array.from(parsedInscription));
      scribes.set(scribe, ins);
    } else {
      scribes.set(scribe, Array.from(parsedInscription));
    }
  }
  let multipleLetters = new Map();
  scribes.forEach((v,k) => {
    let duplicates = v.filter((v, i, a) => a.indexOf(v) != i).filter((v, i, a) => a.indexOf(v) === i);
    if (duplicates.length) {
      multipleLetters.set(k, duplicates);
    }
  });
  return multipleLetters;
}

var filterDetailsContainer = null;
var activeTags = [];
let scribesAndMultipleGlyphs = getAllScribes();
console.log(scribesAndMultipleGlyphs);

function initializeChart() {
  var supports = [];
  var scribes = [];
  var findspots = [];

  loadInscriptionLevelTags();
  loadAnnotations();

  filterDetailsContainer = document.getElementById("chart-filter-details-container");

  container.type = "scribe";
  for (var inscription of inscriptions.values()) {
    loadWords(inscription, "scribe", container);
  }

  function loadInscriptionLevelTags() {
    for (var inscription of inscriptions.values()) {
      for (var item of [[supports, inscription.support],
                        [scribes, inscription.scribe],
                        [findspots, inscription.findspot],
                        ]) {
        var tag = item[1];
        if (!tag) {
          continue;
        }
        if (item[0].includes(tag)) {
          continue;
        }
        item[0].push(tag);
      }
    }
  }

  var wordtags = [];
  function loadAnnotations() {
    var collectedWordTags = [];
    for (var annotation of wordAnnotations) {
      var inscription = inscriptions.get(annotation.name);
      inscription.wordTags = [];
      for (var word of annotation.tagsForWords) {
        inscription.wordTags.push(word.tags);
        collectedWordTags.push(...word.tags);
      }
    }

    // Dedupe the list
    wordtags = collectedWordTags.filter((v, i, a) => a.indexOf(v) === i);

    // Filter out the site names
    var sites = Array.from(inscriptions.values()).map(x => x.site).filter((v, i, a) => a.indexOf(v) === i);
    wordtags = wordtags.filter((v, i, a) => !sites.includes(v));
  }
}
