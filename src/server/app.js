const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// webpack
const webpack = require('webpack');
const webpackDevMiddleWare = require('webpack-dev-middleware');

// socketio
const socketio = require('socket.io');

// local imports
const webpackCfg = require('../../webpack.dev.js');
const Constants = require('../shared/constants');

// const indexRouter = require('./routes/index');
// const usersRouter = require('./routes/users');

function joinGame(playerName) {
  console.log(`joingGame(${playerName})`);
}

function onDisconnect(playerName) {
  console.log(`onDisconnect(${playerName})`);
}


const app = express();

// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

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
  socket.on('disconnect', onDisconnect);
});
