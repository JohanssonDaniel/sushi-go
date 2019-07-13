/* eslint-disable no-underscore-dangle */
const PLAYER_COUNT = 2;
const PLAYER_NAMES = ['Danne', 'Nany'];

// const TOTAL_CARDS = 108;
const TOTAL_ROUNDS = 3;

const IMG_PATH = 'dist/static/img/';

const IMG_NAMES = {
  back: 'sushigo_back.jpg',
  tempura: 'sushigo_tempura.jpg',
  sashimi: 'sushigo_sashimi.jpg',
  dumpling: 'sushigo_dumpling.jpg',
  maki: 'sushigo_maki_1.jpg',
  salmon_nigiri: 'sushigo_nigiri_salmon.jpg',
  squid_nigiri: 'sushigo_nigiri_squid.jpg',
  egg_nigiri: 'sushigo_nigiri_egg.jpg',
  pudding: 'sushigo_pudding.jpg',
  wasabi: 'sushigo_wasabi.jpg',
  chopsticks: 'sushigo_chopsticks.jpg',
};


const IMAGES = {
  back: new Image(),
  tempura: new Image(),
  sashimi: new Image(),
  dumpling: new Image(),
  maki: new Image(),
  salmon_nigiri: new Image(),
  squid_nigiri: new Image(),
  egg_nigiri: new Image(),
  pudding: new Image(),
  wasabi: new Image(),
  chopsticks: new Image(),
};

const IMAGE_SIZE = {
  width: 241,
  height: 367,
};

const CARDS = [
  {
    name: 'Tempura',
    count: 14,
    color: 'black',
  },
  {
    name: 'Sashimi',
    count: 14,
    color: 'red',
  },
  {
    name: 'Dumpling',
    count: 14,
    color: 'blue',
  },
  {
    name: 'Maki',
    count: 26,
    color: 'green',
  },
  {
    name: 'Salmon Nigiri',
    count: 10,
    color: 'purple',
  },
  {
    name: 'Squid Nigiri',
    count: 5,
    color: 'gray',
  },
  {
    name: 'Egg Nigiri',
    count: 5,
    color: 'pink',
  },
  {
    name: 'Pudding',
    count: 10,
    color: 'orange',
  },
  {
    name: 'Wasabi',
    count: 6,
    color: 'lightblue',
  },
  {
    name: 'Chopsticks',
    count: 4,
    color: 'pink',
  },
];

const CARD_SIZE = {
  width: 100,
  height: 150,
};

const CARD_MARGINS = {
  x: 10,
  y: 5,
};

const CARDS_PER_PLAYER = {
  2: 10,
  3: 9,
  4: 8,
  5: 7,
};

const PLAYER_STATE = {
  WAITING: 'is_waiting',
  CHOOSING_CARD: 'will_choose_card',
  HAS_CHOSEN_CARD: 'has_chosen_card',
  REVEAL_CARD: 'will_reveal_card',
  PUT_DOWN_HAND: 'will_put_down_hand',
  PICKUP_HAND: 'will_take_up_hand',
};

const CARD_STATE = {
  IN_DECK: 'is_in_deck',
  IN_HAND: 'is_in_hand',
  HOVERED_OVER: 'is_hovered_over',
  BEING_CHOSEN: 'is_being_chosen',
  BEING_REVEALED: 'is_being_revealed',
};

const GAME_STATE = {
  STARTING_GAME: 'starting_game',
  DEALING_CARDS_TO_PLAYERS: 'dealing_cards_to_players',
  PLAYERS_CHOOSE_CARD: 'players_choose_card',
  PLAYERS_REVEAL_CARD: 'players_reveal_card',
  PLAYERS_PUT_DOWN_HAND: 'players_put_down_hand',
  PLAYERS_PICKUP_HAND: 'players_pickup_hand',
  CALCULATING_SCORES: 'calculating_scores',
};

const CARD_UPDATE_DIRECTION = [1, -1, 0, 0];

