
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

const CARDS = [
  { name: 'Tempura', count: 14, color: 'black' },
  { name: 'Sashimi', count: 14, color: 'red' },
  { name: 'Dumpling', count: 14, color: 'blue' },
  { name: 'Maki', count: 26, color: 'green' },
  { name: 'Salmon Nigri', count: 10, color: 'yellow' },
  { name: 'Squid Nigri', count: 5, color: 'gray' },
  { name: 'Egg', count: 5, color: 'pink' },
  { name: 'Pudding', count: 10, color: 'orange' },
  { name: 'Wasabi', count: 6, color: 'lightblue' },
  { name: 'Chopsticks', count: 4, color: 'pink' },
];

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
  WAITING: "is_waiting",
  CHOOSING_CARD: "will_choose_card",
  HAS_CHOSEN_CARD: "has_chosen_card",
  REVEAL_CARD: "will_reveal_card",
  PUT_DOWN_HAND: "will_put_down_hand",
  PICKUP_HAND: "will_take_up_hand"
};

const GAME_STATE = {
  STARTING_GAME: "starting_game",
  DEALING_CARDS_TO_PLAYERS: "dealing_cards_to_players",
  PLAYERS_CHOOSE_CARD: "players_choose_card",
  PLAYERS_REVEAL_CARD: "players_reveal_card",
  PLAYERS_PUT_DOWN_HAND: "players_put_down_hand",
  PLAYERS_PICKUP_HAND: "players_pickup_hand",
  CALCULATING_SCORES: "calculating_scores"
};

let deck = [];
let players = [];
let handsOnTable = [];
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
    this.currentScore = 0
    this.currentMakiCount = 0
    this.currentPuddingCount = 0
  }

  addCardToHand(card) {
    this.hand.push(card)
    this.hand.forEach((card, i) => {
      card.x = this.x + i * CARD_SIZE.width * 2;
      card.y = this.y;
    })
  }

  pickupHand(hand) {
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

    this.currentState = PLAYER_STATE.HAS_CHOSEN_CARD;
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
  constructor(name = "DefaultCard", color='black', isPicked = false) {
    this.name = name
    this.color = color
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
      ctx.fillStyle = "darkgreen";
      ctx.stroke()
    } else {
      ctx.fillStyle = this.color;
    }
    ctx.fill();
  }

  print() {
    console.log(this.name, this._x, this._y)
  }

}

function calculateTempuraScore(tempuraCount) {
  score = 0
  while(tempuraCount % 2 == 0) {
    tempuraCount /= 2;
    score += 5;
  }
  return score
}

function calculateSashimiScore(sashimiCount) {
  score = 0
  while(sashimiCount % 3 == 0) {
    sashimiCount /= 3;
    score += 10;
  }
  return score
}

function calculateDumplingScore(dumplingCount) {
  dumplingScores = [1,3,6,10,15];
  if (dumplingCount > dumplingScores.length())
    return 15;
  else
    return dumplingScores[dumplingCount];
}

