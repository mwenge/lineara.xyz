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
console.log("If you have any feedback or issues contact me @mwenge on Twitter")
document.onkeydown = checkKey;
function checkKey(e) {
  e = e || window.event;
  console.log(e.keyCode)
  switch(e.keyCode) {
    case 191:
      // /
      if (search == document.activeElement) {
        return true;
      }
      search.focus();
      return false;
  }
}

function highlightMatchesInElement(element, searchTerm) {
  for (var j = 0; j < element.children.length; j++) {
    var span = element.children[j];
    if (searchTerm != "" && span.textContent.includes(searchTerm)) {
      var inscription = element.getAttribute("inscription");
      if (!inscription) {
        continue;
      }
      var translation = document.getElementById(inscription + "-translation-" + j);
      translation.style.backgroundColor = "yellow";
      var transcription = document.getElementById(inscription + "-transcription-" + j);
      transcription.style.backgroundColor = "yellow";
      highlightedSearchElements.push(translation);
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
  clearHighlights();
  document.getElementById("search-terms").innerHTML = "";
  var searchTerm = event.target.value;
  var allContainers = document.getElementsByClassName('item-container');
  for (var i = 0; i < allContainers.length; i++) {
    var container = allContainers[i];
    for (var j = 0; j < container.children.length; j++) {
      var element = container.children[j];
      if (searchTerm == "" || element.textContent.includes(searchTerm)) {
        element.parentElement.style.display = "flex";
        highlightMatchesInElement(element, searchTerm);
        break;
      } else {
        element.parentElement.style.display = "none";
      }
    }
  } 
}

var wordsInCorpus = new Map();
function loadInscription(inscription) {
  var item = document.createElement("div");
  item.className = 'item-container';
  item.id = inscription.name;

  var inscriptionImage = document.createElement("div");
  inscriptionImage.className = 'item';
  var img = document.createElement("img");
  img.src = inscription.image;
  img.height = "200";
  inscriptionImage.appendChild(img);
  item.appendChild(inscriptionImage);

  inscriptionImage = document.createElement("div");
  inscriptionImage.className = 'item';
  var img = document.createElement("img");
  img.src = inscription.tracingImage;
  img.height = "200";
  inscriptionImage.appendChild(img);
  item.appendChild(inscriptionImage);

  var transcript = document.createElement("div");
  transcript.className = 'item';
  transcript.setAttribute("inscription", inscription.name);
  for (var i = 0; i < inscription.words.length; i++) {
    var word = inscription.words[i];
    var elementName = word == "\n" ? "br" : "span";
    var span = document.createElement(elementName);
    if (elementName == "span") {
      span.textContent = word;

      var searchTerm = word.replace(/𐝫/g, "");
      if (wordsInCorpus.has(searchTerm)) {
        wordsInCorpus.set(searchTerm, wordsInCorpus.get(searchTerm) + 1);
      } else {
        wordsInCorpus.set(searchTerm, 1);
      }
      span.id = inscription.name + "-transcription-" + i;
      span.setAttribute("onmouseover", "highlightWords(event, '" + inscription.name + "', '" + i + "')");
      span.setAttribute("onmouseout", "clearHighlight(event, '" + inscription.name + "', '" + i + "')");
      span.setAttribute("onclick", "updateSearchTerms(event, '" + inscription.name + "', '" + i + "')");
    }
    transcript.appendChild(span);
  }
  item.appendChild(transcript);

  transcript = document.createElement("div");
  transcript.className = 'item';
  transcript.setAttribute("inscription", inscription.name);
  for (var i = 0; i < inscription.translatedWords.length; i++) {
    var word = inscription.translatedWords[i];
    var elementName = word == "\n" ? "br" : "span";
    var span = document.createElement(elementName);
    if (elementName == "span") {
      span.textContent = word + " ";
      span.id = inscription.name + "-translation-" + i;
      span.setAttribute("onmouseover", "highlightWords(event, '" + inscription.name + "', '" + i + "')");
      span.setAttribute("onmouseout", "clearHighlight(event, '" + inscription.name + "', '" + i + "')");
      span.setAttribute("onclick", "updateSearchTerms(event, '" + inscription.name + "', '" + i + "')");
    }
    transcript.appendChild(span);
  }
  item.appendChild(transcript);

  var label = document.createElement("div");
  label.className = 'label';
  label.textContent = inscription.name;
  item.appendChild(label);
  inscription.element = item;

  container.appendChild(item);
}

function updateTip(word) {
  console.log(word);
  word = word.replace(/𐝫/g, "");
  if (!wordsInCorpus.has(word)) {
    return;
  }
  var wordCount = wordsInCorpus.get(word) - 1;
  var tipText = "";
  if (lexicon.has(word)) {
    tipText += lexicon.get(word) + "<br>";
  }
  switch(wordCount) {
    case 0:
      tipText += "There is no other instance of this word."
      break;
    case 1:
      tipText += wordCount + " other instance of this word. Click word to view it."
      break;
    default:
      tipText += wordCount + " other instances of this word. Click word to view them."
  }
  document.getElementById("tip").innerHTML = tipText;
}

function highlightWords(evt, name, index) {
  var items = ["transcription", "translation"];
  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    var element = document.getElementById(name + "-" + item + "-" + index);
    updateTip(element.textContent);
    element.style.backgroundColor = "yellow";
  }
}

function clearHighlight(evt, name, index) {
  document.getElementById("tip").textContent = "";
  var items = ["transcription", "translation"];
  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    var element = document.getElementById(name + "-" + item + "-" + index);
    if (highlightedSearchElements.includes(element)) {
      continue;
    }
    element.style.backgroundColor = "";
  }
}

