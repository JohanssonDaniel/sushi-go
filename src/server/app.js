const express = require('express');
// const path = require('path');
// const cookieParser = require('cookie-parser');
const logger = require('morgan');

// webpack
const webpack = require('webpack');
const webpackDevMiddleWare = require('webpack-dev-middleware');

// socketio
const socketio = require('socket.io');

// local imports
const webpackCfg = require('../../webpack.dev.js');
const Constants = require('../shared/constants');
const Game = require('./game.js');
// const indexRouter = require('./routes/index');
// const usersRouter = require('./routes/users');

const game = new Game();

function joinGame(playerName) {
  console.log(`Player joined: ${playerName}`);
  game.addPlayer(this, playerName);
}

function handleInput(card) {
  console.log(`handleInput: ${card}`);
  game.handleInput(this, card);
}

// function handleCardValidation(card) {
//   console.log(`validating card: ${card}`);
//   game.validateCard(this, card);
// }

function handleClientUpdate(update) {
  console.log('Handle client update');
  game.handlePlayerUpdate(this, update);
}

function handleCardWasChosen(card) {
  console.log(`validatin card choice: ${card}`);
  game.validateChardChoice(this, card);
}

function onDisconnect(playerName) {
  console.log(`onDisconnect(${playerName})`);
  game.removePlayer(this);
}


const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(express.static('public'));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

if (process.env.NODE_ENV === 'development') {
  const compiler = webpack(webpackCfg);
  app.use(webpackDevMiddleWare(compiler));
} else {
  app.use(express.static('dist'));
}

// module.exports = app;

const port = process.env.PORT || 3000;
const server = app.listen(port);
console.log(`Server listening on port ${port}`);

const io = socketio(server);

io.on('connection', (socket) => {
  console.log(`Player connected ${socket.id}`);
  socket.on(Constants.MSG_TYPES.JOIN_GAME, joinGame);
  socket.on(Constants.MSG_TYPES.INPUT, handleInput);
  // socket.on(Constants.MSG_TYPES.VALIDATE_CARD, handleCardValidation);
  socket.on(Constants.MSG_TYPES.CLIENT_UPDATE, handleClientUpdate);
  socket.on(Constants.MSG_TYPES.CARD_CHOSEN, handleCardWasChosen);
  socket.on('disconnect', onDisconnect);
});
