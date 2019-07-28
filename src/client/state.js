const { sendClientUpdate } = require('./networking');

let gameState = null;
let firstServerTimeStamp = 0;

export function initState() {
  firstServerTimeStamp = 0;
}

export function processGameUpdate(update) {
  if (!firstServerTimeStamp) {
    firstServerTimeStamp = update.t;
  }
  gameState = update;
}

export function getCurrentState() {
  if (!firstServerTimeStamp) {
    return null;
  }
  return gameState;
  // const base = getBaseUpdate();
  // const serverTime = currentServerTime();

  // if ((base < 0) || (base === gameUpdates.length - 1)) {
  //   return gameUpdates[gameUpdates.length - 1];
  // }

  // const baseUpdate = gameUpdates[base];
  // const nextUpdate = gameUpdates[base + 1];
  // const timeRatio = (serverTime - baseUpdate.t) / (nextUpdate.t - baseUpdate.t);
  // return {
  //   cards: interPolateObjectArray(baseUpdate, nextUpdate, timeRatio)
  // };
}

export function updatePlayerState(update) {
  gameState.player = update;
  sendClientUpdate(gameState);
}
