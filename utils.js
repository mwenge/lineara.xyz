function sendKey(keyValue) {
  return function (event) {
    var e = new KeyboardEvent("keydown", {
          bubbles : true,
          key : keyValue,
    });
    document.dispatchEvent(e);
  }
}

function toggleColor(element) {
  var color = element.style.backgroundColor;
  element.style.backgroundColor = color == "purple" ? "black" : "purple";
}

var cycleColorInt = (function () {
  var frequency = .6;
  var i = 0;
  return function () {
    i++;
    var red   = Math.round(Math.sin(frequency*i + 0) * 55 + 200);
    var green = Math.round(Math.sin(frequency*i + 2) * 55 + 200);
    var blue  = Math.round(Math.sin(frequency*i + 4) * 55 + 200);
    return [red, green, blue];
  }
})();

var cycleColor = (function () {
  var frequency = .6;
  var i = 0;
  return function () {
    i++;
    var red   = Math.round(Math.sin(frequency*i + 0) * 55 + 200);
    var green = Math.round(Math.sin(frequency*i + 2) * 55 + 200);
    var blue  = Math.round(Math.sin(frequency*i + 4) * 55 + 200);
    return "rgba(" + red + ", " + green + ", " + blue + ", 0.5)";
  }
})();

function stripErased(word) {
  return word.replace(/\u{1076b}/gu, "");
}

function lettersWithImages(parsedInscription) {
  var splitter = new GraphemeSplitter();
  var letters = stripErased(parsedInscription);
  letters = letters.replace(/\n/gu, "");
  letters = letters.replace(/𐄁/gu, "");
  return splitter.splitGraphemes(letters);
}


