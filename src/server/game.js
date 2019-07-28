const Constants = require('../shared/constants.js');
const Player = require('./player.js');
const Card = require('./card');

class Game {
  constructor(startRound = 1, startState = Constants.GAME_STATE.STARTING_GAME,
    totalRounds = Constants.TOTAL_ROUNDS, cardsPerRound = Constants.CARDS_PER_PLAYER['2']) {
    this.sockets = {};
    this.players = {};
    this.deck = [];
    this.handsOnTable = [];
    this.currentRound = startRound;
    this.currentState = startState;
    this.remainingRounds = totalRounds;
    this.cardsPerRound = cardsPerRound;
    this.remainingCards = cardsPerRound;
    this.shouldSendUpdate = false;
    this.setupDeck();
    this.shuffleDeck();
    setInterval(this.update.bind(this), 1000 / 60);
  }

  setupDeck() {
    this.deck = [];
    Constants.CARDS.forEach((card) => {
      for (let i = 0; i < card.count; i += 1) {
        this.deck.push(new Card(
          card.name, card.filename,
        ));
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

  addPlayer(socket, userName) {
    this.sockets[socket.id] = socket;
    this.players[socket.id] = new Player(
      userName,
    );
    this.dealOneHandToPlayer(this.players[socket.id]);
    this.shouldSendUpdate = true;
  }

  removePlayer(socket) {
    delete this.players[socket.id];
    delete this.sockets[socket.id];
    this.shouldSendUpdate = true;
  }

  setupHandsOnTable() {
    this.handsOnTable = [];
    this.players.forEach(() => {
      this.handsOnTable.push([]);
    });

    this.players.forEach((player) => {
      player.chosenCards = [];
    });
    this.shouldSendUpdate = true;
  }

  dealOneHand() {
    // Deal cards
    for (let noCards = this.cardsPerRound; noCards > 0; noCards -= 1) {
      this.players.forEach((player) => {
        player.addCardToHand(this.deck.shift());
      });
    }
    this.remainingCards = this.cardsPerRound;
    this.shouldSendUpdate = true;
  }

  dealOneHandToPlayer(player) {
    // Deal cards
    for (let noCards = this.cardsPerRound; noCards > 0; noCards -= 1) {
      player.addCardToHand(this.deck.shift());
    }
    this.shouldSendUpdate = true;
  }

  setGameState(state) {
    this.currentState = state;
  }

  // setAllPlayerState(state) {
  //   this.players.forEach((player) => {
  //     player.currentState = state;
  //   });
  // }

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

  /*   playersRevealChosenCards() {
    this.players.forEach((player) => {
      player.currentlyChosenCard.currentState = CARD_STATE.BEING_REVEALED;
    });
  }
 */
  playersResetChosenDeck() {
    this.players.forEach((player) => {
      player.resetChosenDeck();
    });
    this.shouldSendUpdate = true;
  }

  // createUpdate(player) {
  //   // const otherPlayers = Object.values(this.players).filter(other => player !== other);

  //   /* return {
  //     t: Date.now(),
  //     player: player.serialize,
  //     others: otherPlayers.map(p => { p.serialize() }),
  //   } */
  // }

  update() {
    if (this.shouldSendUpdate) {
      Object.keys(this.sockets).forEach((playerID) => {
        const socket = this.sockets[playerID];
        const player = this.players[playerID];

        socket.emit(
          Constants.MSG_TYPES.GAME_UPDATE,
          {
            t: Date.now(),
            player: player.serialize(),
          },
        );
      });
      this.shouldSendUpdate = false;
    }
  }

  // validateCard(socket, card) {
  //   const player = this.players[socket.id];
  //   const playerSocket = this.sockets[socket.id];
  //   const cardIDX = player.cards.findIndex(playerCard => playerCard.id === card.id);
  //   if (cardIDX >= 0) {
  //     playerSocket.emit(Constants.MSG_TYPES.VALID_CARD);
  //   } else {
  //     playerSocket.emit(Constants.MSG_TYPES.INVALID_CARD);
  //   }
  //   this.shouldSendUpdate = true;
  // }

  validateCardChoice(socket, card) {
    const player = this.players[socket.id];
    const playerSocket = this.sockets[socket.id];
    const cardIDX = player.cards.findIndex(playerCard => playerCard.id === card.id);
    if (cardIDX >= 0) {
      const chosenCard = player.cards.splice(cardIDX, 1)[0];
      chosenCard.state = Constants.CARD_STATE.WAITING_TO_BE_REVEALED;
      player.chosenCards.push(chosenCard);
      playerSocket.emit(Constants.MSG_TYPES.VALID_CARD);
    } else {
      playerSocket.emit(Constants.MSG_TYPES.INVALID_CARD);
    }
    this.shouldSendUpdate = true;
  }

  // handleInput(socket, x, y) {
  //   const player = this.players[socket.id];

  //   function intersect(x1, x2, y1, y2) {
  //     return (x1 > x2 && x1 < x2 + Constants.CARD_SIZE.width)
  //       && (y1 > y2 && y1 < y2 + Constants.CARD_SIZE.height);
  //   }

  //   player.cards.forEach((card) => {
  //     if (intersect(x, y, card.x, card.y)) {
  //       player.chooseCard(card);
  //     }
  //   });
  //   this.shouldSendUpdate = true;
  // }

  handlePlayerUpdate(socket, update) {
    this.players[socket.id] = update.player;
  }
}

module.exports = Game;
