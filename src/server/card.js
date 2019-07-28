const shortid = require('shortid');
const { CARD_STATE } = require('../shared/constants.js');

class Card {
  constructor(name, filename) {
    this.id = shortid();
    this.name = name;
    this.filename = filename;
    this.state = CARD_STATE.IN_DECK;
    this.x = 0;
    this.y = 0;
    this.destX = 0;
    this.destY = 0;
    this.beingChosen = false;
  }

  serialize() {
    return {
      id: this.id,
      name: this.name,
      filename: this.filename,
      state: this.state,
      x: this.x,
      y: this.y,
      destX: this.destX,
      destY: this.destY,
    };
  }
}

module.exports = Card;
