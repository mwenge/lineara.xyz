
function sendKey(event, keyValue) {
  var e = new KeyboardEvent("keydown", {
        bubbles : true,
        key : keyValue,
  });
  document.dispatchEvent(e);
}

function toggleColor(element) {
  var color = element.style.backgroundColor;
  element.style.backgroundColor = color == "purple" ? "black" : "purple";
}

var cycleColor = (function () {
  var frequency = .3;
  var i = 0;
  return function () {
    i++;
    red   = Math.round(Math.sin(frequency*i + 0) * 55 + 200);
    green = Math.round(Math.sin(frequency*i + 2) * 55 + 200);
    blue  = Math.round(Math.sin(frequency*i + 4) * 55 + 200);
    return "rgba(" + red + ", " + green + ", " + blue + ", 0.5)";
  }
})();

function stripErased(word) {
  return word.replace(/\u{1076b}/gu, "");
}

