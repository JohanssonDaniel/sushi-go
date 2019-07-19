/* eslint-disable no-underscore-dangle */
const PLAYER_COUNT = 2;
const PLAYER_NAMES = ['Danne', 'Nany'];

// const TOTAL_CARDS = 108;
const TOTAL_ROUNDS = 3;

const IMG_PATH = 'dist/static/img/';

const IMG_NAMES = {
  back: 'sushigo_back.png',
  tempura: 'sushigo_tempura.png',
  sashimi: 'sushigo_sashimi.png',
  dumpling: 'sushigo_dumpling.png',
  maki: 'sushigo_maki_1.png',
  salmon_nigiri: 'sushigo_nigiri_salmon.png',
  squid_nigiri: 'sushigo_nigiri_squid.png',
  egg_nigiri: 'sushigo_nigiri_egg.png',
  pudding: 'sushigo_pudding.png',
  wasabi: 'sushigo_wasabi.png',
  chopsticks: 'sushigo_chopsticks.png',
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
  MOVING_TO_TABLE: 'is_moving_to_table',
  ON_THE_TABLE: 'is_on_the_table',
  HOVERED_OVER: 'is_hovered_over',
  BEING_CHOSEN: 'is_being_chosen',
  WAITING_TO_BE_REVEALED: 'is_waiting_to_be_revealed',
  BEING_REVEALED: 'is_being_revealed',
};

const GAME_STATE = {
  STARTING_GAME: 'starting_game',
  DEALING_CARDS_TO_PLAYERS: 'dealing_cards_to_players',
  PLAYERS_CHOOSE_CARD: 'players_choose_card',
  PLAYERS_REVEAL_CARD: 'players_reveal_card',
  PLAYERS_PUT_DOWN_HAND: 'players_put_down_hand',
  PLAYERS_PICKUP_HAND: 'players_pickup_hand',
  END_OF_TURN: 'is_end_of_turn',
  CALCULATING_SCORES: 'calculating_scores',
};

const CARD_UPDATE_DIRECTION = [1, -1, 0, 0];

const PLAYER_POSITIONS = [
  { x: 0, y: 0 }, // First
  { x: 0, y: CARD_SIZE.height * 3 + CARD_MARGINS.y }, // Second
  null,
  null,
];

const DECK_POSITION = {
  x: 1200,
  y: 200,
};

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

class ChosenDeck {
  constructor() {
    this.cards = [];
    this.makiPosition = -1;
    this.eggPosition = -1;
    this.squidPosition = -1;
    this.salmonPosition = -1;
    this.puddingPosition = -1;
    this.tempuraPosition = -1;
    this.sashimiPosition = -1;
    this.dumplingPosition = -1;
    this.wasabiPosition = -1;
    this.wasabiAvailable = false;
  }

