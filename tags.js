var tagValues = [
  ["APZa1", "religious contributions"],
  ["APZa2", "libation formula"],
  ["ARZf1", "libation formula"],
  ["ARZf2", "libation formula"],
  ["CR(?)Zf1", "religious objects"],
  ["HT102", "wrong total"],
  ["HT117", "longest text"],
  ["HT118", "wrong total"],
  ["HT119", "wrong total"],
  ["HT11a", "wrong total"],
  ["HT13", "wrong total"],
  ["HT93a", "longest text"],
  ["HT93b", "longest text"],
  ["HT9a", "wrong total"],
  ["IOZa11", "written right to left"],
  ["IOZa2", "libation formula"],
  ["IOZa3", "libation formula"],
  ["IOZa4", "libation formula"],
  ["IOZa5", "religious objects"],
  ["IOZa6", "libation formula"],
  ["IOZa7", "libation formula"],
  ["IOZa8", "libation formula"],
  ["IOZa9", "libation formula"],
  ["IOZa9", "written right to left"],
  ["IOZb10", "libation formula"],
  ["KAZf1", "religious objects"],
  ["KNZa10", "libation formula"],
  ["KNZa17", "religious objects"],
  ["KNZa18", "religious objects"],
  ["KNZa19", "religious objects"],
  ["KNZa19", "written right to left"],
  ["KNZc6", "religious objects"],
  ["KNZc7", "libation formula"],
  ["KNZe44", "libation formula"],
  ["KNZf13", "religious objects"],
  ["KNZf31", "religious objects"],
  ["KO(?)Zf2", "religious objects"],
  ["KOZa1", "libation formula"],
  ["KYZc2", "libation formula"],
  ["MAZb8", "libation formula"],
  ["PKZa11", "libation formula"],
  ["PKZa12", "libation formula"],
  ["PKZa14", "religious objects"],
  ["PKZa15", "libation formula"],
  ["PKZa16", "religious objects"],
  ["PKZa17", "libation formula"],
  ["PKZa18", "libation formula"],
  ["PKZa4", "libation formula"],
  ["PKZa8", "libation formula"],
  ["PKZa9", "religious objects"],
  ["PKZc13", "religious objects"],
  ["PLZf1", "libation formula"],
  ["PLZf1", "written right to left"],
  ["PRZa1", "libation formula"],
  ["PSZa2", "libation formula"],
  ["SYZa1", "libation formula"],
  ["SYZa2", "religious contributions"],
  ["SYZa3", "libation formula"],
  ["TLZa1", "libation formula"],
  ["VRYZa1", "libation formula"],
  ["VRYZa1", "written right to left"],
  ["ZA15b", "wrong total"],
  ["ZAZb3", "libation formula"],
  ["ZAZb3", "religious contributions"],
  ["ARKH3a", "uses grain-cyperus, oil, olive, figs, wine word order"],
  ["ARKH3b", "uses grain-cyperus, oil, olive, figs, wine word order"],
  ["HT100", "violation of grain-cyperus, oil, olive, figs, wine word order"],
  ["HT101", "uses grain-cyperus, oil, olive, figs, wine word order"],
  ["HT114a", "uses grain-cyperus, oil, olive, figs, wine word order"],
  ["HT116a", "uses grain-cyperus, oil, olive, figs, wine word order"],
  ["HT116b", "uses grain-cyperus, oil, olive, figs, wine word order"],
  ["HT12", "uses grain-cyperus, oil, olive, figs, wine word order"],
  ["HT121", "uses grain-cyperus, oil, olive, figs, wine word order"],
  ["HT125a", "uses grain-cyperus, oil, olive, figs, wine word order"],
  ["HT125b", "uses grain-cyperus, oil, olive, figs, wine word order"],
  ["HT129", "uses grain-cyperus, oil, olive, figs, wine word order"],
  ["HT131a", "uses grain-cyperus, oil, olive, figs, wine word order"],
  ["HT131b", "uses grain-cyperus, oil, olive, figs, wine word order"],
  ["HT137", "uses grain-cyperus, oil, olive, figs, wine word order"],
  ["HT139", "uses grain-cyperus, oil, olive, figs, wine word order"],
  ["HT14", "uses grain-cyperus, oil, olive, figs, wine word order"],
  ["HT18", "uses grain-cyperus, oil, olive, figs, wine word order"],
  ["HT21", "uses grain-cyperus, oil, olive, figs, wine word order"],
  ["HT23a", "uses grain-cyperus, oil, olive, figs, wine word order"],
  ["HT23b", "uses grain-cyperus, oil, olive, figs, wine word order"],
  ["HT27a", "uses grain-cyperus, oil, olive, figs, wine word order"],
  ["HT27b", "violation of grain-cyperus, oil, olive, figs, wine word order"],
  ["HT28a", "uses grain-cyperus, oil, olive, figs, wine word order"],
  ["HT28b", "uses grain-cyperus, oil, olive, figs, wine word order"],
  ["HT30", "uses grain-cyperus, oil, olive, figs, wine word order"],
  ["HT30", "violation of grain-cyperus, oil, olive, figs, wine word order"],
  ["HT33", "uses grain-cyperus, oil, olive, figs, wine word order"],
  ["HT34", "uses grain-cyperus, oil, olive, figs, wine word order"],
  ["HT35", "violation of grain-cyperus, oil, olive, figs, wine word order"],
  ["HT44a", "uses grain-cyperus, oil, olive, figs, wine word order"],
  ["HT50a", "uses grain-cyperus, oil, olive, figs, wine word order"],
  ["HT58", "uses grain-cyperus, oil, olive, figs, wine word order"],
  ["HT90", "violation of grain-cyperus, oil, olive, figs, wine word order"],
  ["HT91", "uses grain-cyperus, oil, olive, figs, wine word order"],
  ["HT96b", "uses grain-cyperus, oil, olive, figs, wine word order"],
  ["HT99a", "violation of grain-cyperus, oil, olive, figs, wine word order"],
  ["KH5", "uses grain-cyperus, oil, olive, figs, wine word order"],
  ["KH8", "violation of grain-cyperus, oil, olive, figs, wine word order"],
  ["KH9", "violation of grain-cyperus, oil, olive, figs, wine word order"],
  ["KH9", "uses grain-cyperus, oil, olive, figs, wine word order"],
  ["KH11", "uses grain-cyperus, oil, olive, figs, wine word order"],
  ["KH21", "uses grain-cyperus, oil, olive, figs, wine word order"],
  ["KH55", "uses grain-cyperus, oil, olive, figs, wine word order"],
  ["KH61", "violation of grain-cyperus, oil, olive, figs, wine word order"],
  ["KNZb35", "uses grain-cyperus, oil, olive, figs, wine word order"],
  ["TY3a", "uses grain-cyperus, oil, olive, figs, wine word order"],
  ["ZA18a", "uses grain-cyperus, oil, olive, figs, wine word order"],
  ["ZA6a", "violation of grain-cyperus, oil, olive, figs, wine word order"],
  ["ZA6b", "uses grain-cyperus, oil, olive, figs, wine word order"],
  ["ZA11a", "uses grain-cyperus, oil, olive, figs, wine word order"],
];