const PLAYER_POSITIONS = [
  { x: 0, y: 0 }, // First
  { x: 0, y: CARD_SIZE.height * 3 + CARD_MARGINS.y }, // Second
  null,
  null,
];

let ctx;

let game;

const canvas = {
  element: null,
  offsetX: 0,
  offsetY: 0,
};

const windowSettings = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.requestAnimFrame = window.requestAnimationFrame
  || window.webkitRequestAnimationFrame
  || window.mozRequestAnimationFrame
  || function setTimeOutCallback(callback) {
    window.setTimeout(callback, 1000 / 60);
  };

// define Player constructor
class Player {
  constructor(name = 'Default', hand = [], position) {
    this.name = name;
    this.hand = hand;
    this.x = position.x;
    this.y = position.y;
    this.revealedCards = [];
    this._currentState = PLAYER_STATE.WAITING;
    this.currentScore = 0;
    this.currentMakiCount = 0;
    this.currentPuddingCount = 0;
  }

  addCardToHand(card) {
    card.x = this.x + this.hand.length * (CARD_SIZE.width + CARD_MARGINS.x);
    card.y = this.y + CARD_MARGINS.y;
    this.hand.push(card);
  }

  pickupHand(hand) {
    this.hand = hand;
    this.hand.forEach((card, i) => {
      card.x = this.x + i * (CARD_SIZE.width + CARD_MARGINS.x);
      card.y = this.y;
    });
  }

  pickCard(cardIndex) {
    const newCard = this.hand.splice(cardIndex, 1)[0];
    newCard.isPicked = true;
    newCard.x = this.x + this.revealedCards.length * (CARD_SIZE.width + CARD_MARGINS.x);
    newCard.y = this.y + CARD_SIZE.height;
    this.revealedCards.push(newCard);

    this.currentState = PLAYER_STATE.HAS_CHOSEN_CARD;
    console.log(`${this.name} has picked ${newCard.name}`);
  }

  putHandOnTable() {
    const table = this.hand;
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
    console.log(`${this.name} has the hand: `);
    this.hand.forEach((card) => {
      console.log(`\t ${card.name}`);
    });
    console.log('And has revealed: ');
    this.revealedCards.forEach((card) => {
      console.log(`\t ${card.name}`);
    });
  }

  paintHand() {
    this.hand.forEach((card) => {
      card.paint();
    });
    this.revealedCards.forEach((card) => {
      card.paint();
    });
  }
}

class Card {
  constructor(name = 'DefaultCard', color = 'black', isPicked = false) {
    this.name = name;
    this.color = color;
    this._x = 0;
    this._y = 0;
    this._isPicked = isPicked;
    this.mouseIsOver = false;

    
    this.img = null;
    switch (this.name) {
      case 'Tempura':
        this.img = IMAGES.tempura;
        break;
      case 'Sashimi':
        this.img = IMAGES.sashimi;
        break;
      case 'Dumpling':
        this.img = IMAGES.dumpling;
        break;
      case 'Maki':
        this.img = IMAGES.maki;
        break; 
      case 'Salmon Nigiri':
        this.img = IMAGES.salmon_nigiri;
        break;
      case 'Squid Nigiri':
        this.img = IMAGES.squid_nigiri;
        break;
      case 'Egg Nigiri':
        this.img = IMAGES.egg_nigiri;
        break;
      case 'Pudding':
        this.img = IMAGES.pudding;
        break;
      case 'Wasabi':
        this.img = IMAGES.wasabi;
        break;
      case 'Chopsticks':
        this.img = IMAGES.chopsticks;
        break;
      default:
        break;
    }
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
    if (this.mouseIsOver) {
      ctx.drawImage(this.img, 0, 0,
        ctx.drawImage(this.img, 0, 0,
          IMAGE_SIZE.width, IMAGE_SIZE.height, this.x,
          this.y - CARD_MARGINS.y, CARD_SIZE.width, CARD_SIZE.height);
    } else {
      ctx.drawImage(this.img, 0, 0,
        IMAGE_SIZE.width, IMAGE_SIZE.height, this._x,
        this._y, CARD_SIZE.width, CARD_SIZE.height);
    }
  }

  print() {
    console.log(this.name, this._x, this._y);
  }
}

class Game {
  constructor(startRound = 0, startState = GAME_STATE.STARTING_GAME,
    totalRounds = TOTAL_ROUNDS, cardsPerRound = CARDS_PER_PLAYER['2']) {
    this.deck = [];
    this.players = [];
    this.handsOnTable = [];
    this.currentRound = startRound;
    this.currentState = startState;
    this.remainingRounds = totalRounds;
    this.cardsPerRound = cardsPerRound;
    this.remainingCards = cardsPerRound;
  }

