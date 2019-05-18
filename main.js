
const PLAYER_COUNT = 2;
const PLAYER_NAMES = ["Danne", "Nany"];

const TOTAL_CARDS = 108;
const TOTAL_ROUNDS = 3;

const PLAYER_POSITIONS = [
  { x: 0, y: 0 }, // TOP
  { x: 0, y: 100 },  // LEFT
  { x: 0, y: 20 },  // BOTTOM
  { x: 0, y: 20 },  // RIGHT
]

const CARDS = {
  'Tempura': 14,
  'Sashimi': 14,
  'Dumpling': 14,
  'Maki': 26,
  'Salmon Nigri': 10,
  'Squid Nigri': 5,
  'Egg': 5,
  'Pudding': 10,
  'Wasabi': 6,
  'Chopsticks': 4,
};

const CARD_SIZE = {
  width: 25,
  height: 50
}

const CARDS_PER_PLAYER = {
  2: 10,
  3: 9,
  4: 8,
  5: 7,
}

const PLAYER_STATE = {
  WAITING: "waiting",
  CHOOSING_CARD: "choosing_card",
  HAS_CHOSEN_CARD: "has_chosen_card",
  TAKE_UP_HAND: "take_up_hand"
};

const GAME_STATE = {
  STARTING_GAME: "starting_game",
  DEALING_CARDS_TO_PLAYERS: "dealing_cards_to_players",
  PLAYERS_CHOOSE_CARD: "players_choose_card",
  PLAYERS_REVEAL_CARD: "players_reveal_card",
  PLAYERS_PICKUP_HAND: "players_pickup_hand",
  CALCULATING_SCORES: "calculating_scores"
};

let deck = [];
let players = [];
let tableCards = [];
let remainingCards = 0;
let remainingRounds = 0;

let currentRound = 1;
let currentGameState = GAME_STATE.STARTING_GAME;

let ctx;

let canvas = {
  element: null,
  offsetX: 0,
  offsetY: 0,
};

let windowSettings = {
  width: window.innerWidth,
  height: window.innerHeight
}

window.requestAnimFrame = window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  function (callback) {
    window.setTimeout(callback, 1000 / 60);
  };

// define Player constructor
class Player {
  constructor(name = "Default", hand = [], position) {
    this.name = name
    this.hand = hand
    this.x = position.x
    this.y = position.y
    this.revealedCards = []
    this._currentState = PLAYER_STATE.WAITING
  }

  addCardToHand(card) {
    this.hand.push(card)
    this.hand.forEach((card, i) => {
      card.x = this.x + i * CARD_SIZE.width * 2;
      card.y = this.y;
    })
  }

  updateHand(hand) {
    this.hand = hand
    this.hand.forEach((card, i) => {
      card.x = this.x + i * CARD_SIZE.width * 2;
      card.y = this.y;
    });
  }

  pickCard(cardIndex) {
    let card = this.hand.splice(cardIndex, 1)[0];
    card.isPicked = true;
    this.revealedCards.push(card)

    this.revealedCards.forEach((card, i) => {
      card.x = this.x + CARD_SIZE.width * i * 2;
      card.y = this.y + CARD_SIZE.height;

    })

    this._currentState = PLAYER_STATE.HAS_CHOSEN_CARD; 
    console.log(this.name + ' has picked ' + card.name);
  }

  putHandOnTable() {
    let table = this.hand;
    this.hand = [];
    return table;
  }

  get currentState() {
    return this._currentState;
  }

  set currentState(newState) {
    this._currentState = newState;
  }

  printPlayer() {
    console.log(this.name + ' has the hand: ');
    this.hand.forEach(card => {
      console.log('\t' + card.name)
    });
    console.log('And has revealed: ')
    this.revealedCards.forEach(card => {
      console.log('\t' + card.name)
    });
  }

  paintHand() {
    this.hand.forEach(card => {
      card.paint();
    });
    this.revealedCards.forEach(card => {
      card.paint();
    });
  }
}

class Card {
  constructor(name = "DefaultCard", isPicked = false) {
    this.name = name
    this._x = 0
    this._y = 0
    this._isPicked = isPicked
  }

  get isPicked() {
    return this._isPicked;
  }

  set isPicked(newState) {
    this._isPicked = newState;
  }

  get x() {
    return this._x;
  }

  set x(newX) {
    this._x = newX;
  }

  get y() {
    return this._y;
  }

  set y(newY) {
    this._y = newY;
  }

  paint() {
    // paint the card
    ctx.beginPath();
    ctx.rect(
      this._x,
      this._y,
      CARD_SIZE.width, 
      CARD_SIZE.height
    );
    if (this._isPicked) {
      ctx.fillStyle = "blue";
    } else {
    ctx.fillStyle = "red";
    }
    ctx.fill();
  }

  print() {
    console.log(this.name, this._x, this._y)
  }

}

function shuffleDeck() {
// Shuffles an array based on https://en.wikipedia.org/wiki/Fisher–Yates_shuffle#Modern_method

  // --To shuffle an array a of n elements(indices 0..n - 1):
  // for i from n−1 downto 1 do
  for (let i = deck.length - 1; i > 0; i--) {
    //   j ← random integer such that 0 ≤ j ≤ i
    let j = Math.floor(Math.random() * (i + 1));
    // exchange a[j] and a[i]
    let tmp = deck[i]
    deck[i] = deck[j]
    deck[j] = tmp
  }
}

function resizeCanvas() {
  windowSettings.width = window.innerWidth;
  windowSettings.height = window.innerHeight;
  canvas.element.width = windowSettings.width;
  canvas.element.height = windowSettings.height;
}

