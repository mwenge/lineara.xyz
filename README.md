# LinearA Explorer

The objective of [the LinearA Explorer](https://mwenge.github.io/LinearAExplorer/) is to allow users to explore the complete Linear A corpus in a way that is intuitive and hopefully illuminating. But while it might be of passing interest to the curious visitor it must also be of practical use to interested Linear A scholars. That means that is must offer them something not currently available to them and allow them to investigate and explore the Linear A dataset in ways that were not previously open to them. While still a work in progress, I think the Linear A Explorer is on its way to achieving that. 

![Searhing and filtering](https://github.com/mwenge/LinearA/blob/master/report-images/Search.gif "Linear A Explorer after loading")

## Introduction to Linear A
[The LinearA Explorer](https://mwenge.github.io/LinearAExplorer/) is a visualization tool for exploring and researching the surviving documents of the Linear A language.

Linear A was the primary script used in palace and religious writings by the Minoan civilization in Crete from 1800 to 1450 BC. To this day it remains undeciphered though a lot of progress has been made in understanding the nature and purpose of the Linear A documents themselves.
The Linear A Explorer is intended as a resource for making the published Linear A inscriptions as accessible as possible to those interested in understanding more about them.

## Overview of the technologies used to build the Explorer
The extraction and construction of the images and Linear A corpus were performed using Python, imagemagick scripts and curl. The explorer itself consists simply of HTML, CSS, and Javascript. The explorer is custom-built, so no frameworks have been used in creating the visualization.

The data used for the explorer consists principally of the images of the Linear A documents and the transacriptions published by [Louis Godart and Jean-Pierre Olivier](https://bit.ly/2H6Ohwe) in 1970 and of the [tabulation and interpretation of the inscriptions by George Douros](http://users.teilar.gr/~g1951d/).

## Sourcing and Extracting Data for the Explorer
### Extracting and organizing the image files
The images of the Linear A tablets and their transcriptions are available in the three digitized volumes of [Recueil des Inscriptions en Lineair A](https://cefael.efa.gr/detail.php?nocache=2232oxwta3md&site_id=1&actionID=page&prevpos=0&serie_id=EtCret&volume_number=21&issue_number=1&cefael=8e74ecb5234b3e3c1cdfc09942a7085a&sp=5) uploaded at https://cefael.efa.gr. The first step was to download the entire digitized volume [using curl](https://github.com/mwenge/LinearA/blob/master/000-DownloadGORILA.sh). I then created [a series of imagemagick and python scripts](https://github.com/mwenge/LinearA/blob/master/020-split_gorila_images_with_multicrop.py) that split each digitized page into separate files representing a single file per inscription and transcription. This gave me an image repository with a single cropped image file for each tablet. I then created a csv file that [described the mapping of image files to each inscription](https://github.com/mwenge/LinearA/blob/master/000-GorilaInscriptionsManifest.csv) and then developed a python script that used this to create [an images folder for the app](https://github.com/mwenge/LinearAExplorer/tree/master/images) containing all the images of each tablet and inscription. Note that I'm using two repositories here. One at https://github.com/mwenge/LinearA for performing the data extraction and processing and another https://github.com/mwenge/LinearAExplorer/ for hosting the visualization app itself and the data we've extracted for analysis by the app.

### Extracting and organizing the Linear A Text
The complete Linear A corpus is relatively small, consisting of only a few hundred documents. The total corpus would fill only 5 or 6 pages if all the documents were placed end to end. A Linear A scholar George Douros has [produced a spreadsheet](https://github.com/mwenge/LinearA/blob/master/000-LinearAInscriptions.ods) that tabulates each document and helpfully provides word breaks, ideograms, and numerals broken out for each line of each document. When converted to csv format this spreadsheet allows me to create the core of the app, which is a structured representation of each document in JSON format. I do this by [writing a python script](https://github.com/mwenge/LinearA/blob/master/090-create_inscriptions_db.py) that takes in the csv file and writes a javascript array of JSON objects to [a javascript file called LinearAInscriptions.js.](https://github.com/mwenge/LinearAExplorer/blob/master/LinearAInscriptions.js). Here is a snippet of the file, showing how the document HT1 is represented in as a JSON object:

```javascript 
["HT1",{
    "image": "images/HT1-Inscription.jpg",
    "name": "HT1",
    "parsedInscription": "𐘿𐘽𐘉𐄁\n𐘸𐘁𐄙𐄘𐄍\n𐙀𐘲𐄖\n𐘆𐘆𐘍𐘥𐄔𐄈\n𐙂𐘰𐘯𐄙𐄏\n𐘇𐘴𐘅𐘙𐄙𐄋",
    "tracingImage": "images/HT1-Tracing.jpg",
    "transcription": "𐘿𐘽𐘉𐄁𐘸𐘁𐄙𐄘\n𐄍𐙀𐘲𐄖𐘆𐘆\n𐘍𐘥𐄔𐄈𐙂𐘰𐘯𐄙\n𐄏𐘇𐘴𐘅𐘙𐄙𐄋",
    "translatedWords": [
        "QE-RA2-U",
        "𐄁",
        "\n",
        "KI-RO(owed)",
        "197",
        "\n",
        "𐙀-SU",
        "70",
        "\n",
        "DI-DI-ZA-KE",
        "52",
        "\n",
        "KU𐘰-NU",
        "109",
        "\n",
        "A-RA-NA-RE",
        "105"
    ],
    "transliteratedWords": [
        "QE-RA2-U",
        "𐄁",
        "\n",
        "KI-RO",
        "197",
        "\n",
        "𐙀-SU",
        "70",
        "\n",
        "DI-DI-ZA-KE",
        "52",
        "\n",
        "KU𐘰-NU",
        "109",
        "\n",
        "A-RA-NA-RE",
        "105"
    ],
    "words": [
        "𐘿𐘽𐘉",
        "𐄁",
        "\n",
        "𐘸𐘁",
        "𐄙𐄘𐄍",
        "\n",
        "𐙀𐘲",
        "𐄖",
        "\n",
        "𐘆𐘆𐘍𐘥",
        "𐄔𐄈",
        "\n",
        "𐙂𐘰𐘯",
        "𐄙𐄏",
        "\n",
        "𐘇𐘴𐘅𐘙",
        "𐄙𐄋"
    ]
}],
```
This encapsulates all the information about the inscription that we need to visualize it in the app. The image files, the raw transacription, and arrays representing the parsed words of the inscription both in Linear A, transliterated Linear A syllabograms, and proposed translations where applicable.

### Loading the data into the visualization app
The relatively small dataset we're working with means that we can load the entire dataset into the browser when the user visits [the site](https://mwenge.github.io/LinearAExplorer/). This is done with a simple function that iterates the entire Map of JSON objects and creates a floating div element for each inscription. We let the browser do the work of laying out the elements in the way that best fits the page:

```javascript

function loadExplorer() {
  for (var inscription of inscriptions.values()) {
    loadInscription(inscription);
  }
}

var wordsInCorpus = new Map();
function loadInscription(inscription) {
  var item = document.createElement("div");
  item.className = 'item-container';
  item.id = inscription.name;
  item.setAttribute("onclick", "showCommentaryForInscription('" + inscription.name + "')");

  addImageToItem(item, inscription.image, inscription.name)
  addImageToItem(item, inscription.tracingImage, inscription.name)

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
```
The result is seen here:

![Explorer after loading](https://github.com/mwenge/LinearA/blob/master/report-images/LinearA1.png "Linear A Explorer after loading")

### Hovering over text, searching and filtering
The simplicity of our data model means that implementing searching and filtering is easy. 
```javascript

function applySearchTerms() {
  var searchTerms = document.getElementById("search-terms");
  clearHighlights();
  for (var inscription of inscriptions.values()) {
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
```
This function allows the user to hover over words, click on them, and filter the display to show only inscriptions that contain those words. They can then keep adding words to the filter (and remove them too) to reduce the displayed documents to only the ones that contain the words they're interested in. This animated gif shows the feature in action:

![Searhing and filtering](https://github.com/mwenge/LinearA/blob/master/report-images/Search.gif "Linear A Explorer after loading")

Note that this gif also shows a couple of the other features we planned for the visualization. Hovering over a word highlights that word and its corresponding word in the raw transcription/transliteration/translation boxes as appropriate. It also displays a tooltip in the bottom left of the screen telling the user how many other instances of the word there are in the corpus so that they know if it's worth clicking on it to filter the display by that word.

In addition to hovring and clicking-to-filter, the app has a simple manual search feature allowing the user to filter the documents by a search term of their own choosing. Here it is in action with an animated gif:

![Searhing and filtering](https://github.com/mwenge/LinearA/blob/master/report-images/ManualSearch.gif "Linear A Explorer after loading")

### Zooming in on the inscription and transcription images
Using CSS and javascript we can create a simple but effective 'magnifying glass' for enhancing and exploring the images for each inscription. We use a Javascript closure to create a zoom function that is specific to each image. Using a closure makes for a clean implementation for the thousands of images in the app, the image and zoom elements are instantiated in the closure and tied to the hover event for the element. This means they are available at run-time and we don't need to figure out which image to zoom when the user hovers over an inscription.
 
```javascript

lens.addEventListener("mousemove", makeMoveLens(lens, img, itemZoom));
img.addEventListener("mousemove", makeMoveLens(lens, img, itemZoom));

function makeMoveLens(lens, img, result, cx, cy) {
  return function(e) {
    result.style.display = "flex";
    lens.style.display = "block";
    result.style.width = result.parentElement.offsetWidth + "px";
    result.style.height = (result.parentElement.offsetHeight / 2) + "px";
    result.style.top = "-" + (result.parentElement.offsetHeight / 2) + "px";
    lens.style.width = (result.parentElement.offsetWidth / 2) + "px";
    lens.style.height = (result.parentElement.offsetHeight / 5) + "px";

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
```
Here's the magnifying glass in action. As you can see it's simple but effective, and allows the user to see in relatively fine-grained detail the workmanship (or lack of it!) in each tablet. This is an important feature for users of the app as the transcription of tablets can often be uncertain or controversial. This feature makes it a simple task for the user to closely inspect the transcription of the Linear A documents where previously it would have required collecting many distinct dat sources by hand to perform a comparison:

![Zoooming](https://github.com/mwenge/LinearA/blob/master/report-images/Zoom.gif "Linear A Explorer after loading")

### Grouping similar inscriptions together
A useful feature for providing potential insights to the Linear A inscriptions is by letting the user cluster similar inscriptions next to the one that they're interested in so that they can explore possible relationships between Linear A tablets in terms of their content.

I've built this into the explorer by allowing the user to hover the mouse over the inscription they're interested in and then pressing 's'. The explorer will then calculate the [Levenshtein distance](https://en.wikipedia.org/wiki/Levenshtein_distance) between the selected inscription and every other inscription in the database and sort the display of the inscriptions so that those with the nearest Levenshtein distance to the selected one are nearest to it.  

![Sorting](https://github.com/mwenge/LinearA/blob/master/report-images/Sorting.gif "Linear A Explorer after loading")

This is obviously just the beginning in terms of the comparison features that can be integrated into the app.

### Adding access to commentary on the inscriptions
John Younger, a prominent Linear A scholar, has published the most complete collection of commentaries on the Linear A inscriptions. An obvious, and useful, feature is to make these readily accessible to users of the app. The commentaries are [available on his website](https://www.people.ku.edu/~jyounger/LinearA/HTtexts.html). I saved the html files of both the Hagia Tragida inscriptions and [those for other texts](http://www.people.ku.edu/~jyounger/LinearA/misctexts.html). I then wrote a [python script](https://github.com/mwenge/LinearA/blob/master/900-Extract-Younger-Commentary.py) to parse out the commentaries [into a directory](https://github.com/mwenge/LinearAExplorer/tree/master/commentary) where the app can reference them by name.

With this data extracted I then created a simple feature in the app where if the user clicks on an inscription the app will retrieve the commentary, keyed on inscription name, and display it in a floatig panel.

```javascript

function showCommentaryForInscription(inscription) {
  inscription = inscription.replace(/[a-z]/g, "");
  var commentBox = document.getElementById("comment_box");
  if (commentBox.style.display == "block") {
    commentBox.style.display = "none";
    return;
  }
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
			if (xhttp.status == 404) {
        commentBox.style.display = "none";
			} else {
        commentBox.innerHTML = xhttp.responseText;
        commentBox.style.display = "block";
      }
  };
  xhttp.open("GET", "commentary/" + inscription + ".html", true);
  xhttp.send();
}
```

Here is what the feature looks like in practice:

![Commentary](https://github.com/mwenge/LinearA/blob/master/report-images/Commentary.gif "Linear A Explorer after loading")


