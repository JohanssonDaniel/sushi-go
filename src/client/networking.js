import io from 'socket.io-client';
// import { processGameUpdate } from './state';

const Constants = require('../shared/constants');

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
    // socket.on(Constants.MSG_TYPES.GAME_UPDATE, processGameUpdate);
    socket.on(Constants.MSG_TYPES.GAME_OVER, onGameOver);
  })
);

export const join = (username) => {
  socket.emit(Constants.MSG_TYPES.JOIN_GAME, username);
};

// export const updateDirection = (direction) => {
//   socket.emit(Constants.MSG_TYPES.INPUT, direction);
// };