var tags = new Map();
for (var tag of tagValues) {
  if (tags.has(tag[0])) {
    tags.get(tag[0]).push(tag[1]);
    continue;
  }
  tags.set(tag[0], [tag[1]]);
}

var periodNames = new Map([
["EM", "Pre-palace period 3500-1900 BCE"],
["EMI", "Early Minoan I  3500-2900 BCE"],
["EMII", "Early Minoan IIA, IIB  2900-2300 BCE"],
["EMIIIi", "Early Minoan III, Middle Minoan IA  2300-1900 BCE"],
["MHIII", "Middle Helladic 2000-1550 BCE"],
["MM", "Old Palace period 1900-1650 BCE"],
["MMI", "Middle Minoan I  1900-1800 BCE"],
["MMIA", "Middle Minoan IA  1900-1850 BCE"],
["MMIB", "Middle Minoan IB  1900-1800 BCE"],
["MMII", "Middle Minoan II  1800-1650 BCE"],
["MMIIA", "Middle Minoan IIA  1800-1750 BCE"],
["MMIIB", "Middle Minoan IIB, IIIA 1750-1650 BCE"],
["MMIII", "Middle Minoan III 1750-1600 BCE"],
["MMIIIA", "Middle Minoan IIB, IIIA 1750-1650 BCE"],
["NP",  "New Palace period 1650-1450 BCE"],
["MMIIIB", "(first) Middle Minoan IIIB  1650-1600 BCE"],
["LMI", "Late Minoan I 1600-1450 BCE"],
["LMIA", "Late Minoan IA 1600-1500 BCE"],
["LMIB", "Late Minoan IB  1500-1450 BCE"],
["CM",  "Creto-Mycenaean period  1450-1100 BCE"],
["LHI",  "1550-1450 BCE"],
["LBI",  "1550-1400 BCE"],
["LMII", "Third Palace period, Late Minoan II, IIIA1  1450-1350 BCE"],
["LMIII",  "Post Palace period. Late Minoan IIIA2, IIIB, IIIC 1400-1100 BCE"],
["LMIIIA",  "Post Palace period. Late Minoan IIIB 1350-1100 BCE"],
["SM",  "Sub-Minoan period 1100-1000 BCE"],
["Geometric",  "1000BCE"],
]);