function setupCanvas() {
  canvas.element = document.getElementById('canvas');
  canvas.offsetX = canvas.element.offsetLeft;
  canvas.offsetY = canvas.element.offsetTop;

  ctx = canvas.element.getContext('2d');
  resizeCanvas();

  // Add event listener for `click` events.
  canvas.element.addEventListener('click', event => {
    if (currentGameState == GAME_STATE.PLAYERS_CHOOSE_CARD) {

      let x = event.pageX - canvas.offsetX;
      let y = event.pageY - canvas.offsetY;

      // Collision detection between clicked offset and element.
      players.forEach(player => {
        for (let i = 0; i < player.hand.length; i++) {
          const card = player.hand[i];
          if ((x > card.x && x < card.x + CARD_SIZE.width) &&
            (y > card.y && y < card.y + CARD_SIZE.height)) {
            player.pickCard(i);
          }
        }
      });
    }
  }, false);
}

function setupDeck() {
  deck = []
  for (const card in CARDS) {
    let cardCount = CARDS[card]
    for (let i = 0; i < cardCount; i++) {
      deck.push(new Card(card))
    }
  }
}

function setupPlayers() {
  players = []
  PLAYER_NAMES.forEach((name, i) => {
    players.push(new Player(name, [], PLAYER_POSITIONS[i]))
  });
}

function dealOneHand() {
  remainingCards = CARDS_PER_PLAYER[PLAYER_COUNT];
  // Deal cards
  for (let noCards = remainingCards; noCards > 0; noCards--) {
    for (let playerNum = 0; playerNum < PLAYER_COUNT; playerNum++) {
      players[playerNum].addCardToHand(deck.shift())
    }
  }
}

function setRemainingCardsTitle() {
  let title = document.getElementById('cards-remaining');
  title.innerText = 'Remaining Rounds: ' + remainingCards
}

function setRemainingRoundsTitle() {
  let title = document.getElementById('rounds-remaining');
  title.innerText = 'Remaining Rounds: ' + remainingRounds
}

function setup() {
  setupCanvas();
  setupDeck();
  shuffleDeck();
  setupPlayers();
  dealOneHand();

  setRemainingCardsTitle();

  remainingRounds = TOTAL_ROUNDS
  setRemainingRoundsTitle();
  setGameState(GAME_STATE.PLAYERS_CHOOSE_CARD);
}

function waitForPlayers() {
  let waitingForPlayers = false;
  do {
    waitingForPlayers = players.every((player) => {
      player.currentState == PLAYER_STATE.WAITING
    });
  } while (!waitingForPlayers)
  console.log('Finished waiting for players')
}

function playersHasPickedCards() {
  waitingForPlayers = false;
  do {
    waitingForPlayers = players.some((player) => {
      player.currentState != PLAYER_STATE.WAITING
    });
  } while (waitingForPlayers)
  console.log('Finished waiting for players')
}

function setAllPlayerState(state) {
  players.forEach(player => {
    player.currentState = state;
  });
}

function setGameState(state) {
  currentGameState = state;
}

function allPlayersHaveChosen() {
  for (const player of players) {
    if (player.currentState != PLAYER_STATE.HAS_CHOSEN_CARD) {
      return false;
    }
  }
  return true;
}

function loop() {
  console.log(currentGameState)
  switch (currentGameState) {
    case GAME_STATE.STARTING_GAME:
      return;
    case GAME_STATE.DEALING_CARDS_TO_PLAYERS:
      dealOneHand();
      setGameState(GAME_STATE.PLAYERS_CHOOSE_CARD);
      break;
    case GAME_STATE.PLAYERS_CHOOSE_CARD:
      if (allPlayersHaveChosen()) {
        remainingCards -= 1
        setRemainingCardsTitle()
        setGameState(GAME_STATE.PLAYERS_REVEAL_CARD);
        setAllPlayerState(PLAYER_STATE.TAKE_UP_HAND);
      }
      break;
    case GAME_STATE.PLAYERS_REVEAL_CARD:
      if (remainingCards == 0) {
        if (currentRound == TOTAL_ROUNDS) {
          setGameState(GAME_STATE.CALCULATING_SCORES);
        } else {
          currentRound += 1;
          setGameState(GAME_STATE.DEALING_CARDS_TO_PLAYERS);
        }
        }
      else {
        setGameState(GAME_STATE.PLAYERS_PICKUP_HAND);
      }
    default:
      break;
  }

  ctx.clearRect(0, 0, canvas.element.width, canvas.element.height);
  
  players.forEach(player => {
    player.paintHand();
  });
  // let numberOfCards = cardsPerPlayer[playerCount];

  // // Play cards
  // do {
  //   waitForPlayers();
  //   setAllPlayerState(playerState.CHOOSING_CARD)
  //   // Pick the card from the hand
  //   playersHasPickedCards();
  //   // for (let playerNum = 0; playerNum < playerCount; playerNum++) {
  //   //   let player = players[playerNum]
  //   //   console.log(player.name + ' picked: ' + player.pickCard())
  //   //   tableCards[playerNum] = player.putHandOnTable()
  //   // }
  //   // Pick up cards from the left
  //   // for (let playerNum = 0; playerNum < playerCount; playerNum++) {
  //   //   let player = players[playerNum]
  //   //   if (playerNum < (playerCount - 1)) {
  //   //     player.updateHand(tableCards[playerNum + 1])
  //   //     tableCards[playerNum + 1] = []
  //   //   }
  //   //   else {
  //   //     player.updateHand(tableCards[0])
  //   //     tableCards[0] = []
  //   //   }
  //   // } 
  // } while (--numberOfCards > 0)
  window.requestAnimFrame(loop);
}

window.onload = function () {
  setup();
  window.requestAnimFrame(loop);
};

window.onresize = resizeCanvas;