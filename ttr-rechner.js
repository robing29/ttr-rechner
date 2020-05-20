//document.getElementById abkürzen
//TTR-Alt definieren
let idttralt = document.getElementById("id-ttr-alt");
let idttraltfehler = document.getElementById("ttrFehler");

//Gegnerliste
var idgegnerliste = document.getElementById("id-gegnerliste");

//Änderungskonstanten-Variablen
let idak30 = document.getElementById("id-ak30einzel");
let idak365 = document.getElementById("id-ak-365");
let idalter = document.getElementById("id-alter");

//Buttons definieren
let idbuttonnewrow = document.getElementById("btnNewRow");
let idbuttondelrow = document.getElementById("btnDeleteRow");
let idbuttoncalc = document.getElementById("btn-ausrechnen");

//NeuerWert
let neuerWert = document.getElementById("neuerWert");


//counter definieren. Fängt bei 1 an, weil Reihe 0 schon existiert
let counter = 1;

function wandleBoolInNummerUm(a) {
  if (a === true) {
    return 1;
  } else {
    return 0;
  }
}

function berechneKonstante(alter, e30, e365) {
  let zwischenkonstante = 16;
  if (alter < 21) {
    zwischenkonstante += 4;
  }
  if (alter < 16) {
    zwischenkonstante += 4;
  }
  if (e30 == true) {
    zwischenkonstante += 4;
  }
  if (e365 == true) {
    zwischenkonstante += 4;
  }
  return zwischenkonstante;
}

//Function für das Erstellen neuer Reihen
idbuttonnewrow.onclick = function (){
  //Alle Documente erstellen, die im Dokument gebraucht werden
  let rowList = document.createElement("LI");
  let rowInput = document.createElement("input"); 
  let rowLabel1 = document.createElement("label");
  let rowCheckbox = document.createElement("input"); rowCheckbox.type = "checkbox";
  let rowLabel2 = document.createElement("label");
  let rowGegnerpm = document.createElement("span");
  
  //Alle Elemente mit wichtigen Eigenschaften versehen
  //input-types
  rowInput.type = "text";
  
  
  //ids bzw. htmlFor
  rowList.id = "id-liste"+counter;
  rowInput.id = "id-gegner"+counter;
  rowLabel1.htmlFor = "id-gegner"+counter;
  rowCheckbox.id = "id-gegner"+counter+"win";
  rowLabel2.htmlFor = "id-gegner"+counter+"win";
  rowGegnerpm.id = "id-gegner"+counter+"pm";
  
  //Namen der Inputs
  rowInput.name = "gegner"+counter;
  rowCheckbox.name = "gegner"+counter+"win";
  
  //Label-Inhalte
  rowLabel1.innerHTML = "Gegner "+ (counter+1) +": ";
  rowLabel2.innerHTML = " Hast du gewonnen? ";
  
  //Alle Elemente an rowList anhängen
  rowList.append(rowLabel1,rowInput,rowLabel2,rowCheckbox,rowGegnerpm);
  idgegnerliste.appendChild(rowList);
  
  //Counter hochzählen, damit die IDs unique werden
  counter++;
  
  //ButtonDeleteRow visible schalten
  idbuttondelrow.style.display = "inline";
};

//Function für das Löschen der letzten Reihe
idbuttondelrow.onclick = function (){
  //idletztereihe = Das letzte erzeugte Listenelement
  let idletztereihe = document.getElementById("id-liste"+(counter-1));
  //Wenn (Counter > 1), was heißt, dass mehr als eine Reihe existiert, dann wird die letzte Reihe removed
  if (counter > 1){
    idletztereihe.remove();
  }
  
  //Counter wird verringert, damit die ids wieder die richtigen Zahlen haben
  counter--;
  
  //Wenn counter==1, was heißt, dass nur noch eine Reihe da ist, dann wird der Button zum Löschen ausgeblendet.
  if (counter == 1){
    idbuttondelrow.style.display = "none";
  }
  //maybe create tempcounter with tempcounter = counter-1
  //if counter < 1 -> delete row, damit die erste Reihe nicht gelöscht wird
};

