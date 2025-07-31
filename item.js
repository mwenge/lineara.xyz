/*
 * Enable highlighting of words when hovered.
 */
document.querySelectorAll('support,site,findspot,scribe,context').forEach( x =>  {
  const searchURL = `/?search=["${x.innerText.replace('\n', ' ')}"]`
  x.addEventListener("click", event => { window.open(searchURL); event.stopPropagation(); });
});

const unicodeContainer = document.querySelector('transcribed-reading-unicode');
document.querySelectorAll('word').forEach( x =>  {
  x.addEventListener("mouseenter", highlightWords());
  x.addEventListener("mouseleave", clearHighlight());
  const word = unicodeContainer.querySelector(`word[number='${x.getAttribute("number")}']`);
  const searchURL = `/?search=["\\"${word.innerText}\\""]`
  x.addEventListener("click", event => { window.open(searchURL); event.stopPropagation(); });
});

function highlightWords(e) {
  const color = "rgba(255, 255, 0, 0.5)";
  return function(e) {
    const number = e.target.getAttribute("number");
    const words = document.querySelectorAll(`word[number='${number}']`);
    words.forEach( x => {
      x.style.backgroundColor = color;
    });
  }
}

function clearHighlight(e) {
  return function(e) {
    const color = "rgba(255, 255, 0, 0.5)";
    const number = e.target.getAttribute("number");
    const words = document.querySelectorAll(`word[number='${number}']`);
    words.forEach( x => {
      x.style.backgroundColor = "";
    });
  }
}

/*
document.querySelectorAll('img').forEach( img =>  {
  const imagePath = new URL(img.src).pathname;
  addWordsToImage(imagePath
});

function addWordsToImage(imagePath, name, imageType, img, imageWrapper, itemZoom, item) {
  return function(e) {
    if (!coordinates.has(imagePath)) {
      return;
    }
    var imageCoords = coordinates.get(imagePath);
    var currentWord = 0;
    var prevWord = -1;
    var wordContainer = null;
    for (var i = 0; i < imageCoords.length; i++) {
      var area = imageCoords[i].coords;
      currentWord = wordIndexForLetterIndex(name, i, currentWord);

      if (currentWord != prevWord) {
        wordContainer = document.createElement("div");
        var wordID = "image-" + imageType + "-" + name + "-word-highlight-" + currentWord;
        wordContainer.className = "word-highlight";
        wordContainer.style.top = ((area.y / img.naturalHeight) * 100) + '%';
        wordContainer.style.left = ((area.x / img.naturalWidth) * 100) + '%';
        wordContainer.id = wordID;
        wordContainer.addEventListener("mouseout", clearHighlight(name, currentWord));
        imageWrapper.appendChild(wordContainer);
      }
      prevWord = currentWord;

      var highlight = document.createElement("div");
      highlight.className = "letter-highlight";
      highlight.id = "image-" + imageType + "-" + name + "-letter-highlight-" + i;
      highlight.style.width = ((area.width / img.naturalWidth) * 100) + '%';
      highlight.style.height = ((area.height / img.naturalHeight) * 100) + '%';
      highlight.style.top = ((area.y / img.naturalHeight) * 100) + '%';
      highlight.style.left = ((area.x / img.naturalWidth) * 100) + '%';
      highlight.addEventListener("mouseenter", highlightWords(name, currentWord));
      highlight.addEventListener("click", updateSearchTerms("\"" + inscriptions.get(name).words[currentWord] + "\""));
      highlight.addEventListener("mouseout", clearHighlight(name, currentWord));
      wordContainer.appendChild(highlight);
    }

    // Highlight any search terms in the image
    var searchTerms = document.getElementById("search-terms");
    if (searchTerms) {
      for (var i = 0; i < searchTerms.children.length; i++) {
        var searchElement = searchTerms.children[i];
        if (!searchElement) {
          continue;
        }
        var term = searchElement.textContent;
        for (var j = 0; j < item.children.length; j++) {
          var element = item.children[j];
          var highlightColor = searchElement.getAttribute("highlightColor");
          highlightMatchesInElement(element, term, highlightColor);
        }
      }
    }

    if (consoleButtons.get('activeWordTags')) {
      var inscription = inscriptions.get(name);
      for (var tag of consoleButtons.get('activeWordTags').currentActiveTags()) {
        var highlightColor = tagColors[tag];
        for (var index in inscription.wordTags) {
          if (!inscription.wordTags[index].includes(tag)) {
            continue;
          }

          var highlightedElements = setHighlightLettersInTranscription(name, index, highlightColor);
          highlightedSearchElements = highlightedSearchElements.concat(highlightedElements);
        }
      }
    }
  };
}
*/
