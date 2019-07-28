import { getCurrentState, updatePlayerState } from './state';
import { CARD_STATE, CARD_SIZE, CARD_MARGIN } from '../shared/constants';

const { validateCard } = require('./networking');
const { canvas } = require('./canvasHandler');

function isOnCard(card, x, y) {
  return (x > card.x && x < card.x + CARD_SIZE.width)
    && (y > card.y && y < card.y + CARD_SIZE.height);
}

function onMouseMove(event) {
  const x = event.pageX - canvas.offsetLeft;
  const y = event.pageY - canvas.offsetTop;

  const { player } = getCurrentState();

  // Collision detection between the canvas and the element that the mouse hovers.
  player.cards.forEach((card) => {
    if (isOnCard(card, x, y) && card.state !== CARD_STATE.BEING_CHOSEN) {
      card.state = CARD_STATE.HOVERED_OVER;
    } else {
      card.state = CARD_STATE.IN_HAND;
    }
  });
}

function onMouseClick(event) {
  const x = event.pageX - canvas.offsetLeft;
  const y = event.pageY - canvas.offsetTop;

  const { player } = getCurrentState();

  // Collision detection between the canvas and the element that the mouse hovers.
  player.cards.forEach((card) => {
    if (isOnCard(card, x, y) && card.state !== CARD_STATE.BEING_CHOSEN) {
      card.state = CARD_STATE.BEING_CHOSEN;
      card.destY = card.y + CARD_SIZE.height + CARD_MARGIN.y;
      card.destX = card.x + player.chosenCards.length * (CARD_SIZE.height + CARD_MARGIN.x);
      updatePlayerState(player);
    }
  });
}

function onTouchStart(event) {
  const touch = event.touches[0];
  handleInput(touch.clientX, touch.clientY);
}

export function startCapturingInput() {
  // Add event listener for `mousemove` event.
  canvas.addEventListener('mousemove', onMouseMove, false);
  canvas.addEventListener('click', onMouseClick, false);
  canvas.addEventListener('touchstart', onTouchStart, false);
}

export function stopCapturingInput() {
  canvas.removeEventListener('mousemove', onMouseMove, false);
  canvas.removeEventListener('click', onMouseClick, false);
  canvas.removeEventListener('touchStart', onTouchStart, false);
}
