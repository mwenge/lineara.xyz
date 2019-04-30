/*
# Copyright (c) 2018 Robert Hogan (robhogan at gmail.com) All rights reserved.
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
var animationDuration = 5;
document.onkeydown = checkKey;
function checkKey(e) {
    e = e || window.event;
    if (e.keyCode == '38') {
        // up arrow
        animationDuration++;
    } else if (e.keyCode == '40') {
        // down arrow
        animationDuration--;
        animationDuration = Math.max(2, animationDuration);
    }
    console.log(animationDuration);
}

function loadInscription(inscription) {
  var item = document.createElement("div");
  item.className = 'item-container';
  item.id = inscription.name;

  var inscriptionImage = document.createElement("div");
  inscriptionImage.className = 'item';
  var img = document.createElement("img");
  img.src = inscription.image;
  inscriptionImage.appendChild(img);
  item.appendChild(inscriptionImage);

  inscriptionImage = document.createElement("div");
  inscriptionImage.className = 'item';
  var img = document.createElement("img");
  img.src = inscription.tracingImage;
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

  container.appendChild(item);
}

function loadExplorer() {
  for (var i = 0; i < inscriptions.length; i++) {
    loadInscription(inscriptions[i]);
  }
}

