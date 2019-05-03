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

function updateSearch(event) {
  var searchTerm = event.target.value;
  var allContainers = document.getElementsByClassName('item-container');
  for (var i = 0; i < allContainers.length; i++) {
    var container = allContainers[i];
    for (var j = 0; j < container.children.length; j++) {
      var element = container.children[j];
      if (searchTerm == "" || element.textContent.includes(searchTerm)) {
        element.parentElement.style.display = "flex";
        break;
      } else {
        element.parentElement.style.display = "none";
      }
    }
  } 
}

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
  for (var i = 0; i < inscription.words.length; i++) {
    var word = inscription.words[i];
    var elementName = word == "\n" ? "br" : "span";
    var span = document.createElement(elementName);
    if (elementName == "span") {
      span.textContent = word;
    }
    transcript.appendChild(span);
  }
  item.appendChild(transcript);

  transcript = document.createElement("div");
  transcript.className = 'item';
  for (var i = 0; i < inscription.translatedWords.length; i++) {
    var word = inscription.translatedWords[i];
    var elementName = word == "\n" ? "br" : "span";
    var span = document.createElement(elementName);
    if (elementName == "span") {
      span.textContent = word + " ";
    }
    transcript.appendChild(span);
  }
  item.appendChild(transcript);

  var label = document.createElement("div");
  label.className = 'label';
  label.textContent = inscription.name;
  item.appendChild(label);

  container.appendChild(item);
}

function loadExplorer() {
  for (var i = 0; i < inscriptions.length; i++) {
    loadInscription(inscriptions[i]);
  }
}

