import io from 'socket.io-client';
import { processGameUpdate } from './state';

const { MSG_TYPES } = require('../shared/constants.js');

const socket = io(`ws://${window.location.host}`);
const connectedPromise = new Promise((resolve) => {
  socket.on('connect', () => {
    console.log('Connected to server!');
    resolve();
  });
});

export const connect = onGameOver => (
  connectedPromise.then(() => {
    // Register callbacks
    socket.on(MSG_TYPES.GAME_UPDATE, processGameUpdate);
    socket.on(MSG_TYPES.GAME_OVER, onGameOver);
    socket.on(MSG_TYPES.VALID_CARD, () => {
      console.log('Card is valid!');
    });
    socket.on(MSG_TYPES.INVALID_CARD, () => {
      console.log('Card is invalid!');
    });
  })
);

export const join = (username) => {
  socket.emit(MSG_TYPES.JOIN_GAME, username);
};

export function sendClientUpdate(state) {
  socket.emit(MSG_TYPES.CLIENT_UPDATE, state);
}

export const validateCard = (card) => {
  socket.emit(MSG_TYPES.VALIDATE_CARD, card);
};

export const cardWasChosen = (card) => {
  socket.emit(MSG_TYPES.CARD_CHOSEN, card);
};
