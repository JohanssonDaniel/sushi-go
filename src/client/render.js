const { getAsset } = require('./assets.js');
const { getCurrentState } = require('./state');
const { IMAGE_SIZE, CARD_SIZE, CARD_MARGIN, CARD_STATE, CARD_UPDATE_SPEED } = require('../shared/constants.js');
const { canvas, ctx } = require('./canvasHandler.js');
const { chooseCard } = require('./networking');

function renderImage(img, x, y) {
  ctx.drawImage(
    img,
    0,
    0,
    IMAGE_SIZE.width,
    IMAGE_SIZE.height,
    x,
    y,
    CARD_SIZE.width,
    CARD_SIZE.height,
  );
}

function updateCardPosition(card) {
  const dy = CARD_UPDATE_SPEED;
  const dx = dy * ((card.destX - card.x) / (card.destY - card.y));
  if (card.y === card.destY
    || (dy < 0 && card.y < card.destY)
    || (dy > 0 && card.y > card.destY)) {
    console.log('Card reached destination');
    card.y = card.destY;
    card.x = card.destX;
    chooseCard(card);
  } else {
    card.y += dy;
    card.x += dx;
  }
}

function updateCard(card) {
  switch (card.state) {
    case CARD_STATE.BEING_CHOSEN:
      updateCardPosition(card);
      break;
    default:
      break;
  }
}

function renderCard(card) {
  const img = getAsset(card.filename);
  switch (card.state) {
    case CARD_STATE.IN_DECK:
      renderImage(getAsset('sushigo_back.png'), 0, 0);
      break;
    case CARD_STATE.IN_HAND:
      renderImage(img, card.x, card.y);
      break;
    case CARD_STATE.HOVERED_OVER:
      renderImage(img, card.x, card.y - 10);
      break;
    case CARD_STATE.BEING_CHOSEN:
      renderImage(getAsset('sushigo_back.png'), card.x, card.y);
      break;
    case CARD_STATE.WAITING_TO_BE_REVEALED:
      renderImage(getAsset('sushigo_back.png'), card.x, card.y);
      break;
    // case CARD_STATE.BEING_REVEALED:
    //   ctx.drawImage(this.img, 0, 0,
    //     IMAGE_SIZE.width, IMAGE_SIZE.height, this.x,
    //     this.y, CARD_SIZE.width, CARD_SIZE.height);
    //   break;
    // case CARD_STATE.MOVING_TO_TABLE:
    //   if (this.y === this.y2
    //     || (this.dy < 0 && this.y < this.y2)
    //     || (this.dy > 0 && this.y > this.y2)) {
    //     this.currentState = CARD_STATE.ON_THE_TABLE;
    //     this.x = this.x2;
    //     this.x2 = 0;
    //     this.dx = 0;
    //     this.dy = 0;
    //   } else {
    //     this.x += this.dx;
    //     this.y += this.dy;
    //   }
    //   ctx.drawImage(IMAGES.back, 0, 0,
    //     IMAGE_SIZE.width, IMAGE_SIZE.height, this.x,
    //     this.y, CARD_SIZE.width, CARD_SIZE.height);
    //   break;
    // case CARD_STATE.ON_THE_TABLE:
    //   ctx.drawImage(IMAGES.back, 0, 0,
    //     IMAGE_SIZE.width, IMAGE_SIZE.height, this.x,
    //     this.y, CARD_SIZE.width, CARD_SIZE.height);
    //   break;
    default:
      break;
  }
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function render() {
  clearCanvas();

  const { player } = getCurrentState();

  if (player) {
    player.cards.forEach((card) => {
      updateCard(card);
      renderCard(card);
    });
  }
}

let renderInterval = null;
export function startRendering() {
  console.log('Start rendering');
  renderInterval = setInterval(render, 1000 / 60);
}
export function stopRendering() {
  clearInterval(renderInterval);
}