var contexts = new Map();
for (var inscription of inscriptions.values()) {
  var key = inscription.name;
  var context = inscription.context;
  if (contexts.has(key)) {
    contexts.get(key).push(periodNames.get(context));
    continue;
  }
  if (!context) {
    continue;
  }
  if (!periodNames.has(context)) {
    console.log("Missing context: " + context);
  }
  contexts.set(key, [periodNames.get(context)]);
}

var grasses = ["𐙉", "𐛟","𐛬","𐛭","𐛮","𐛯","𐛱","𐛲","𐜠𐛱","𐙗","𐜙","𐜙","𐜚","𐜚","𐜛"];
var oilProducts = ["𐙖", "𐙜", "𐙘", "𐜉","𐜉","𐜊","𐜋","𐜋","𐜌","𐜍","𐜍","𐜎","𐜎","𐜏","𐜏",
                      "𐜐","𐜐","𐜑","𐜒","𐜓","𐜓","𐜔","𐜕","𐜖","𐜗","𐜗","𐜘"];
var MIProducts = ["𐘻","𐛚","𐛜","𐛜","𐛛","𐛙","𐛝"];
var vineProducts = ["𐙍","𐛾","𐙍","𐛽","𐙍","𐘞𐙍","𐛼","𐜀","𐜂", "𐛻","𐛿","𐜁","𐘋𐙍","𐙍𐘻"];
var QAProducts = ["𐚻","𐚹", "𐚻","𐚼","𐚹","𐚺","𐚻","𐚹","𐚻"];
var olive = ["𐙋"];
var figs = ["𐘝"];
var bronze = ["𐙈"];

var magazineRooms = new Map();
magazineRooms.set("57", {"x":61, "y":354, "width":58, "height":91});
magazineRooms.set("7a", {"x":372, "y":359, "width":41, "height":117});
magazineRooms.set("7", {"x":36, "y":486, "width":105, "height":23});
magazineRooms.set("17", {"x":477, "y":378, "width":106, "height":104});
magazineRooms.set("61", {"x":701, "y":445, "width":78, "height":87});
magazineRooms.set("8", {"x":711, "y":374, "width":72, "height":53});
magazineRooms.set("5", {"x":848, "y":314, "width":97, "height":137});
magazineRooms.set("findspot", {"x":699, "y":315, "width":33, "height":16});
magazineRooms.set("59", {"x":657, "y":193, "width":130, "height":117});
magazineRooms.set("58", {"x":415, "y":132, "width":140, "height":148});

var magazineRoomForProduct = new Map();
grasses.forEach(x => magazineRoomForProduct.set(x, "58"));
oilProducts.forEach(x => magazineRoomForProduct.set(x, "8"));
MIProducts.forEach(x => magazineRoomForProduct.set(x, "5"));
vineProducts.forEach(x => magazineRoomForProduct.set(x, "61"));
QAProducts.forEach(x => magazineRoomForProduct.set(x, "17"));
olive.forEach(x => magazineRoomForProduct.set(x, "58"));
figs.forEach(x => magazineRoomForProduct.set(x, "58"));
bronze.forEach(x => magazineRoomForProduct.set(x, "7a"));

var porticoRooms = new Map();
porticoRooms.set("findspot", {"x":280, "y":122, "width":75, "height":50});

var mainPlanRooms = new Map();
mainPlanRooms.set("9", {"x":613, "y":2322, "width":87, "height":93});

var casaDelLebeteRooms = new Map();
casaDelLebeteRooms.set("9", {"x":145, "y":126, "width":27, "height":32});
casaDelLebeteRooms.set("7", {"x":170, "y":75, "width":17, "height":41});

var maliaRooms = new Map();
maliaRooms.set("8",{"x":625, "y":1216, "width":114, "height":102});
maliaRooms.set("NW",{"x":1193, "y":773, "width":134, "height":106});
maliaRooms.set("E", {"x":1933, "y":1014, "width":114, "height":75});

