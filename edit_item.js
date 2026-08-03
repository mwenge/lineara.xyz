/*
 * The author disclaims copyright to this source code. In place of a legal notice, here is a blessing:
 *
 *     May you do good and not evil.
 *     May you find forgiveness for yourself and forgive others.
 *     May you share freely, never taking more than you give.
 *
 */
document.querySelectorAll('commentaries > .edit').forEach( x =>  {
  x.addEventListener("click", event => { 
    var c = document.querySelector('commentaries');
    var commentary = document.createElement("commentary");
    commentary.setAttribute("author", new Date().toLocaleDateString());
    var entry = document.createElement("commentary-entry");
    commentary.appendChild(entry);
    entry.setAttribute("contenteditable", "true");
    x.after(commentary);
    entry.focus();
  });
});

/*
 * Enable showing the reading editor.
 */

document.querySelectorAll('readings > .edit').forEach( x =>  {
  x.addEventListener("click", event => { 
    var r = document.querySelector('reading-spec');
    r.style.display = (r.style.display == "none") ? "block" : "none";
    var r = document.querySelector('.save');
    r.style.display = (r.style.display == "none") ? "block" : "none";
  });
});

const readingSpecBox = document.querySelector("reading-spec");
const transcribedReadingAsciiElement = document.querySelector("transcribed-reading-ascii > reading-text");
const transcribedReadingUnicodeElement = document.querySelector("transcribed-reading-unicode > reading-text");
const parsedReadingAsciiElement = document.querySelector("parsed-reading-ascii > reading-text");
const parsedReadingUnicodeElement = document.querySelector("parsed-reading-unicode > reading-text");

/*
 Update the readings with the current state of the reading editor.
 */
readingSpecBox.oninput = (event) => { 
  var spec = readingSpecBox.innerText.split('\n').filter(x => x.trim() != "");

  var text = createTranscribedAsciiFromSpec(spec);
  transcribedReadingAsciiElement.innerHTML = text;
  var text = createTranscribedAsciiFromSpec(spec_to_unicode(spec));
  transcribedReadingUnicodeElement.innerHTML = text;

  var text = createParsedAsciiFromSpec(spec);
  parsedReadingAsciiElement.innerHTML = text;
  var text = createParsedAsciiFromSpec(spec_to_unicode(spec));
  parsedReadingUnicodeElement.innerHTML = text;

  enableHighlighting();
}

/*
 * Downloading the updated page.
 */
addDownloadElement();

function removeDownloadElement() {
  document.querySelectorAll('.save').forEach( x =>  {
    x.remove();
  });
}

function addDownloadElement() {
  const wrapper = document.querySelector("itemwrapper");
  var saveButton = document.createElement("div");
  saveButton.className = "save";
  saveButton.innerText = "Download"
  saveButton.style.display = "none"
  saveButton.addEventListener("click", download);
  wrapper.appendChild(saveButton);
}

function removeLinks() {
  document.querySelectorAll('.link').forEach( x =>  {
    x.remove();
  });
}

function getFileName() {
  let path = window.location.pathname;
  let fileName = path.substring(path.lastIndexOf('/') + 1);
  return fileName
}

function download() {
  readingSpecBox.style.display = "none";
  removeLinks();
  removeDownloadElement();
  removeHighlightElements(); // So that they don't clutter up the saved doc.
  let htmlText = "<!DOCTYPE html>\n" +  document.documentElement.outerHTML;
  let blob = new Blob([htmlText], {type: "text/plain;charset=utf-8"});
  saveAs(blob, getFileName());
  addHighlightElements(); // Add the highlights back again.
  addDownloadElement();
  addLinks(); // Add the links back.
}

/*
 * Convert ascii rendering to unicode.
 */
function spec_to_unicode(spec) {
  return spec.map((s) => {
    if (s[0] == "#") return s;
    [r,l,w,syl,status] = s.split(' ');
    return [r,l,w,ascii_to_ideogram.get(syl),status].join(' ');
  });
}

function isNumeric(num){
  return !isNaN(num)
}

function isASCII(str) {
  return /^[\x00-\x7F]*$/.test(str);
}

function createTranscribedAsciiFromSpec(spec) {
  output = "\n       <line><word number=\"0\">";
  pr = null;
  pw = null;
  spec.filter((x) => x[0] != '#').forEach( s => {
    [r,l,w,syl,status] = s.split(' ');
    if (!pr) {
        pr = r;
        pw = w;
    }
    if (w != pw) output += "</word>";
    if (r != pr) {
        pr = r;
        output += "</line>\n       <line>";
        if (w == pw) output += `<word number="${w}">`;
    }
    if (w != pw) {
        pw = w;
        output += `<word number="${w}">`;
    }
    if (isNumeric(syl) && isASCII(syl)) {
        output += `<number>${syl}</number>`;
    } else {
        output += `<ideogram>${syl}</ideogram>`;
    }
  });
  output += "</word></line>";
  return output;
}

function createParsedAsciiFromSpec(spec) {
  output = "\n       <line><word number=\"0\">";
  pl = null;
  pw = null;
  spec.filter((x) => x[0] != '#').forEach( s => {
    [r,l,w,syl,status] = s.split(' ');
    if (!pr) {
        pl = l;
        pw = w;
    }
    if (w != pw) output += "</word>";
    if (l != pl) {
        pl = l;
        output += "</line>\n       <line>";
    }
    if (w != pw) {
        pw = w;
        output += `<word number="${w}">`;
    }
    if (isNumeric(syl) && isASCII(syl)) {
        output += `<number>${syl}</number>`;
    } else {
        output += `<ideogram>${syl}</ideogram>`;
    }
  });
  output += "</word></line>";
  return output;
}