  addCardToDeck(card) {
    const position = { x: null, y: null };
    // Adds the card in the correct position in the deck
    if (card.name === 'Maki') {
      if (this.makiPosition === -1) {
        this.cards.push([card]);
        this.makiPosition = this.cards.length - 1;
      } else {
        this.cards[this.makiPosition].push(card);
      }
      position.x = this.makiPosition;
      position.y = this.cards[this.makiPosition].length - 1;
    } else if (card.name === 'Dumpling') {
      if (this.dumplingPosition === -1) {
        this.cards.push([card]);
        this.dumplingPosition = this.cards.length - 1;
      } else {
        this.cards[this.dumplingPosition].push(card);
      }
      position.x = this.dumplingPosition;
      position.y = this.cards[this.dumplingPosition].length - 1;
    } else if (card.name === 'Pudding') {
      if (this.puddingPosition === -1) {
        this.cards.push([card]);
        this.puddingPosition = this.cards.length - 1;
      } else {
        this.cards[this.puddingPosition].push(card);
      }
      position.x = this.puddingPosition;
      position.y = this.cards[this.puddingPosition].length - 1;
    } else if (card.name === 'Sashimi') {
      if (this.sashimiPosition === -1) {
        this.cards.push([card]);
        this.sashimiPosition = this.cards.length - 1;
      } else {
        this.cards[this.sashimiPosition].push(card);
      }
      position.x = this.sashimiPosition;
      position.y = this.cards[this.sashimiPosition].length - 1;
    } else if (card.name === 'Tempura') {
      if (this.tempuraPosition === -1) {
        this.cards.push([card]);
        this.tempuraPosition = this.cards.length - 1;
      } else {
        this.cards[this.tempuraPosition].push(card);
      }
      position.x = this.tempuraPosition;
      position.y = this.cards[this.tempuraPosition].length - 1;
    } else if (card.name === 'Wasabi') {
      this.cards.push([card]);
      this.wasabiPosition = this.cards.length - 1;
      this.wasabiAvailable = true;
      position.x = this.wasabiPosition;
      position.y = this.cards[this.wasabiPosition].length - 1;
    } else if (this.wasabiAvailable === true
      && (['Salmon Nigiri', 'Squid Nigiri', 'Egg Nigiri'].indexOf(card.name) !== -1)) {
      this.cards[this.wasabiPosition].push(card);
      position.x = this.wasabiPosition;
      position.y = this.cards[this.wasabiPosition].length - 1;
      this.wasabiPosition = -1;
      this.wasabiAvailable = false;
    } else if (card.name === 'Salmon Nigiri') {
      if (this.salmonPosition === -1) {
        this.cards.push([card]);
        this.salmonPosition = this.cards.length - 1;
      } else {
        this.cards[this.salmonPosition].push(card);
      }
      position.x = this.salmonPosition;
      position.y = this.cards[this.salmonPosition].length - 1;
    } else if (card.name === 'Squid Nigiri') {
      if (this.squidPosition === -1) {
        this.cards.push([card]);
        this.squidPosition = this.cards.length - 1;
      } else {
        this.cards[this.squidPosition].push(card);
      }
      position.x = this.squidPosition;
      position.y = this.cards[this.squidPosition].length - 1;
    } else if (card.name === 'Egg Nigiri') {
      if (this.eggPosition === -1) {
        this.cards.push([card]);
        this.eggPosition = this.cards.length - 1;
      } else {
        this.cards[this.eggPosition].push(card);
      }
      position.x = this.eggPosition;
      position.y = this.cards[this.eggPosition].length - 1;
    } else {
      this.cards.push([card]);
      position.x = this.cards.length - 1;
      position.y = 0;
    }
    return position;
  }

  paint() {
    for (let i = 0; i < this.cards.length; i += 1) {
      const cards = this.cards[i];
      for (let j = 0; j < cards.length; j += 1) {
        cards[j].paint();
      }
    }
  }
}

// define Player constructor
class Player {
  constructor(name = 'Default', hand = [], position, updateDirection) {
    this.name = name;
    this.hand = hand;
    this.chosenDeck = new ChosenDeck();
    this.x = position.x;
    this.y = position.y;
    this.updateDirection = updateDirection;
    this.currentState = PLAYER_STATE.WAITING;
    this.currentScore = 0;
    this.currentMakiCount = 0;
    this.currentPuddingCount = 0;
    this.currentlyChosenCard = null;
  }

  addCardToHand(card) {
    card.x = this.x + this.hand.length * (CARD_SIZE.width + CARD_MARGINS.x);
    card.y = this.y + CARD_MARGINS.y;
    card.currentState = CARD_STATE.IN_HAND;
    this.hand.push(card);
  }

  chooseCard(cardIndex) {
    const card = this.hand.splice(cardIndex, 1)[0];

    card.currentState = CARD_STATE.BEING_CHOSEN;
    const newCardPosition = this.chosenDeck.addCardToDeck(card);
    // Calculate dx and dy
    let dx;
    const dy = 10;
    const x1 = card.x;
    const y1 = card.y;
    const x2 = this.x + newCardPosition.x * (CARD_SIZE.width + CARD_MARGINS.x);
    const y2 = this.y + this.updateDirection * (CARD_SIZE.height + CARD_MARGINS.y);
    if (x1 > x2) {
      dx = -Math.abs(dy * ((x2 - x1) / (y2 - y1)));
    } else if (x1 < x2) {
      dx = Math.abs(dy * ((x2 - x1) / (y2 - y1)));
    } else {
      dx = 0;
    }
    card.dx = dx;
    card.dy = this.updateDirection * 10;
    card.x2 = x2;
    card.y2 = y2 - this.updateDirection * newCardPosition.y * dy;
    // this.chosenCards.push(card);

    this.currentState = PLAYER_STATE.HAS_CHOSEN_CARD;
    this.currentlyChosenCard = card;
    // console.log(`${this.name} has picked ${card.name}`);
  }

