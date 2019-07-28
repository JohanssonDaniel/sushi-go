const { CARD_STATE, CARD_SIZE, CARD_MARGIN } = require('../shared/constants.js');
const ChosenDeck = require('./chosenDeck.js');

class Player {
  constructor(name = 'Default') {
    this.name = name;
    this.cards = [];
    this.chosenCards = [];
    // this.x = 0;
    // this.y = 0;
    // this.updateDirection = 0;
    // this.currentState = PLAYER_STATE.WAITING;
    this.score = 0;
    this.makiCount = 0;
    this.puddingCount = 0;
    // this.currentlyChosenCard = null;
  }

  addCardToHand(card) {
    card.x = this.cards.length * (CARD_SIZE.width + CARD_MARGIN.x);
    card.y = 0;
    card.state = CARD_STATE.IN_HAND;
    this.cards.push(card);
  }

  chooseCard(card) {
    // card.currentState = CARD_STATE.BEING_CHOSEN;
    // const newCardPosition = this.chosenDeck.addCardToDeck(card);
    this.chosenDeck.addCardToDeck(card);
    // // Calculate dx and dy
    // let dx;
    // const dy = 10;
    // const x1 = card.x;
    // const y1 = card.y;
    // const x2 = this.x + newCardPosition.x * (CARD_SIZE.width + CARD_MARGINS.x);
    // const y2 = this.y + this.updateDirection * (CARD_SIZE.height + CARD_MARGINS.y);
    // if (x1 > x2) {
    //   dx = -Math.abs(dy * ((x2 - x1) / (y2 - y1)));
    // } else if (x1 < x2) {
    //   dx = Math.abs(dy * ((x2 - x1) / (y2 - y1)));
    // } else {
    //   dx = 0;
    // }
    // card.dx = dx;
    // card.dy = this.updateDirection * 10;
    // card.x2 = x2;
    // card.y2 = y2 - this.updateDirection * newCardPosition.y * dy;
    // this.chosenCards.push(card);

    // // this.currentState = PLAYER_STATE.HAS_CHOSEN_CARD;
    // this.currentlyChosenCard = card;
    // console.log(`${this.name} has picked ${card.name}`);
  }

  putHandOnTable() {
    /* this.hand.forEach((card) => {
      card.currentState = CARD_STATE.MOVING_TO_TABLE;

      Calculate dx and dy
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
    }); */
    const table = this.cards;
    this.cards = [];
    return table;
  }

  resetChosenDeck() {
    this.chosenDeck = new ChosenDeck();
  }

  serialize() {
    return {
      name: this.name,
      cards: this.cards.map(card => card.serialize()),
      chosenCards: this.chosenCards.map(card => card.serialize()),
    };
  }
}

module.exports = Player;