  setupDeck() {
    this.deck = [];
    CARDS.forEach((card) => {
      for (let i = 0; i < card.count; i += 1) {
        // this.deck.push(new Card(card.name, card.filename, card.color));
        this.deck.push(new Card(card.name, card.color));
      }
    });
  }

  shuffleDeck() {
    // Shuffles an array based on https://en.wikipedia.org/wiki/Fisher–Yates_shuffle#Modern_method

    // --To shuffle an array a of n elements(indices 0..n - 1):
    // for i from n−1 downto 1 do
    for (let i = this.deck.length - 1; i > 0; i -= 1) {
      //   j ← random integer such that 0 ≤ j ≤ i
      const j = Math.floor(Math.random() * (i + 1));
      // exchange a[j] and a[i]
      const tmp = this.deck[i];
      this.deck[i] = this.deck[j];
      this.deck[j] = tmp;
    }
  }

  setupPlayers() {
    this.players = [];
    PLAYER_NAMES.forEach((name, i) => {
      this.players.push(new Player(name, [], PLAYER_POSITIONS[i]));
    });
  }

  setupHandsOnTable() {
    this.handsOnTable = [];
    this.players.forEach(() => {
      this.handsOnTable.push([]);
    });

    this.players.forEach((player) => {
      player.revealedCards = [];
    });
  }

  dealOneHand() {
    // Deal cards
    for (let noCards = this.cardsPerRound; noCards > 0; noCards -= 1) {
      for (let playerNum = 0; playerNum < PLAYER_COUNT; playerNum += 1) {
        this.players[playerNum].addCardToHand(this.deck.shift());
      }
    }
  }

  setGameState(state) {
    this.currentGameState = state;
  }

  setAllPlayerState(state) {
    this.players.forEach((player) => {
      player.currentState = state;
    });
  }

  playersPutHandOnTable() {
    this.players.forEach((player, i) => {
      const nextPlayerIDX = (i === this.players.length - 1) ? 0 : i + 1;
      this.handsOnTable[nextPlayerIDX] = player.putHandOnTable();
    });
  }

  playersPickupHandFromTable() {
    this.players.forEach((player, i) => {
      player.pickupHand(this.handsOnTable[i]);
    });
  }