  putHandOnTable() {
    this.hand.forEach((card) => {
      card.currentState = CARD_STATE.MOVING_TO_TABLE;

      // Calculate dx and dy
      const x1 = card.x;
      const x2 = DECK_POSITION.x - CARD_SIZE.width;
      const y2 = DECK_POSITION.y + this.updateDirection * CARD_SIZE.height;

    card.y2 = y2;
      card.dy = this.updateDirection * 20;

    card.x2 = x2;
    if (x1 > x2) {
      card.dx = -Math.abs(card.dy * ((card.x2 - card.x) / (card.y2 - card.y)));
    } else if (x1 < x2) {
      card.dx = Math.abs(card.dy * ((card.x2 - card.x) / (card.y2 - card.y)));
    } else {
      card.dx = 0;
    }
    });
    const table = this.hand;
    this.hand = [];
    return table;
  }

  printPlayer() {
    console.log(`${this.name} has the hand: `);
    this.hand.forEach((card) => {
      console.log(`\t ${card.name}`);
    });
    console.log('And has revealed: ');
    this.chosenDeck.forEach((card) => {
      console.log(`\t ${card.name}`);
    });
  }

  paint() {
    this.hand.forEach((card) => {
      card.paint();
    });
    this.chosenDeck.paint();
  }
}

