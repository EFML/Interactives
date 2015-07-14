// Javascript für HTML5-Apps (englisch)
// 13.08.2014 - 15.09.2014

// Konstanten:

var language = "en";                                                         // Abkürzung für Sprache
var textPhysics = "Physics";                                                 // Bezeichnung für Physik
var textCollection = "Physics Apps";                                         // Bezeichnung für Programmsammlung
var textModification = "Last modification";                                  // Bezeichnung für letzte Änderung

// Array der Monatsnamen:

var month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// Logo Physik-Apps:

function logo (filename) {
  var body = document.getElementsByTagName("body")[0];                       // Body-Element
  var t = document.createElement("table");                                   // Neue Tabelle
  t.setAttribute("class","Index");                                           // Klasse (Layout-Festlegung durch CSS-Datei)
  t.setAttribute("align","center");                                          // Ausrichtung zentriert
  var tr = document.createElement("tr");                                     // Neue Tabellenzeile
  t.appendChild(tr);                                                         // Tabellenzeile hinzufügen
  var td = document.createElement("td");                                     // Neue Tabellenzelle
  td.setAttribute("class","Index1");                                         // Klasse (Layout-Festlegung durch CSS-Datei)
  var a = document.createElement("a");                                       // Neuer Link
  a.setAttribute("href","http://www.walter-fendt.de/html5/phen/index.html"); // Adresse für Inhaltsverzeichnis
  var i = document.createElement("img");                                     // Neues Bild (Logo Physik)
  i.setAttribute("src","img/javaphys.gif");                                  // Pfadangabe
  i.setAttribute("alt",textPhysics);                                         // Alternativer Text
  i.setAttribute("style","margin-left: 10px; margin-right: 10px;");          // Seitenabstand
  a.appendChild(i);                                                          // Bild zum Link hinzufügen
  td.appendChild(a);                                                         // Link zur Tabellenzelle hinzufügen
  tr.appendChild(td);                                                        // Tabellenzelle zur Tabellenzeile hinzufügen
  tr = document.createElement("tr");                                         // Neue Tabellenzeile
  td = document.createElement("td");                                         // Neue Tabellenzelle
  td.setAttribute("class","Index2");                                         // Klasse (Layout-Festlegung durch CSS-Datei)
  a = document.createElement("a");                                           // Neuer Link
  a.setAttribute("href","http://www.walter-fendt.de/html5/phen/index.html"); // Adresse für Inhaltsverzeichnis
  a.innerHTML = textCollection;                                              // Bezeichnung für Programmsammlung
  td.appendChild(a);                                                         // Link zur Tabellenzelle hinzufügen
  tr.appendChild(td);                                                        // Tabellenzelle zur Tabellenzeile hinzufügen
  t.appendChild(tr);                                                         // Tabellenzeile hinzufügen
  body.appendChild(t);                                                       // Tabelle hinzufügen
  }
  
// Datum nach dem Muster "January 1, 2000"
// d ... Tag (1 bis 31)
// m ... Monat (1 bis 12)
// y ... Jahr
  
function date (d, m, y) {
  return month[m-1]+" "+d+", "+y;
  }
  
// Daten am Ende der Seite (URL, Copyright, letzte Änderung)

function data (filename, d1, m1, y1, d2, m2, y2) {
  var body = document.getElementsByTagName("body")[0];               // Body-Element
  var p = document.createElement("p");                               // Neuer Absatz
  p.setAttribute("class","Ende");                                    // Klasse (Layout-Festlegung durch CSS-Datei)
  var s = "URL: http://www.walter-fendt.de/html5/ph"+language+"/";   // Anfang der URL
  s += filename+"_"+language+".htm<br>";                             // URL vervollständigen, Zeilenumbruch
  s += "\u00a9  Walter Fendt, "+date(d1,m1,y1)+"<br>";               // Copyright-Vermerk mit Datum, Zeilenumbruch
  s += textModification+": "+date(d2,m2,y2);                         // Datum der letzten Änderung
  p.innerHTML = s;                                                   // Inhalt des Absatzes
  body.appendChild(p);                                               // Absatz hinzufügen
  }
  
// Leere Zeile 
  
function emptyLine () {
  var e = document.createElement("div");                             // Neues Div-Element
  e.setAttribute("class","Abstand");                                 // Klasse (Layout-Festlegung durch CSS-Datei)
  e.innerHTML = "\u0020";                                            // Leerzeichen
  return e;                                                          // Rückgabewert
  }
  
// Seitenende insgesamt
// filename ..... Dateiname (ohne Erweiterungen)
// d1, m1, y1 ... Datum der Erstveröffentlichung
// d2, m2, y2 ... Datum der letzten Änderung

function endPage (filename, d1, m1, y1, d2, m2, y2) {
  var body = document.getElementsByTagName("body")[0];               // Body-Element
  body.appendChild(emptyLine());                                     // Leere Zeile hinzufügen
  var hr = document.createElement("hr");                             // Trennstrich
  hr.setAttribute("class","Trennlinie");                             // Klasse (Layout-Festlegung durch CSS-Datei)
  body.appendChild(hr);                                              // Trennstrich hinzufügen
  body.appendChild(emptyLine());                                     // Leere Zeile hinzufügen
  logo(filename);                                                    // Logo
  data(filename,d1,m1,y1,d2,m2,y2);                                  // Daten am Ende (URL, Copyright, letzte Änderung)
  }
  
  
  