function calculatePlayerScore(player) {
  let score = 0;
  let makiCount = 0;
  let tempuraCount = 0;
  let sashimiCount = 0;
  let puddingCount = 0;
  let dumplingCount = 0;
  let hasWasabi = false;
  
  player.revealedCards.forEach(card => {
    if(card.name == 'Tempura') {
      tempuraCount++;
    }
    else if (card.name == 'Dumpling') {
      dumplingCount++;
    }
    else if (card.name == 'Sashimi') {
      sashimiCount++;
    }
    else if (card.name == 'Maki') {
      makiCount++;
    }
    else if (card.name == 'Pudding') {
      puddingCount++;
    }
    else if (card.name == 'Wasabi') {
      hasWasabi = true;
    }
    else if (card.name == 'Salmon Nigri') {
      if (hasWasabi) {
        hasWasabi = false;
        score += 3*3;
      }
      else {
        score += 3;
      }
    }
    else if (card.name == 'Squid Nigri') {
      if (hasWasabi) {
        hasWasabi = false;
        score += 3*2;
      }
      else {
        score += 2;
      }
    }
    else if (card.name == 'Egg Nigri') {
      if (hasWasabi) {
        hasWasabi = false;
        score += 3*1;
      }
      else {
        score += 1;
      }
    }
    else if (card.name == 'Chopsticks') {}
    else {
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
  players.forEach((player) => {
    calculatePlayerScore(player);
  })
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
        if(player.currentState == PLAYER_STATE.CHOOSING_CARD)
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
  for (const card of CARDS) {
    for (let i = 0; i < card.count; i++) {
      deck.push(new Card(card.name, card.color))
    }
  }
}

function setupHandsOnTable() {
  handsOnTable = []
  players.forEach(_ => {
    handsOnTable.push([]);
  })
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
  title.innerText = 'Remaining Cards: ' + remainingCards
}

function setRemainingRoundsTitle() {
  let title = document.getElementById('rounds-remaining');
  title.innerText = 'Remaining Rounds: ' + remainingRounds
}

function setPlayerScoreTitle() {
  let title1 = document.getElementById('player1-score');
  let title2 = document.getElementById('player2-score');
  title1.innerText = 'Player 1 Score: ' + players[0].currentScore;
  title2.innerText = 'Player 2 Score: ' + players[1].currentScore;
}
function setup() {
  setupCanvas();
  setupDeck();
  setupHandsOnTable();
  shuffleDeck();
  setupPlayers();
  dealOneHand();

  setRemainingCardsTitle();

  remainingRounds = TOTAL_ROUNDS
  setRemainingRoundsTitle();

  setPlayerScoreTitle();
  setAllPlayerState(PLAYER_STATE.CHOOSING_CARD);
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

function allPlayersHaveChosen() {
  return players.every((player) => {
    return player.currentState == PLAYER_STATE.HAS_CHOSEN_CARD
  });
}

function loop() {
  console.log(currentGameState)
  switch (currentGameState) {
    case GAME_STATE.STARTING_GAME:
      return;
    case GAME_STATE.DEALING_CARDS_TO_PLAYERS:
      dealOneHand();
      setAllPlayerState(PLAYER_STATE.CHOOSING_CARD)
      setGameState(GAME_STATE.PLAYERS_CHOOSE_CARD);
      break;
    case GAME_STATE.PLAYERS_CHOOSE_CARD:
      if (allPlayersHaveChosen()) {
        remainingCards -= 1
        setRemainingCardsTitle()
        setAllPlayerState(PLAYER_STATE.REVEAL_HAND);
        setGameState(GAME_STATE.PLAYERS_REVEAL_CARD);
      }
      break;
    case GAME_STATE.PLAYERS_REVEAL_CARD:
      if (remainingCards == 0) {
        if (currentRound == TOTAL_ROUNDS) {
          setAllPlayerState(PLAYER_STATE.WAITING)
          setGameState(GAME_STATE.CALCULATING_SCORES);
        } else {
          currentRound += 1;
          setAllPlayerState(PLAYER_STATE.WAITING)
          setGameState(GAME_STATE.DEALING_CARDS_TO_PLAYERS);
        }
      }
      else {
        setAllPlayerState(PLAYER_STATE.PUT_DOWN_HAND)
        setGameState(GAME_STATE.PLAYERS_PUT_DOWN_HAND);
      }
      break;
    case GAME_STATE.PLAYERS_PUT_DOWN_HAND:
      players.forEach((player, i) => {
        let playerHand = player.putHandOnTable();
        let nextPlayerIDX = i == players.length - 1 ? 0 : i + 1;
        handsOnTable[nextPlayerIDX] = playerHand;
      })
      setAllPlayerState(PLAYER_STATE.PICKUP_HAND)
      setGameState(GAME_STATE.PLAYERS_PICKUP_HAND);
      break;
    case GAME_STATE.PLAYERS_PICKUP_HAND:
      players.forEach((player, i) => {
        let hand = handsOnTable[i];
        player.pickupHand(hand);
      })
      setAllPlayerState(PLAYER_STATE.CHOOSING_CARD)
      setGameState(GAME_STATE.PLAYERS_CHOOSE_CARD);
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