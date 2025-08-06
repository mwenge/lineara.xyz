/*
 * Enable highlighting of words when hovered.
 */
const unicodeContainer = document.querySelector('parsed-reading-unicode');
document.querySelectorAll('support,site,findspot,scribe,context').forEach( x =>  {
  const searchURL = `/?search=["${x.innerText.replace('\n', ' ')}"]`
  x.addEventListener("click", event => { window.open(searchURL); event.stopPropagation(); });
});

enableHighlighting();
addHighlightElements();

function enableHighlighting() {
  document.querySelectorAll('word').forEach( x =>  {
    x.addEventListener("mouseenter", highlightWords());
    x.addEventListener("mouseleave", clearHighlight());
    const word = unicodeContainer.querySelector(`word[number='${x.getAttribute("number")}']`);
    const searchURL = `/?search=["\\"${word.innerText.replace('\n','')}\\""]`
    x.addEventListener("click", event => { window.open(searchURL); event.stopPropagation(); });
  });
}

function highlightWords(e) {
  const color = "rgba(255, 255, 0, 0.5)";
  return function(e) {
    const number = e.target.getAttribute("number");
    const words = document.querySelectorAll(`word[number='${number}'],.letter-highlight[number='${number}']`);
    words.forEach( x => {
      x.style.backgroundColor = color;
    });
  }
}

function clearHighlight(e) {
  return function(e) {
    const color = "rgba(255, 255, 0, 0.5)";
    const number = e.target.getAttribute("number");
    const words = document.querySelectorAll(`word[number='${number}'],.letter-highlight[number='${number}']`);
    words.forEach( x => {
      x.style.backgroundColor = "";
    });
  }
}

function removeHighlightElements() {
  document.querySelectorAll('.letter-highlight').forEach( x =>  {
    x.remove();
  });
}

function addHighlightElements() {
  document.querySelectorAll('img').forEach( img =>  {
    const imagePath = new URL(img.src).pathname;
    const imageLookup = imagePath.substring(imagePath.lastIndexOf('/')+1).split('.')[0];
    const container = img.parentElement.parentElement;
    const test_img = new Image();
    test_img.src = imagePath;
    test_img.onload = () => {
      addWordsToImage(imageLookup, img, container, test_img.naturalWidth, test_img.naturalHeight);
    };
  });
}

function addWordsToImage(imageLookup, img, container, naturalWidth, naturalHeight) {
    // coordinates in image_map.js
    var imageCoords = coordinates[imageLookup];
    if (!imageCoords) {
      return;
    }

    imageCoords.forEach( c => {
      const area = c.coords;
      const word = c.word;

      var highlight = document.createElement("div");
      highlight.className = "letter-highlight";
      highlight.setAttribute("number",word);
      highlight.style.width = ((area.width / naturalWidth) * 100) + '%';
      highlight.style.height = ((area.height / naturalHeight) * 100) + '%';
      highlight.style.top = ((area.y / naturalHeight) * 100) + '%';
      highlight.style.left = ((area.x / naturalWidth) * 100) + '%';
      highlight.addEventListener("mouseenter", highlightWords());
      highlight.addEventListener("mouseout", clearHighlight());

      const w = unicodeContainer.querySelector(`word[number='${word}']`);
      const searchURL = `/?search=["\\"${w.innerText}\\""]`
      highlight.addEventListener("click", event => { window.open(searchURL); event.stopPropagation(); });

      container.appendChild(highlight);
    });
}