function updateSearchTerms(evt, name, index) {
  var element = document.getElementById(name + "-transcription-" + index);
  var searchTerm = element.textContent.replace(/𐝫/g, "");
  var container = document.getElementById("search-terms");
  var existingElement = document.getElementById(searchTerm);
  if (existingElement) {
    return;
  }
  var item = document.createElement("div");
  item.className = 'search-term';
  item.textContent = searchTerm;
  item.id = searchTerm;
  item.setAttribute("term", searchTerm);
  item.setAttribute("onclick", "removeFilter(event)");
  container.appendChild(item);
  applySearchTerms();
}

function applySearchTerms() {
  var searchTerms = document.getElementById("search-terms");
  clearHighlights();
  for (var i = 0; i < inscriptions.length; i++) {
    var inscription = inscriptions[i];
    var shouldDisplay = true;
    for (var j = 0; j < searchTerms.children.length; j++) {
      var element = searchTerms.children[j];
      var searchTerm = element.textContent;
    var searchTerm = element.textContent.replace(/𐝫/g, "");
      if (!inscription.words.includes(searchTerm) &&
          !inscription.words.map(x => x.replace(/𐝫/g, "")).includes(searchTerm)) {
        shouldDisplay = false;
        break;
      }
    }
    if (!shouldDisplay) {
      inscription.element.style.display = "none";
      continue;
    }
    inscription.element.style.display = "flex";
    for (index in searchTerms.children) {
      var term = searchTerms.children[index].textContent;
      for (var j = 0; j < inscription.element.children.length; j++) {
        var element = inscription.element.children[j];
        highlightMatchesInElement(element, term);
      }
    }
  }
}

function removeFilter(evt) {
  evt.target.parentElement.removeChild(evt.target);
  applySearchTerms();
}

function searchForWord(evt, name, index) {
  var element = document.getElementById(name + "-transcription-" + index);
  var searchTerm = element.textContent.replace(/𐝫/g, "");
  var searchBox = document.getElementById("search");
  searchBox.value = searchTerm;
  searchBox.dispatchEvent(new InputEvent("input"));
}

function loadExplorer() {
  for (var i = 0; i < inscriptions.length; i++) {
    loadInscription(inscriptions[i]);
  }
}