class Card {
  constructor(name = 'DefaultCard', color = 'black') {
    this.name = name;
    this.color = color;
    this.x = DECK_POSITION.x;
    this.y = DECK_POSITION.y;
    this.x2 = 0;
    this.y2 = 0;
    this.dx = 0;
    this.dy = 0;
    this.currentState = CARD_STATE.IN_DECK;
    this.beingChosen = false;
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

  paint() {
    // Add shadow to image
    ctx.shadowColor = 'gray';
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;

    switch (this.currentState) {
      case CARD_STATE.IN_DECK:
        ctx.shadowBlur = 1;
        ctx.drawImage(IMAGES.back, 0, 0,
          IMAGE_SIZE.width, IMAGE_SIZE.height, this.x,
          this.y, CARD_SIZE.width, CARD_SIZE.height);
        break;
      case CARD_STATE.IN_HAND:
        ctx.drawImage(this.img, 0, 0,
          IMAGE_SIZE.width, IMAGE_SIZE.height, this.x,
          this.y, CARD_SIZE.width, CARD_SIZE.height);
        break;
      case CARD_STATE.HOVERED_OVER:
        ctx.drawImage(this.img, 0, 0,
          IMAGE_SIZE.width, IMAGE_SIZE.height, this.x,
          this.y - CARD_MARGINS.y, CARD_SIZE.width, CARD_SIZE.height);
        break;
      case CARD_STATE.BEING_CHOSEN:
        if (this.y === this.y2
          || (this.dy < 0 && this.y < this.y2)
          || (this.dy > 0 && this.y > this.y2)) {
          this.x = this.x2;
          this.currentState = CARD_STATE.WAITING_TO_BE_REVEALED;
        } else {
          this.x += this.dx;
          this.y += this.dy;
        }
        ctx.drawImage(IMAGES.back, 0, 0,
          IMAGE_SIZE.width, IMAGE_SIZE.height, this.x,
          this.y, CARD_SIZE.width, CARD_SIZE.height);
        break;
      case CARD_STATE.WAITING_TO_BE_REVEALED:
        ctx.drawImage(IMAGES.back, 0, 0,
          IMAGE_SIZE.width, IMAGE_SIZE.height, this.x,
          this.y, CARD_SIZE.width, CARD_SIZE.height);
        break;
      case CARD_STATE.BEING_REVEALED:
        ctx.drawImage(this.img, 0, 0,
          IMAGE_SIZE.width, IMAGE_SIZE.height, this.x,
          this.y, CARD_SIZE.width, CARD_SIZE.height);
        break;
      case CARD_STATE.MOVING_TO_TABLE:
        if (this.y === this.y2
              || (this.dy < 0 && this.y < this.y2)
              || (this.dy > 0 && this.y > this.y2)) {
          this.currentState = CARD_STATE.ON_THE_TABLE;
          this.x = this.x2;
          this.x2 = 0;
          this.dx = 0;
          this.dy = 0;
        } else {
          this.x += this.dx;
          this.y += this.dy;
        }
        ctx.drawImage(IMAGES.back, 0, 0,
          IMAGE_SIZE.width, IMAGE_SIZE.height, this.x,
          this.y, CARD_SIZE.width, CARD_SIZE.height);
        break;
      case CARD_STATE.ON_THE_TABLE:
        ctx.drawImage(IMAGES.back, 0, 0,
          IMAGE_SIZE.width, IMAGE_SIZE.height, this.x,
          this.y, CARD_SIZE.width, CARD_SIZE.height);
        break;
      default:
        break;
    }
  }

  print() {
    console.log(this.name, this._x, this._y);
  }
}

class Game {
  constructor(startRound = 1, startState = GAME_STATE.STARTING_GAME,
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
      this.players.push(new Player(name, [], PLAYER_POSITIONS[i], CARD_UPDATE_DIRECTION[i]));
    });
  }

  setupHandsOnTable() {
    this.handsOnTable = [];
    this.players.forEach(() => {
      this.handsOnTable.push([]);
    });

    this.players.forEach((player) => {
      player.chosenCards = [];
    });
  }

  dealOneHand() {
    // Deal cards
    for (let noCards = this.cardsPerRound; noCards > 0; noCards -= 1) {
      for (let playerNum = 0; playerNum < PLAYER_COUNT; playerNum += 1) {
        this.players[playerNum].addCardToHand(this.deck.shift());
      }
    }
    this.remainingCards = this.cardsPerRound;
  }

  setGameState(state) {
    this.currentState = state;
  }

  setAllPlayerState(state) {
    this.players.forEach((player) => {
      player.currentState = state;
    });
  }

  playerPutHandOnTable(hand, playerIDX) {
    // TODO: Use modulo instead
    const nextPlayerIDX = (playerIDX === this.players.length - 1) ? 0 : playerIDX + 1;
    this.handsOnTable[nextPlayerIDX] = hand;
  }

  playersPickupCardsFromTable() {
    this.players.forEach((player, i) => {
      this.handsOnTable[i].forEach((card) => {
        player.addCardToHand(card);
      });
    });
  }

  allPlayersRevealChosenCards() {
    this.players.forEach((player) => {
      player.currentlyChosenCard.currentState = CARD_STATE.BEING_REVEALED;
    });
  }

  paint() {
    this.players.forEach((player) => {
      player.paint();
    });
    this.deck.forEach((card) => {
      card.paint();
    });
    this.handsOnTable.forEach((hand) => {
      hand.forEach((card) => {
        card.paint();
      });
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

  player.chosenDeck.cards.forEach((cards) => {
    const card = cards[0];
    if (card.name === 'Tempura') {
      score += calculateTempuraScore(cards.length);
    } else if (card.name === 'Dumpling') {
      score += calculateDumplingScore(cards.length);
    } else if (card.name === 'Sashimi') {
      score += calculateSashimiScore(cards.length);
    } else if (card.name === 'Maki') {
      makiCount = cards.length;
    } else if (card.name === 'Pudding') {
      puddingCount = cards.length;
    } else if (card.name === 'Salmon Nigiri') {
      score += 3 * (cards.length);
    } else if (card.name === 'Squid Nigiri') {
      score += 2 * (cards.length);
    } else if (card.name === 'Egg Nigiri') {
      score += 1 * (cards.length);
    } else if (card.name === 'Wasabi' && cards.length === 2) {
      if (cards[1].name === 'Salmon Nigiri') {
        score += 9;
      } else if (cards[1].name === 'Squid Nigiri') {
        score += 6;
      } else if (cards[1].name === 'Egg Nigiri') {
        score += 3;
      }
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
  canvas.element.width = 1400;
  canvas.element.height = 610;
}

function setupCanvas() {
  canvas.element = document.getElementById('canvas');
  canvas.offsetX = canvas.element.offsetLeft;
  canvas.offsetY = canvas.element.offsetTop;

  ctx = canvas.element.getContext('2d');
  resizeCanvas();

  function coordInCard(card, x, y) {
    return (x > card.x && x < card.x + CARD_SIZE.width)
    && (y > card.y && y < card.y + CARD_SIZE.height);
  }

  // Add event listener for `mousemove` event.
  canvas.element.addEventListener('mousemove', (event) => {
    const x = event.pageX - canvas.offsetX;
    const y = event.pageY - canvas.offsetY;

    // Collision detection between the canvas and the element that the mouse hovers.
    game.players.forEach((player) => {
      if (player.currentState === PLAYER_STATE.CHOOSING_CARD) {
        for (let i = 0; i < player.hand.length; i += 1) {
          const card = player.hand[i];
          if (coordInCard(card, x, y) && card.currentState !== CARD_STATE.BEING_CHOSEN) {
            card.currentState = CARD_STATE.HOVERED_OVER;
          } else {
            card.currentState = CARD_STATE.IN_HAND;
          }
        }
      }
    });
  }, false);

  // Add event listener for `click` events.
  canvas.element.addEventListener('click', (event) => {
    const x = event.pageX - canvas.offsetX;
    const y = event.pageY - canvas.offsetY;

    // Collision detection between clicked offset and element.
    game.players.forEach((player, i) => {
      if (player.currentState === PLAYER_STATE.CHOOSING_CARD) {
        player.hand.forEach((card, j) => {
          if (coordInCard(card, x, y)) {
            player.chooseCard(j);
            const hand = player.putHandOnTable();
            game.playerPutHandOnTable(hand, i);
        }
        });
      }
    });
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

function allChosenCardsWaitingToBeRevealead() {
  return game.players.every((player) => {
    return player.currentlyChosenCard.currentState === CARD_STATE.WAITING_TO_BE_REVEALED;
  });
}

function allPlayersHaveChosen() {
  return game.players.every((player) => {
    return player.currentState === PLAYER_STATE.HAS_CHOSEN_CARD;
  });
}

function allPlayerCardsOnTable() {
  return game.handsOnTable.every((hand) => {
    return hand.every((card) => {
      return card.currentState === CARD_STATE.ON_THE_TABLE;
    });
  });
}

let startTime = -1;
const ANIMATION_LENGTH = 300; // Animation length in milliseconds

function displayRevealCardText(timestamp) {
  if (startTime < 0) {
    startTime = timestamp;
    return false;
  }

  const progress = timestamp - startTime;

  ctx.font = '40px Arial';

  if (progress < ANIMATION_LENGTH) {
    ctx.fillText('1', canvas.element.width / 2, canvas.element.height / 2);
    return false;
  }
  if (progress < 2 * ANIMATION_LENGTH) {
    ctx.fillText('1 2', canvas.element.width / 2, canvas.element.height / 2);
    return false;
  }
  if (progress < 3 * ANIMATION_LENGTH) {
    ctx.fillText('1 2 3!', canvas.element.width / 2, canvas.element.height / 2);
    return false;
  }
  startTime = -1;
  return true;
}

function loop() {
  ctx.clearRect(0, 0, canvas.element.width, canvas.element.height);
  switch (game.currentState) {
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
        game.setAllPlayerState(PLAYER_STATE.PUT_DOWN_HAND);
        game.setGameState(GAME_STATE.PLAYERS_PUT_DOWN_HAND);
      }
      break;
    case GAME_STATE.PLAYERS_PUT_DOWN_HAND:
      if (allChosenCardsWaitingToBeRevealead()) {
        game.remainingCards -= 1;
        game.setAllPlayerState(PLAYER_STATE.REVEAL_CARD);
      game.setGameState(GAME_STATE.PLAYERS_REVEAL_CARD);
      setRemainingCardsTitle();
      }
      break;
    case GAME_STATE.PLAYERS_REVEAL_CARD:
      if (displayRevealCardText(Date.now())) {
        game.setAllPlayerState(PLAYER_STATE.WAITING);
        game.setGameState(GAME_STATE.END_OF_TURN);
      }
      break;
    case GAME_STATE.END_OF_TURN:
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
        game.allPlayersRevealChosenCards();
        game.setAllPlayerState(PLAYER_STATE.PICKUP_HAND);
        game.setGameState(GAME_STATE.PLAYERS_PICKUP_HAND);
      }
      break;
    case GAME_STATE.PLAYERS_PICKUP_HAND:
      if (allPlayerCardsOnTable()) {
      game.playersPickupCardsFromTable();
      game.setAllPlayerState(PLAYER_STATE.CHOOSING_CARD);
      game.setGameState(GAME_STATE.PLAYERS_CHOOSE_CARD);
      }
      break;
    default:
      console.log(`Unknown state: ${game.currentGameState}`);
      break;
  }

  game.paint();

  window.requestAnimFrame(loop);
}

window.onload = function setupWindow() {
  setup();
  window.requestAnimFrame(loop);
};

window.onresize = resizeCanvas;