  paint() {
    this.players.forEach((player) => {
      player.paintHand();
    });
  }
}

function calculateTempuraScore(tempuraCount) {
  if (tempuraCount > 0) {
    let score = 0;
    let count = tempuraCount;
    while (count % 2 === 0) {
      count /= 2;
      score += 5;
    }
    return score;
  }
  return 0;
}

function calculateSashimiScore(sashimiCount) {
  if (sashimiCount > 0) {
    let score = 0;
    let count = sashimiCount;
    while (count % 3 === 0) {
      count /= 3;
      score += 10;
    }
    return score;
  }
  return 0;
}

function calculateDumplingScore(dumplingCount) {
  const dumplingScores = [1, 3, 6, 10, 15];
  if (dumplingCount > 0) {
    if (dumplingCount < dumplingScores.length) {
      return dumplingScores[dumplingCount];
    }
    return dumplingScores[dumplingScores.length - 1]; // Maximum value
  }
  return 0;
}

function calculatePlayerScore(player) {
  let score = 0;
  let makiCount = 0;
  let tempuraCount = 0;
  let sashimiCount = 0;
  let puddingCount = 0;
  let dumplingCount = 0;
  let hasWasabi = false;

  player.revealedCards.forEach((card) => {
    if (card.name === 'Tempura') {
      tempuraCount += 1;
    } else if (card.name === 'Dumpling') {
      dumplingCount += 1;
    } else if (card.name === 'Sashimi') {
      sashimiCount += 1;
    } else if (card.name === 'Maki') {
      makiCount += 1;
    } else if (card.name === 'Pudding') {
      puddingCount += 1;
    } else if (card.name === 'Wasabi') {
      hasWasabi = true;
    } else if (card.name === 'Salmon Nigiri') {
      score += hasWasabi ? 3 * 3 : 3;
      hasWasabi = false;
    } else if (card.name === 'Squid Nigiri') {
      score += hasWasabi ? 3 * 2 : 2;
      hasWasabi = false;
    } else if (card.name === 'Egg Nigiri') {
      score += hasWasabi ? 3 * 1 : 1;
      hasWasabi = false;
    } else {
      console.log('Wrong card', card.name);
    }
  });

  score += calculateTempuraScore(tempuraCount);
  score += calculateSashimiScore(sashimiCount);
  score += calculateDumplingScore(dumplingCount);

  player.currentScore += score;
  player.currentMakiCount += makiCount;
  player.currentPuddingCount += puddingCount;
}

function calculateAllPlayerScore() {
  game.players.forEach((player) => {
    calculatePlayerScore(player);
  });
}

function loadImages() {
  IMAGES.back.src = `${IMG_PATH}${IMG_NAMES.back}`;
  IMAGES.tempura.src = `${IMG_PATH}${IMG_NAMES.tempura}`;
  IMAGES.sashimi.src = `${IMG_PATH}${IMG_NAMES.sashimi}`;
  IMAGES.dumpling.src = `${IMG_PATH}${IMG_NAMES.dumpling}`;
  IMAGES.maki.src = `${IMG_PATH}${IMG_NAMES.maki}`;
  IMAGES.salmon_nigiri.src = `${IMG_PATH}${IMG_NAMES.salmon_nigiri}`;
  IMAGES.squid_nigiri.src = `${IMG_PATH}${IMG_NAMES.squid_nigiri}`;
  IMAGES.egg_nigiri.src = `${IMG_PATH}${IMG_NAMES.egg_nigiri}`;
  IMAGES.pudding.src = `${IMG_PATH}${IMG_NAMES.pudding}`;
  IMAGES.wasabi.src = `${IMG_PATH}${IMG_NAMES.wasabi}`;
  IMAGES.chopsticks.src = `${IMG_PATH}${IMG_NAMES.chopsticks}`;
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

  // Add event listener for `mousemove` event.
  canvas.element.addEventListener('mousemove', (event) => {
    if (game.currentGameState === GAME_STATE.PLAYERS_CHOOSE_CARD) {
      const x = event.pageX - canvas.offsetX;
      const y = event.pageY - canvas.offsetY;

      // Collision detection between the canvas and the element that the mouse hovers.
      game.players.forEach((player) => {
        if (player.currentState === PLAYER_STATE.CHOOSING_CARD) {
          for (let i = 0; i < player.hand.length; i += 1) {
            const card = player.hand[i];
            if ((x > card.x && x < card.x + CARD_SIZE.width)
              && (y > card.y && y < card.y + CARD_SIZE.height)) {
              card.mouseIsOver = true;
            } else {
              card.mouseIsOver = false;
            }
          }
        }
      });
    }
  }, false);

  // Add event listener for `click` events.
  canvas.element.addEventListener('click', (event) => {
    if (game.currentGameState === GAME_STATE.PLAYERS_CHOOSE_CARD) {
      const x = event.pageX - canvas.offsetX;
      const y = event.pageY - canvas.offsetY;

      // Collision detection between clicked offset and element.
      game.players.forEach((player) => {
        if (player.currentState === PLAYER_STATE.CHOOSING_CARD) {
          for (let i = 0; i < player.hand.length; i += 1) {
            const card = player.hand[i];
            if ((x > card.x && x < card.x + CARD_SIZE.width)
              && (y > card.y && y < card.y + CARD_SIZE.height)) {
              player.pickCard(i);
            }
          }
        }
      });
    }
  }, false);
}

function setRemainingCardsTitle() {
  document.getElementById('cards-remaining')
    .innerText = `Remaining Cards: ${game.remainingCards}`;
}

function setRemainingRoundsTitle() {
  document.getElementById('rounds-remaining')
    .innerText = `Remaining Rounds: ${game.remainingRounds}`;
}

function setPlayerScoreTitle() {
  document.getElementById('player1-score')
    .innerText = `Player 1 Score: ${game.players[0].currentScore}`;
  document.getElementById('player2-score')
    .innerText = `Player 2 Score: ${game.players[1].currentScore}`;
}

function setup() {
  loadImages();

  game = new Game();

  setupCanvas();
  game.setupDeck();
  game.setupHandsOnTable();
  game.setupPlayers();
  game.shuffleDeck();
  game.dealOneHand();
  game.setAllPlayerState(PLAYER_STATE.CHOOSING_CARD);
  game.setGameState(GAME_STATE.PLAYERS_CHOOSE_CARD);

  setRemainingCardsTitle();
  setRemainingRoundsTitle();
  setPlayerScoreTitle();
}

function allPlayersHaveChosen() {
  return game.players.every((player) => {
    return player.currentState === PLAYER_STATE.HAS_CHOSEN_CARD;
  });
}

function loop() {
  switch (game.currentGameState) {
    case GAME_STATE.STARTING_GAME:
      return;
    case GAME_STATE.DEALING_CARDS_TO_PLAYERS:
      game.setupHandsOnTable();
      game.dealOneHand();
      game.setAllPlayerState(PLAYER_STATE.CHOOSING_CARD);
      game.setGameState(GAME_STATE.PLAYERS_CHOOSE_CARD);

      setRemainingCardsTitle();
      break;
    case GAME_STATE.PLAYERS_CHOOSE_CARD:
      if (allPlayersHaveChosen()) {
        game.playersPutHandOnTable();
        game.remainingCards -= 1;
        setRemainingCardsTitle();
        game.setAllPlayerState(PLAYER_STATE.REVEAL_HAND);
        game.setGameState(GAME_STATE.PLAYERS_REVEAL_CARD);
      }
      break;
    case GAME_STATE.PLAYERS_REVEAL_CARD:
      if (game.remainingCards === 0) {
        calculateAllPlayerScore();
        setPlayerScoreTitle();
        if (game.currentRound === TOTAL_ROUNDS) {
          game.setAllPlayerState(PLAYER_STATE.WAITING);
          game.setGameState(GAME_STATE.CALCULATING_SCORES);
        } else {
          game.currentRound += 1;
          game.setAllPlayerState(PLAYER_STATE.WAITING);
          game.setGameState(GAME_STATE.DEALING_CARDS_TO_PLAYERS);
          setRemainingRoundsTitle();
        }
      } else {
        game.playersPickupHandFromTable();
        game.setAllPlayerState(PLAYER_STATE.PUT_DOWN_HAND);
        game.setGameState(GAME_STATE.PLAYERS_PUT_DOWN_HAND);
      }
      break;
    case GAME_STATE.PLAYERS_PUT_DOWN_HAND:
      game.setAllPlayerState(PLAYER_STATE.PICKUP_HAND);
      game.setGameState(GAME_STATE.PLAYERS_PICKUP_HAND);
      break;
    case GAME_STATE.PLAYERS_PICKUP_HAND:
      game.setAllPlayerState(PLAYER_STATE.CHOOSING_CARD);
      game.setGameState(GAME_STATE.PLAYERS_CHOOSE_CARD);
      break;
    default:
      break;
  }

  ctx.clearRect(0, 0, canvas.element.width, canvas.element.height);

  game.paint();

  window.requestAnimFrame(loop);
}

window.onload = function setupWindow() {
  setup();
  window.requestAnimFrame(loop);
};

window.onresize = resizeCanvas;
