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

var result = document.getElementById("result");
result.addEventListener("animationend", function() { result.style.display = "none"; result.style.animationDelay = "0s";});

console.log("If you have any feedback or issues contact me @mwenge on Twitter or open a ticket at https://github.com/mwenge/LinearAExplorer/issues")
document.onkeydown = checkKey;
function checkKey(e) {
  if (search == document.activeElement) {
    return;
  }
  if (e.defaultPrevented) {
    return; // Do nothing if the event was already processed
  }
  if (e.ctrlKey) {
    return;
  }
  var menu_was_showing = help_menu.style.display != "none";
  help_menu.style.display = "none";
  switch(e.key) {
    case "?": // show help
      if (help_menu.style.display == "block") {
        help_menu.style.display = "none";
      } else if (!menu_was_showing) {
        help_menu.style.display = "block";
      }
      break;
    case "/": // '/' - focus search bar
      if (search == document.activeElement) {
        return;
      }
      search.focus();
    case "s": // 's' - sort inscriptions by closest edit distance to 
             // inscription currently hovered over
      var current = getInscriptionHoveredOver();
      if (current) {
        result.style.display = "inline-block";
        result.textContent = "Sorting by edit distance.";
        sortNearest(current);
        result.textContent = "Sorted by edit distance.";
      }
      break;
    case "t": // 't' - toggle translation
      toggleTranslation();
      break;
    case "w": // 'w' - highlight words according to frequency
      updateDisplayOfWordFrequency(document, true);
      break;
    case "i": // 'i' - copy image of inscription to clipboard
      var current = getInscriptionHoveredOver();
      result.style.animationDelay = "90s";
      result.style.display = "inline-block";
      result.textContent = "Copying Image to clipboard";
      if (current) {
        captureImage(current);
      }
      break;
    case "y": // 'y' - show commentary for inscription currently hovered over
      var current = getInscriptionHoveredOver();
      if (current) {
        showCommentaryForInscription(current.id);
      }
      break;
    case "z": // 'z' - zoom
      var current = getInscriptionHoveredOver();
      zoomItem(current);
      break;
    case "1": // '1 to 9' - save state to 1 to 9
    case "2": 
    case "3":
    case "4":
    case "5":
    case "6":
    case "7":
    case "8":
    case "9":
      result.style.display = "none";
      result.style.display = "inline-block";
      saveSearchTerms(e.keyCode);
      result.textContent = "Saved search terms";
      break;
    case "!": // '1 to 9' - save state to 1 to 9
    case "\"": 
    case "£":
    case "$":
    case "%":
    case "^":
    case "&":
    case "*":
    case "(":
      result.style.display = "none";
      result.style.display = "inline-block";
      loadSearchTerms(e.keyCode);
      result.textContent = "Loaded search terms";
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

function closeZoomedWindow(e) {
  zoomItem(null);
  e.stopPropagation();
}

function showCommentaryForInscription(inscription) {
  var inscriptionElement = document.getElementById(inscription);

  var commentBox = document.getElementById("comment-box-" + inscription);
  if (commentBox) {
    document.body.offsetTop;
    commentBox.style.top = inscriptionElement.offsetHeight + "px";
    if (commentBox.style.display == "block") {
      commentBox.style.display = "none";
      return;
    }
    commentBox.style.display = "block";
    return;
  }

  var commentBox = document.createElement("div")
  commentBox.className = 'comment-box';
  commentBox.id = 'comment-box-' + inscription;
  commentBox.style.top = inscriptionElement.offsetHeight + "px";
  commentBox.addEventListener("click", makeHideElements([commentBox]));
  inscriptionElement.appendChild(commentBox);

  inscription = inscription.replace(/[a-z]$/g, "");
  var commentaries = ["mycommentary/" + inscription + "/" + inscription + ".html", "commentary/" + inscription + ".html"]
  commentBox.innerHTML = "";
  var failures = 0;
  commentaries.forEach( commentary => {
    var xhttp = new XMLHttpRequest();
    xhttp.onloadend = function() {
        if (xhttp.status == 404) {
          failures++;
        } else {
          commentBox.innerHTML += xhttp.responseText;
          commentBox.style.display = "block";
        }
        if (failures >= commentaries.length) {
          commentBox.style.display = "none";
        }
    };
    xhttp.open("GET", commentary, true);
    xhttp.send();
  });
}

function getInscriptionHoveredOver() {
  var n = document.querySelector(":hover");
  var nn;
  while (n) {
    nn = n;
    if (nn.className == "item-container") {
      return nn;
    }
    n = nn.querySelector(":hover");
  }
  return null;
}

var cycleColor = (function () {
  var frequency = .3;
  var i = 0;
  return function () {
    i++;
    red   = Math.sin(frequency*i + 0) * 55 + 200;
    green = Math.sin(frequency*i + 2) * 55 + 200;
    blue  = Math.sin(frequency*i + 4) * 55 + 200;
    return "rgba(" + red + ", " + green + ", " + blue + ", 0.5)";
  }
})();

function hasMatchForHighlight(fullWordMatch, searchTerm, text) {
  if (fullWordMatch) {
    return (searchTerm == text);
  }
  return (text.includes(searchTerm));
}

function highlightMatchesInElement(element, searchTerm, highlightColor) {
  if (searchTerm == "") {
    return;
  }
  var fullWordMatch = searchTerm.includes("\"");
  searchTerm = searchTerm.replace(/\"/g, "");
  for (var j = 0; j < element.children.length; j++) {
    var span = element.children[j];
    if (hasMatchForHighlight(fullWordMatch, searchTerm, stripErased(span.textContent.trim()))) {
      var inscription = element.getAttribute("inscription");
      if (!inscription) {
        continue;
      }
      var translation = document.getElementById(inscription + "-translation-" + j);
      translation.style.backgroundColor = highlightColor;
      var transliteration = document.getElementById(inscription + "-transliteration-" + j);
      transliteration.style.backgroundColor = highlightColor;
      var transcription = document.getElementById(inscription + "-transcription-" + j);
      transcription.style.backgroundColor = highlightColor;
      highlightedSearchElements.push(translation);
      highlightedSearchElements.push(transliteration);
      highlightedSearchElements.push(transcription);
    }
  }
}

function clearHighlights() {
  for (var index in highlightedSearchElements) {
    highlightedSearchElements[index].style.backgroundColor = "";
  }
  highlightedSearchElements = [];
}

var highlightedSearchElements = [];
function updateSearch(event) {
  var searchTerm = event.target.value;
  if (!searchTerm.length) {
    return;
  }
  updateSearchTerms(event, searchTerm);
}

function makeMoveLens(lens, img, result, cx, cy) {
  return function(e) {
    result.style.display = "flex";
    lens.style.display = "block";
    result.style.width = (result.parentElement.offsetWidth * 2) + "px";
    result.style.height = result.parentElement.offsetHeight + "px";
    lens.style.width = (result.parentElement.offsetWidth / 2) + "px";
    lens.style.height = (result.parentElement.offsetHeight / 5) + "px";

    var availableHeight = result.parentElement.getBoundingClientRect().top;
    if (availableHeight < (result.parentElement.offsetHeight / 2)) {
      result.style.top = result.parentElement.offsetHeight + "px";
    } else {
      result.style.top = "-" + result.parentElement.offsetHeight + "px";
    }

    /* Calculate the ratio between itemZoom DIV and lens: */
    cx = result.offsetWidth / lens.offsetWidth;
    cy = result.offsetHeight / lens.offsetHeight;
    result.style.backgroundSize = (img.width * cx) + "px " + (img.height * cy) + "px";

    var pos, x, y;
    /* Prevent any other actions that may occur when moving over the image */
    e.preventDefault();
    /* Get the cursor's x and y positions: */
    pos = getCursorPos(e);
    /* Calculate the position of the lens: */
    x = pos.x - (lens.offsetWidth / 2);
    y = pos.y - (lens.offsetHeight / 2);
    /* Prevent the lens from being positioned outside the image: */
    if (x > img.width - lens.offsetWidth) {x = img.width - lens.offsetWidth;}
    if (x < 0) {x = 0;}
    if (y > img.height - lens.offsetHeight) {y = img.height - lens.offsetHeight;}
    if (y < 0) {y = 0;}
    /* Set the position of the lens: */
    lens.style.left = x + "px";
    lens.style.top = y + "px";
    /* Display what the lens "sees": */
    result.style.backgroundPosition = "-" + (x * cx) + "px -" + (y * cy) + "px";

    function getCursorPos(e) {
      var a, x = 0, y = 0;
      e = e || window.event;
      /* Get the x and y positions of the image: */
      a = img.getBoundingClientRect();
      /* Calculate the cursor's x and y coordinates, relative to the image: */
      x = e.pageX - a.left;
      y = e.pageY - a.top;
      /* Consider any page scrolling: */
      x = x - window.pageXOffset;
      y = y - window.pageYOffset;
      return {x : x, y : y};
    }
  };
}

function makeGiveUpOnImages(elements) {
  return function(e) {
    for (var index in elements) {
      elements[index].remove();
    }
    e.stopPropagation();
  };
}

function makeHideElements(elements) {
  return function(e) {
    for (var index in elements) {
      elements[index].style.display = "none";
    }
    e.stopPropagation();
  };
}

function addImageToItem(item, imageToAdd, name) {
  var itemShell = document.createElement("div");
  itemShell.className = 'item-shell';
  item.appendChild(itemShell);

  var itemZoom = document.createElement("div");
  itemZoom.className = 'item-zoom';
  itemShell.appendChild(itemZoom);

  var label = document.createElement("div");
  label.className = 'label';
  label.textContent = name;
  itemZoom.appendChild(label);

  var inscriptionImage = document.createElement("div");
  inscriptionImage.className = 'item';
  var imageWrapper = document.createElement("div");
  imageWrapper.setAttribute("class", "img-wrapper");
  inscriptionImage.appendChild(imageWrapper);

  var lens = document.createElement("div");
  lens.setAttribute("class", "img-zoom-lens");
  imageWrapper.appendChild(lens);

  var img = document.createElement("img");
  img.src = imageToAdd;
  img.height = "200";
  img.addEventListener("error", makeGiveUpOnImages([inscriptionImage, itemZoom]));
  imageWrapper.appendChild(img);
  itemShell.appendChild(inscriptionImage);

  itemZoom.style.backgroundImage = "url('" + img.src + "')";
  lens.addEventListener("mousemove", makeMoveLens(lens, img, itemZoom));
  img.addEventListener("mousemove", makeMoveLens(lens, img, itemZoom));
  itemShell.addEventListener("mouseout", makeHideElements([lens, itemZoom]));
}


var captureImage = function(root) {
  html2canvas(root, {
    backgroundColor: white
  })
    .then(function(canvas) {
      canvas.toBlob(function(blob) { 
            const item = new ClipboardItem({ "image/png": blob });
            navigator.clipboard.write([item]); 
            result.style.animationDelay = "0s";
            result.textContent = "Image copied to clipboard";
      });
    })
};

with ({zoomedElement : null}) var zoomItem = function(item) {
  var itemToZoom = item;
  if (zoomedElement) {
    itemToZoom = zoomedElement;
    zoomedElement = null;
  } else {
    zoomedElement = item;
  }
  if (!itemToZoom) {
    return;
  }
  
  Array.prototype.map.call(itemToZoom.getElementsByClassName("item-shell"), x => x.classList.toggle("zoomed-item"));
  Array.prototype.map.call(itemToZoom.getElementsByClassName("item"), x => x.classList.toggle("zoomed-item"));
  Array.prototype.map.call(itemToZoom.getElementsByClassName("close-window"), x => x.classList.toggle("zoomed-close-window"));
  itemToZoom.classList.toggle("zoomed-item-container");
  document.body.offsetTop;
  showCommentaryForInscription(itemToZoom.id);
}

with ({displayed : true}) var updateDisplayOfWordFrequency = function(root, update) {
    if (update) {
      displayed = !displayed;
    }
    Array.prototype.map.call(root.getElementsByTagName("span"), x => displayed ? x.classList.add("word-frequency-none") : x.classList.remove("word-frequency-none"));
}

function getClassNameForWord(word) {
  word = stripErased(word);
  var stem = "word-frequency-";
  if (wordsInCorpus.has(word)) {
    var wordCount = Math.min(10, wordsInCorpus.get(word));
    return stem + wordCount; 
  }
  return stem + "1"; 
}

function loadInscription(inscription) {
  if (inscription.element) {
    return null;
  }

  var item = document.createElement("div");
  item.className = 'item-container';
  item.id = inscription.name;
  item.setAttribute("onclick", "showCommentaryForInscription('" + inscription.name + "')");

  inscription.images.forEach( image => {
    addImageToItem(item, image, inscription.name)
  });
  inscription.tracingImages.forEach( image => {
    addImageToItem(item, image, inscription.name)
  });


  var transcript = document.createElement("div");
  transcript.className = 'item text-item';
  transcript.setAttribute("inscription", inscription.name);
  for (var i = 0; i < inscription.words.length; i++) {
    var word = inscription.words[i];
    var elementName = word == "\n" ? "br" : "span";
    var span = document.createElement(elementName);
    if (elementName == "span") {
      span.textContent = word;
      span.className = getClassNameForWord(word);
      span.classList.add("word-frequency-none");

      var searchTerm = stripErased(word);
      span.id = inscription.name + "-transcription-" + i;
      span.setAttribute("onmouseover", "highlightWords(event, '" + inscription.name + "', '" + i + "')");
      span.setAttribute("onmouseout", "clearHighlight(event, '" + inscription.name + "', '" + i + "')");
      span.setAttribute("onclick", "updateSearchTerms(event, '\"" + span.textContent + "\"')");
    }
    transcript.appendChild(span);
  }
  item.appendChild(transcript);

  var transliteration = populateText(inscription, "transliteration", inscription.transliteratedWords);
  item.appendChild(transliteration);

  var translation = populateText(inscription, "translation", inscription.translatedWords);
  translation.style.display = "none";
  item.appendChild(translation);

  var tagContainer = document.createElement("div");
  tagContainer.className = 'tag-container';
  item.appendChild(tagContainer);

  if (inscription.scribe) {
    var label = document.createElement("div");
    label.className = 'tag';
    label.textContent = inscription.scribe;
    tagContainer.appendChild(label);
    label.setAttribute("onclick", "updateSearchTerms(event, '\"" + inscription.scribe + "\"')");
  }
  if (tags.has(inscription.name)) {
    tags.get(inscription.name).forEach( tag => {
      var label = document.createElement("div");
      label.className = 'tag';
      label.textContent = tag;
      tagContainer.appendChild(label);
      label.setAttribute("onclick", "updateSearchTerms(event, '\"" + tag + "\"')");
    });
  }

  var label = document.createElement("div");
  label.className = "label";
  label.textContent = inscription.name;
  item.appendChild(label);

  var label = document.createElement("div");
  label.className = "close-window";
  label.id = inscription.name + "-close-window";
  label.onclick = closeZoomedWindow;
  item.appendChild(label);

  inscription.element = item;
  container.appendChild(item);
  inscriptionsToLoad.delete(inscription.name);
  updateDisplayOfWordFrequency(item, false);

  return item;
}

function populateText(inscription, type, words) {
  transcript = document.createElement("div");
  transcript.className = 'item text-item ' + type + '-item';
  transcript.setAttribute("inscription", inscription.name);
  for (var i = 0; i < words.length; i++) {
    var word = words[i];
    var elementName = word == "\n" ? "br" : "span";
    var span = document.createElement(elementName);
    if (elementName == "span") {
      span.textContent = word + " ";
      span.className = getClassNameForWord(inscription.words[i]);
      span.classList.add("word-frequency-none");
      span.id = inscription.name + "-" + type + "-" + i;
      span.setAttribute("onmouseover", "highlightWords(event, '" + inscription.name + "', '" + i + "')");
      span.setAttribute("onmouseout", "clearHighlight(event, '" + inscription.name + "', '" + i + "')");
      span.setAttribute("onclick", "updateSearchTerms(event, '\"" + inscription.words[i] + "\"')");
    }
    transcript.appendChild(span);
  }
  transcript.appendChild(document.createElement("br"));
  transcript.appendChild(document.createElement("br"));
  return transcript;
}

function toggleTranslation() {
  Array.prototype.map.call(document.getElementsByClassName("translation-item"), x => x.style.display == "none" ? x.style.display = "block" : x.style.display = "none");
  Array.prototype.map.call(document.getElementsByClassName("transliteration-item"), x => x.style.display == "none" ? x.style.display = "block" : x.style.display = "none");
}

function addWordTip(word, inscription) {
  word = stripErased(word.trim());
  var wordCount = 0;
  if (wordsInCorpus.has(word)) {
    wordCount = wordsInCorpus.get(word) - 1;
  }
  var tip = document.getElementById(inscription + "-tip");
  var inscriptionElement = document.getElementById(inscription);
  if (!tip) {
    var tip = document.createElement("div")
    tip.className = 'word-tip';
    tip.id = inscription + "-tip";
    inscriptionElement.appendChild(tip);
  }
  tip.style.display = "block";
  tip.innerHTML = "";

  var wordCommentElement = document.createElement("div");
  wordCommentElement.className = "lexicon";
  wordCommentElement.textContent = lexicon.get(word);

  if (lexicon.has(word)) {
    var wordCommentElement = document.createElement("div");
    wordCommentElement.className = "lexicon";
    wordCommentElement.textContent = lexicon.get(word);
    tip.appendChild(wordCommentElement);
  }

  var tipText = "";
  switch(wordCount) {
    case 0:
      tipText = "There is no other instance of this word."
      break;
    case 1:
      tipText = wordCount + " other instance of this word. Click to add to filter."
      break;
    default:
      tipText = wordCount + " other instances of this word. Click to add to filter."
  }
  var wordCommentElement = document.createElement("span");
  wordCommentElement.className = "tip-text";
  wordCommentElement.textContent = tipText;
  tip.appendChild(wordCommentElement);

  var availableHeight = inscriptionElement.getBoundingClientRect().top;
  if (availableHeight < tip.offsetHeight) {
    tip.style.top = inscriptionElement.offsetHeight + "px";
  } else {
    tip.style.top = "-" + tip.offsetHeight + "px";
  }
}

function updateTipText(string) {
  var tip = document.getElementById("tip");
  tip.innerHTML = string;
}

function highlightWords(evt, name, index) {
  var items = ["transcription", "translation", "transliteration"];
  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    var element = document.getElementById(name + "-" + item + "-" + index);
    if (item == "transcription") {
      addWordTip(element.textContent, name);
    }
    if (element.style.backgroundColor) {
      continue;
    }
    element.style.backgroundColor = "yellow";
  }
}

function clearHighlight(evt, name, index) {
  var tip = document.getElementById(name + "-tip");
  if (tip) {
    tip.style.display = "none";
  }
  var items = ["transcription", "transliteration", "translation"];
  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    var element = document.getElementById(name + "-" + item + "-" + index);
    if (highlightedSearchElements.includes(element)) {
      continue;
    }
    element.style.backgroundColor = "";
  }
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

  item.setAttribute("highlightColor", cycleColor());

  container.appendChild(item);
  applySearchTerms();
  evt.stopPropagation();
}

function saveSearchTerms(key) {
  var number = key - 48;
  var container = document.getElementById("search-terms");
  localStorage.setItem(key, container.innerHTML);
  changeIcon("icons/" + number + '.png');
}

function loadSearchTerms(key) {
  var number = key - 48;
  var container = document.getElementById("search-terms");
  container.innerHTML = localStorage.getItem(key);
  applySearchTerms();
  changeIcon("icons/" + number + '.png');
}

function hasMatch(fullWordMatch, searchTerm, inscription) {
  if (!fullWordMatch) {
    var containsTerm = inscription.translatedWords.filter(word => word.includes(searchTerm)).length > 0;
    return (containsTerm ||
        inscription.transcription.includes(searchTerm) ||
        inscription.name.includes(searchTerm) ||
        inscription.words.includes(searchTerm) ||
        inscription.words.map(x => stripErased(x)).includes(searchTerm) ||
        (tags.has(inscription.name) && tags.get(inscription.name).includes(searchTerm)) ||
        inscription.scribe == searchTerm);
  }

  var containsTerm = inscription.translatedWords.filter(word => word == searchTerm).length > 0;
  return (containsTerm ||
      inscription.name == searchTerm ||
      inscription.words.includes(searchTerm) ||
      inscription.words.map(x => stripErased(x)).includes(searchTerm) ||
      (tags.has(inscription.name) && tags.get(inscription.name).includes(searchTerm)) ||
      inscription.scribe == searchTerm);
}

function applySearchTerms() {
  var searchTerms = document.getElementById("search-terms");
  var numberOfSearchTerms = searchTerms.children.length;	
  var searchTermValues = Array.prototype.slice.call(searchTerms.children)
                         .map(x => stripErased(x.textContent));
  clearHighlights();

  for (var inscription of inscriptions.values()) {
    if (!numberOfSearchTerms) {
      if (inscription.element) {
        inscription.element.style.display = "flex";
      }
      continue;
    }
    var shouldDisplay = false;
    searchTermValues.forEach( searchTerm => {
      var fullWordMatch = searchTerm.includes("\"");
      searchTerm = searchTerm.replace(/\"/g, "");

      if (hasMatch(fullWordMatch, searchTerm, inscription)) {
        shouldDisplay = true;
      }
    });

    if (!shouldDisplay) {
      if (inscription.element) {
        inscription.element.style.display = "none";
      }
      continue;
    }
    var newElement = loadInscription(inscription);
    if (!newElement) {
      inscription.element.style.display = "flex";
    }
    for (index in searchTerms.children) {
      var searchElement = searchTerms.children.item(index);
      var term = searchElement.textContent;
      for (var j = 0; j < inscription.element.children.length; j++) {
        var element = inscription.element.children[j];
        var highlightColor = searchElement.getAttribute("highlightColor");
        highlightMatchesInElement(element, term, highlightColor);
      }
    }
  }
}

function removeFilter(evt) {
  evt.target.parentElement.removeChild(evt.target);
  applySearchTerms();
}

function resetSort(evt) {
  var element = evt.target;
  element.style.display = "none";
  var p = document.getElementById('container');
  Array.prototype.slice.call(p.children)
    .map(function (x) { return p.removeChild(x); })
    .sort(function(a, b) {
          var x = a.id;
          var y = b.id;
          if (x < y) {
            return -1;
          }
          if (x > y) {
            return 1;
          }
          return 0;
    })
    .forEach(function (x) { p.appendChild(x); });
}

function updateSortStatus(inscription) {
  var element = document.getElementById("sort-status");
  element.textContent = "Sorted by " + inscription;
  element.style.display = "flex";
}

function searchForWord(evt, name, index) {
  var element = document.getElementById(name + "-transcription-" + index);
  var searchTerm = stripErased(element.textContent);
  var searchBox = document.getElementById("search");
  searchBox.value = searchTerm;
  searchBox.dispatchEvent(new InputEvent("input"));
}

var inscriptionsAsArray = Array.from(inscriptions.entries());	
var inscriptionsToLoad = new Map(inscriptions);
// create config object: rootMargin and threshold
// are two properties exposed by the interface
const config = {
  rootMargin: '0px 0px 50px 0px',
  threshold: 0
};

// Load inscriptions as they come into view
let observer = new IntersectionObserver(function(entries, self) {
  entries.forEach(entry => {
    // Only load new inscriptions if a search isn't active
    if(entry.isIntersecting && !highlightedSearchElements.length) {
		  var key = inscriptionsToLoad.keys().next().value;	
      if (key) {
        var visibleInscription = loadInscription(inscriptions.get(key));
        observer.observe(visibleInscription);
      }
      self.unobserve(entry.target);
    }
  });
}, config);

function loadExplorer() {
  for (var i = 0; i < 10; i++) {
    var key = inscriptionsToLoad.keys().next().value;	
    var visibleInscription = loadInscription(inscriptions.get(key));
    observer.observe(visibleInscription);
  }
}

function levensteinDistance(a, b, inscriptions, target) {
  var s = inscriptions.get(a.id).parsedInscription.replace(/𐝫|\n/g, "");
  var t = inscriptions.get(b.id).parsedInscription;
  var x = s.levenstein(target);
  var y = t.levenstein(target);
  if (x < y) {
    return -1;
  }
  if (x > y) {
    return 1;
  }
  return 0;
}

function intersect(a, b) {
    var t;
    if (b.length > a.length) t = b, b = a, a = t;
    return a.filter(function (e) {
        return b.indexOf(e) > -1;
    }).length;
}

function useWord(word) {
  if (!word) {
    return false;
  }
  if (word == '\u{1076b}')
    return false; 
  if (word >= '\u{10100}' && word <= '\u{1013f}') {
    return false;
  }
  if (word >= '\u{10740}' && word <= '\u{10755}') {
    return false;
  }
  if (word == '\n') {
    return false;
  }
  return true;
}

function stripErased(word) {
  return word.replace(/\u{1076b}/gu, "");
}

function similarity(a, b, inscriptions, target) {
  var s = inscriptions.get(a.id).words.map(stripErased).filter(useWord);
  var t = inscriptions.get(b.id).words.map(stripErased).filter(useWord);
  var x = intersect(s, target);
  var y = intersect(t, target);
  if (x > y) {
    return -1;
  }
  if (x < y) {
    return 1;
  }
  return 0;
}

function sortNearest(current) {
  var target = inscriptions.get(current.id).words.map(stripErased).filter(useWord);
  updateTipText("Sorting..");
  var p = document.getElementById('container');
  Array.prototype.slice.call(p.children)
    .map(function (x) { return p.removeChild(x); })
    .sort(function(a, b) { return similarity(a, b, inscriptions, target); })
    .forEach(function (x) { p.appendChild(x); });
  updateTipText("");
  updateSortStatus(current.id);
} 

String.prototype.levenstein = function(string) {
  if (typeof String.prototype.levenstein.cachedDistances == "undefined") {
    String.prototype.levenstein.cachedDistances = new Map();
  }
	var a = this, b = string + "", m = [], i, j, min = Math.min;
  if (String.prototype.levenstein.cachedDistances.has(a+b)) {
    return String.prototype.levenstein.cachedDistances.get(a+b);
  }

	if (!(a && b)) return (b || a).length;

	for (i = 0; i <= b.length; m[i] = [i++]);
	for (j = 0; j <= a.length; m[0][j] = j++);

	for (i = 1; i <= b.length; i++) {
		for (j = 1; j <= a.length; j++) {
			m[i][j] = b.charAt(i - 1) == a.charAt(j - 1)
				? m[i - 1][j - 1]
				: m[i][j] = min(
					m[i - 1][j - 1] + 1, 
					min(m[i][j - 1] + 1, m[i - 1 ][j] + 1))
		}
	}

	var result = m[b.length][a.length];
  String.prototype.levenstein.cachedDistances.set(a+b, result);
  String.prototype.levenstein.cachedDistances.set(b+a, result);
  return result;
}
