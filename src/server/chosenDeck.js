
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

module.exports = ChosenDeck;
