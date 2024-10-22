//#: FASE DI PREPARAZIONE
//raccogliamo gli elementi di interesse dalla pagina
const grid = document.querySelector('.grid');
const leftButton = document.querySelector('.left-button');
const rightButton = document.querySelector('.right-button');
const scoreCounter = document.querySelector('.score-counter');
const EndGameScreen = document.querySelector('.end-game-screen');
const finalScore = document.querySelector('.final-score');
const playAgainButton = document.querySelector('.play-again');
const turboButton = document.querySelector('.turbo');


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
const kartPosition = { y: 7, x: 3 };
let score = 0;
let speed = 1000;
let turbo = 1;

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
      if (cellContent) cell.classList.add(cellContent)

      // ora metti l'elemento nella griglia
      grid.appendChild(cell);
    });
  });
}


//funzione che raggruppa le operazioni di rendering
function renderElements() {
  //posiziono il kart
  placeKart();

  //reinderizzo la griglia
  renderGrid();
}



//#:FUNZIONI RELATIVE AL KART
//funzione per posizionare il kart
function placeKart() {
  // Recuperiamo il valore della cella in cui dobbiamo posizionare il kart
  const contentBeforeKart = gridMatrix[kartPosition.y][kartPosition.x];

  // Se c'è monetina, prendi i punti bonus, altrimenti è collisione
  if (contentBeforeKart === 'coin') getBonusPoints();
  else if (contentBeforeKart) gameOver();

  // inserisco la classe cart, nella cella corrispondente alle coordinate di kartPosition
  gridMatrix[kartPosition.y][kartPosition.x] = 'kart';
}

//Funzione per muovere il kart
function moveKart(direction) {
  //solleviamo il kart per spostarlo da un'altra parte
  gridMatrix[kartPosition.y][kartPosition.x] = '';

  //aggiorniamo le coordinate a seconda della direzione
  switch (direction) {
    case 'left':
      if (kartPosition.x > 0) kartPosition.x--;
      break;
    case 'right':
      if (kartPosition.x < 6) kartPosition.x++;
      break;
    default:
      gridMatrix[kartPosition.y][kartPosition.x] = 'kart';
  }

  //reinderizzare tutti gli elementi
  renderElements();
}


//#:FUNZIONI RELATIVE AGLI OSTACOLI
// Funzione per far scorrere gli ostacoli
function scroolObstacles() {
  // Rimuoviamo temporaneamente il kart
  gridMatrix[kartPosition.y][kartPosition.x] = '';

  // controllo se c'è una moneta in gioco
  const isCoinInGame = lookForCoin();

  // Recuperiamo l'ultima riga e la mettiamo da parte
  let lastRow = gridMatrix.pop();

  // Inseriamo una monetina nella riga se non ci sono in gioco
  if (!isCoinInGame) lastRow = insertCoin(lastRow);

  // Mescoliamo casualmente gli elementi della riga
  lastRow = shuffleElements(lastRow);

  // Riporto la riga in cima
  gridMatrix.unshift(lastRow);

  // Rirenderizziamo tutto
  renderElements();
}


//Funzione per mescolare gli elementi di una riga
function shuffleElements(row) {
  // Algoritmo di Fisher-Yates
  for (let i = row.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [row[i], row[j]] = [row[j], row[i]];
  }

  return row;
}


//#: FUNZIONE DI FINE PARTITA
function gameOver() {
  // interrompo il flusso di gioco
  clearInterval(gameLoop);

  //inserisco il punteggio
  finalScore.innerText = score;

  // Rivelo l'immagiine di game over
  EndGameScreen.classList.remove('hidden');

  // Porto il focus sul tasto gioca ancora
  playAgainButton.focus();
}



//#: FUNZIONI RELATIVE AI PUNTI E ALLA VELOCITÀ
// Funzione che incrementa il punteggio
function incrementScore() {
  // Aumento il punteggio di 1 e lo inserisco in pagina
  scoreCounter.innerText = ++score;
}

// Funzione che incrementa la velocità
function incrementSpeed() {
  // Se non siamo già troppo veloci
  if (speed > 100) {
    // Interrompo il flusso attuale
    clearInterval(gameLoop);

    // Decremento intervallo (aumentando così la velocità)
    speed -= 100;

    // Rilanciamoo un nuovo flusso con la velocità aggiornata
    gameLoop = setInterval(runGameFlow, speed);
  }
}


//#: FUNZIONI RELATIVE AL BONUS
// funzione per ottenere punti bonus
function getBonusPoints() {
  // incrementiamo il puntteggio di 30
  score += 30;

  // inseriamo il punteggio aggiornato in pagina
  scoreCounter.innerText = score;

  // Aggiungiamo la classe 'bonus' al contatore
  scoreCounter.classList.add('bonus');

  // Rimuoviamo la classe subito modo in modo da poterla riassegnare (e vedere l'effetto)
  setTimeout(function () {
    scoreCounter.classList.remove('bonus');
  }, 1000)
}


// Funzione per inserire un coin all'interno di una riga
function insertCoin(row) {
  // Individuiamo l'indice del primo elemento vuoto
  const emptyIndex = row.indexOf('');

  // Inseriamo un coin in quella posizione
  row[emptyIndex] = 'coin';

  // Restituire la riga aggiornata (con il coin)
  return row;
}


// Funzione per sapere se c'è un coin in giro
function lookForCoin() {
  // Creo un flag
  let coinFound = false;

  // Recupero tutte le righe
  gridMatrix.forEach(function (row) {
    // Per ogni riga controllo se c'è un coin
    if (row.includes('coin')) coinFound = true;
  });

  return coinFound;
}


//#: FUNZIONI RELATIVE AL FLUSSO DI GIOCO
// Funzione che raggruppa le operazioni da ripetere ciclicamente
function runGameFlow() {
  // Aumentare il punteggio
  incrementScore();

  // Far scorrere gli ostacoli
  scroolObstacles();
}


// Funzione del turbo
function turboBoost() {
  if (turbo < 4) {
    // Incrementiamo il turboo e mostriamo la lancetta giusta
    turboButton.innerHTML = `<img src="img/gauge-${++turbo}.png" alt="turbo">`

    incrementSpeed();
  }
}


// #: EVENTI DEL GIOCO
//click sul bottone di sinistra
playAgainButton.addEventListener('click', function () {
  location.reload();
});

//click sul bottone di sinistra
leftButton.addEventListener('click', function () {
  moveKart('left');
});

//click sul bottone di destra
rightButton.addEventListener('click', function () {
  moveKart('right');
});

//click sul bottone centrale
turboButton.addEventListener('click', turboBoost);


//controlli con la tastiera
document.addEventListener('keyup', function (e) {
  switch (e.key) {
    case 'ArrowLeft':
      moveKart('left');
      break;
    case 'ArrowRight':
      moveKart('right');
      break;
    case ' ':
      turboBoost();
      break;
    default: return;
  }
})


//#:ESECUZIONE DELLE FUNZIONI DI GIOCO
// Scrollo automaticamente gli ostacoli
let gameLoop = setInterval(runGameFlow, speed);
