//#: FASE DI PREPARAZIONE
//raccogliamo gli elementi di interesse dalla pagina
const grid = document.querySelector('.grid');
const leftButton = document.querySelector('.left-button');
const rightButton = document.querySelector('.right-button');

// Prepariamo la griglia iniziale
const gridMatrix = [
  ['', '', '', '', '', 'grass', ''],
  ['', 'cones', '', '', '', '', 'fence'],
  ['', '', 'rock', '', '', '', ''],
  ['fence', '', '', '', '', '', ''],
  ['', '', 'grass', '', '', 'water', ''],
  ['', '', '', '', 'cones', '', ''],
  ['', 'water', '', '', '', '', ''],
  ['', '', '', '', '', '', ''],
  ['', '', '', '', '', 'rock', ''],
];


// impostazioni iniziali
const kartPosition = { y: 7, x: 3};

// #:FUNZIONI RELATIVE ALLA GRIGLIA
//funzione per reinderizzare la griglia
function renderGrid() {
  //prima di tutto, svuota la griglia
  grid.innerHTML = '';
  //recupero ogni riga della matrice
  gridMatrix.forEach(function (rowCells) {
    //per ognuna delle caselle...
    rowCells.forEach(function (cellContent) {
      //creiamo un elemento div
      const cell = document.createElement('div');

      // inseriamo la classe 'cell'
      cell.className = 'cell';

      // se c'è qualcosa, aggiungi anche una classe con lo stesso nome
      if(cellContent) cell.classList.add(cellContent)

      // ora metti l'elemento nella griglia
      grid.appendChild(cell);
    });
  });
}


//funzione che raggruppa le operazioni di rendering
function renderElemets(){
  //posiziono il kart
  placeKart();

  //reinderizzo la griglia
  renderGrid();
}



//#:FUNZIONI RELATIVE AL KART
//funzione per posizionare il kart
function placeKart(){
  //inserisco la classe cart, nella cella corrispondente alle coordinate di kartPosition
  gridMatrix[kartPosition.y][kartPosition.x] = 'kart';
} 

//Funzione per muovere il kart
function moveKart(direction){
  //solleviamo il kart per spostarlo da un'altra parte
  gridMatrix[kartPosition.y][kartPosition.x] = '';

  //aggiorniamo le coordinate a seconda della direzione
  switch(direction){
    case 'left':
      if(kartPosition.x > 0) kartPosition.x--;
      break;
    case 'right':
      if(kartPosition.x < 6) kartPosition.x++;
      break;
    default:
      gridMatrix[kartPosition.y][kartPosition.x] = 'kart';
  }

  //reinderizzare tutti gli elementi
  renderElemets();
}


// #: EVENTI DEL GIOCO
//click sul bottone di sinistra
leftButton.addEventListener('click' , function(){
  moveKart('left');
});

//click sul bottone di destra
rightButton.addEventListener('click' , function(){
  moveKart('right');
});

//reazione alle freccette
document.addEventListener('keyup' , function(e){
  switch(e.key) {
    case 'ArrowLeft':
      moveKart('left');
      break;
    case 'ArrowRight':
      moveKart('right');
      break;
    default: return;
  }
})
 

//#:ESECUZIONE DELLE FUNZIONI DI GIOCO
//reinderizza tutti gli elementi
renderElemets();