//Function für das Ausrechnen der TTR Werte
idbuttoncalc.onclick = function (){
  //Anzahlgegner = Anzahl der Inputs durch 2, weil es sowohl checkbox als auch Text gibt
  let anzahlgegner = idgegnerliste.getElementsByTagName("input").length/2;

  //Setze Value onegoodvalue auf false, die erst true wird, wenn mindestens einmal gerechnet wurde
  let onegoodvalue = false;
  //valuearray, in den jeder Wert geschrieben wird
  //let valuearray = [];
  let insgesamtpunkte = parseInt(idttralt.value);
  //Wenn Alter keine Zahl ist, dann print Fehlermeldung
  if (isNaN(idalter.value)){
    neuerWert.innerHTML = "Bitte richtiges Alter angeben!";
    neuerWert.classList.add("Fehlermeldung");
  } else {
    if(isNaN(idttralt.value) || idttralt.value === ""){
      neuerWert.innerHTML = "Bitte Ihren TTR-Wert überprüfen"
    } else {
      //for-schleife, die jeden Wert einzeln überprüft
      for (let i = 0; i < anzahlgegner; i++){
        //Definieren der Variablen, die mit i dynamisch erzeugt werden
        let tempgegnerttr = document.getElementById("id-gegner"+i);
        let tempgegnerwin = document.getElementById("id-gegner"+i+"win");
        let tempgegnerpm = document.getElementById("id-gegner"+i+"pm");
        
        if (tempgegnerttr.value === ""){
          //Wenn leer ->
          tempgegnerpm.innerHTML = "leeres Feld";
          tempgegnerpm.classList.toggle("Fehlermeldung",false);
          
          //Wenn tempgegnerttr keine Zahl ist -> Fehlermeldung
        } else if (isNaN(parseInt(tempgegnerttr.value))){
          tempgegnerpm.innerHTML = "Bitte Zahl eingeben!";
          tempgegnerpm.classList.toggle("Fehlermeldung",true);
        } else {
          //Hier wird jetzt gerechnet, da tempgegnerttr weder Text noch leer ist, also eine Zahl sein muss
          // Da sowohl ein richtiges Alter als auch ein richtiger TTR-Wert vorhanden sind, können wir die ÄK berechnen
          let konstante = berechneKonstante(idalter.value, idak30.checked, idak365.checked);
          // Berechne Gewinnwahrscheinlichkeit mit Formel
          let tempgewinnwahrscheinlichkeit = 1 / (1 + Math.pow(10, (parseInt(tempgegnerttr.value) - parseInt(idttralt.value)) / 150));
          
          //Wandle Checkbox von bool in 1 oder 0 um für Formel
          let victory = wandleBoolInNummerUm(tempgegnerwin.checked);
          
          //Formel für Punkte plus oder minus
          let temppunkteplusminus = Math.round((victory - tempgewinnwahrscheinlichkeit) * konstante);
          
          //entferne Fehlermeldungsklasse          
          tempgegnerpm.classList.toggle("Fehlermeldung",false);
          //Je nach Sieg oder Niederlage assign Class oder füge "+" hinzu
          if(victory == 1){
            tempgegnerpm.innerHTML = "+"+temppunkteplusminus;
            tempgegnerpm.classList.toggle("plusminus-plus",true);
            tempgegnerpm.classList.toggle("plusminus-minus",false);
          } else {
            tempgegnerpm.innerHTML = temppunkteplusminus;
            tempgegnerpm.classList.toggle("plusminus-plus",false);
            tempgegnerpm.classList.toggle("plusminus-minus",true);
          }
          insgesamtpunkte += parseInt(temppunkteplusminus);
          onegoodvalue = true;
        }
        
        //Pushen der Werte in den Array
        /* valuearray.push([tempgegnerttr.name,tempgegnerttr.value,tempgegnerwin.checked]);
        console.log(valuearray); */
      }
      //let neuerttr = parseInt(idttralt.value) + parseInt(insgesamtpunkte);
      if(onegoodvalue){
        neuerWert.innerHTML = insgesamtpunkte;
        neuerWert.classList.toggle("Fehlermeldung",false);
      } else {
        neuerWert.innerHTML = "Mindestens ein Feld ausfüllen!";
        neuerWert.classList.toggle("Fehlermeldung",true);
      }
      
      if (insgesamtpunkte > parseInt(idttralt.value)){
        neuerWert.classList.toggle("plusminus-plus",true);
        neuerWert.classList.toggle("plusminus-minus",false);
      } else if (insgesamtpunkte < parseInt(idttralt.value)){
        neuerWert.classList.toggle("plusminus-plus",false);
        neuerWert.classList.toggle("plusminus-minus",true);
      }
      
    }
  }
  
  
  
};