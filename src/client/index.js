import { connect, join } from './networking';
import { startRendering } from './render';
import { downloadAssets } from './assets';
import './canvasHandler';
import { startCapturingInput } from './input';
// import './css/style.css';

// // let ctx;

// const canvas = {
//   element: null,
//   offsetX: 0,
//   offsetY: 0,
// };

// const windowSettings = {
//   width: window.innerWidth,
//   height: window.innerHeight,
// };

// window.requestAnimFrame = window.requestAnimationFrame
//   || window.webkitRequestAnimationFrame
//   || window.mozRequestAnimationFrame
//   || function setTimeOutCallback(callback) {
//     window.setTimeout(callback, 1000 / 60);
//   };

// function calculateTempuraScore(tempuraCount) {
//   if (tempuraCount > 0) {
//     let score = 0;
//     let count = tempuraCount;
//     while (count % 2 === 0) {
//       count /= 2;
//       score += 5;
//     }
//     return score;
//   }
//   return 0;
// }

// function calculateSashimiScore(sashimiCount) {
//   if (sashimiCount > 0) {
//     let score = 0;
//     let count = sashimiCount;
//     while (count % 3 === 0) {
//       count /= 3;
//       score += 10;
//     }
//     return score;
//   }
//   return 0;
// }

// function calculateDumplingScore(dumplingCount) {
//   const dumplingScores = [1, 3, 6, 10, 15];
//   if (dumplingCount > 0) {
//     if (dumplingCount < dumplingScores.length) {
//       return dumplingScores[dumplingCount];
//     }
//     return dumplingScores[dumplingScores.length - 1]; // Maximum value
//   }
//   return 0;
// }

// function calculatePlayerScore(player) {
//   let score = 0;
//   let makiCount = 0;
//   let puddingCount = 0;

//   player.chosenDeck.cards.forEach((cards) => {
//     const card = cards[0];
//     if (card.name === 'Tempura') {
//       score += calculateTempuraScore(cards.length);
//     } else if (card.name === 'Dumpling') {
//       score += calculateDumplingScore(cards.length);
//     } else if (card.name === 'Sashimi') {
//       score += calculateSashimiScore(cards.length);
//     } else if (card.name === 'Maki') {
//       makiCount = cards.length;
//     } else if (card.name === 'Pudding') {
//       puddingCount = cards.length;
//     } else if (card.name === 'Salmon Nigiri') {
//       score += 3 * (cards.length);
//     } else if (card.name === 'Squid Nigiri') {
//       score += 2 * (cards.length);
//     } else if (card.name === 'Egg Nigiri') {
//       score += 1 * (cards.length);
//     } else if (card.name === 'Wasabi' && cards.length === 2) {
//       if (cards[1].name === 'Salmon Nigiri') {
//         score += 9;
//       } else if (cards[1].name === 'Squid Nigiri') {
//         score += 6;
//       } else if (cards[1].name === 'Egg Nigiri') {
//         score += 3;
//       }
//     } else {
//       console.log('Wrong card', card.name);
//     }
//   });

//   player.currentScore += score;
//   // TODO Calculate score between player maki count
//   player.currentMakiCount += makiCount;
//   player.currentPuddingCount += puddingCount;
// }

// function calculateAllPlayerScore() {
//   game.players.forEach((player) => {
//     calculatePlayerScore(player);
//   });
// }

// function resizeCanvas() {
//   windowSettings.width = window.innerWidth;
//   windowSettings.height = window.innerHeight;
//   canvas.element.width = 1400;
//   canvas.element.height = 610;
// }

// function setupCanvas() {
//   canvas.element = document.getElementById('canvas');
//   canvas.offsetX = canvas.element.offsetLeft;
//   canvas.offsetY = canvas.element.offsetTop;

//   ctx = canvas.element.getContext('2d');
//   resizeCanvas();

// function setRemainingCardsTitle() {
//   document.getElementById('cards-remaining')
//     .innerText = `Remaining Cards: ${game.remainingCards}`;
// }

// function setRemainingRoundsTitle() {
//   document.getElementById('rounds-remaining')
//     .innerText = `Remaining Rounds: ${game.remainingRounds}`;
// }

// function setPlayerScoreTitle() {
//   document.getElementById('player1-score')
//     .innerText = `Player 1 Score: ${game.players[0].currentScore}`;
//   document.getElementById('player2-score')
//     .innerText = `Player 2 Score: ${game.players[1].currentScore}`;
// }

// function setup() {
//   loadImages();

//   game = new Game();

//   setupCanvas();
//   game.setupDeck();
//   game.setupHandsOnTable();
//   game.setupPlayers();
//   game.shuffleDeck();
//   game.dealOneHand();
//   game.setAllPlayerState(PLAYER_STATE.CHOOSING_CARD);
//   game.setGameState(GAME_STATE.PLAYERS_CHOOSE_CARD);

//   setRemainingCardsTitle();
//   setRemainingRoundsTitle();
//   setPlayerScoreTitle();
// }

// function allChosenCardsWaitingToBeRevealead() {
//   return game.players.every((player) => {
//     return player.currentlyChosenCard.currentState === CARD_STATE.WAITING_TO_BE_REVEALED;
//   });
// }

// function allPlayersHaveChosen() {
//   return game.players.every((player) => {
//     return player.currentState === PLAYER_STATE.HAS_CHOSEN_CARD;
//   });
// }

// function allPlayerCardsOnTable() {
//   return game.handsOnTable.every((hand) => {
//     return hand.every((card) => {
//       return card.currentState === CARD_STATE.ON_THE_TABLE;
//     });
//   });
// }

// let startTime = -1;
// const ANIMATION_LENGTH = 300; // Animation length in milliseconds

// function displayRevealCardText(timestamp) {
//   if (startTime < 0) {
//     startTime = timestamp;
//     return false;
//   }

//   const progress = timestamp - startTime;

//   ctx.font = '40px Arial';

//   if (progress < ANIMATION_LENGTH) {
//     ctx.fillText('1', canvas.element.width / 2, canvas.element.height / 2);
//     return false;
//   }
//   if (progress < 2 * ANIMATION_LENGTH) {
//     ctx.fillText('1 2', canvas.element.width / 2, canvas.element.height / 2);
//     return false;
//   }
//   if (progress < 3 * ANIMATION_LENGTH) {
//     ctx.fillText('1 2 3!', canvas.element.width / 2, canvas.element.height / 2);
//     return false;
//   }
//   startTime = -1;
//   return true;
// }

// function loop() {
//   switch (game.currentState) {
//     case GAME_STATE.STARTING_GAME:
//       return;
//     case GAME_STATE.DEALING_CARDS_TO_PLAYERS:
//       game.setupHandsOnTable();
//       game.dealOneHand();
//       game.setAllPlayerState(PLAYER_STATE.CHOOSING_CARD);
//       game.setGameState(GAME_STATE.PLAYERS_CHOOSE_CARD);
//       setRemainingCardsTitle();
//       break;
//     case GAME_STATE.PLAYERS_CHOOSE_CARD:
//       if (allPlayersHaveChosen()) {
//         game.setAllPlayerState(PLAYER_STATE.PUT_DOWN_HAND);
//         game.setGameState(GAME_STATE.PLAYERS_PUT_DOWN_HAND);
//       }
//       break;
//     case GAME_STATE.PLAYERS_PUT_DOWN_HAND:
//       if (allChosenCardsWaitingToBeRevealead()) {
//         game.remainingCards -= 1;
//         setRemainingCardsTitle();
//         game.setAllPlayerState(PLAYER_STATE.REVEAL_CARD);
//         game.setGameState(GAME_STATE.PLAYERS_REVEAL_CARD);
//         setRemainingCardsTitle();
//       }
//       break;
//     case GAME_STATE.PLAYERS_REVEAL_CARD:
//       if (displayRevealCardText(Date.now())) {
//         game.setAllPlayerState(PLAYER_STATE.WAITING);
//         game.setGameState(GAME_STATE.END_OF_TURN);
//       }
//       break;
//     case GAME_STATE.END_OF_TURN:
//       game.playersRevealChosenCards();
//       if (game.remainingCards === 0) {
//         calculateAllPlayerScore();
//         setPlayerScoreTitle();
//         game.playersResetChosenDeck();
//         if (game.currentRound === TOTAL_ROUNDS) {
//           game.setAllPlayerState(PLAYER_STATE.WAITING);
//           game.setGameState(GAME_STATE.CALCULATING_SCORES);
//         } else {
//           game.currentRound += 1;
//           setRemainingRoundsTitle();
//           game.setAllPlayerState(PLAYER_STATE.WAITING);
//           game.setGameState(GAME_STATE.DEALING_CARDS_TO_PLAYERS);
//         }
//       } else {
//         game.setAllPlayerState(PLAYER_STATE.PICKUP_HAND);
//         game.setGameState(GAME_STATE.PLAYERS_PICKUP_HAND);
//       }
//       break;
//     case GAME_STATE.PLAYERS_PICKUP_HAND:
//       if (allPlayerCardsOnTable()) {
//         game.playersPickupCardsFromTable();
//         game.setAllPlayerState(PLAYER_STATE.CHOOSING_CARD);
//         game.setGameState(GAME_STATE.PLAYERS_CHOOSE_CARD);
//       }
//       break;
//     default:
//       console.log(`Unknown state: ${game.currentState}`);
//       break;
//   }

//   game.paint();

//   window.requestAnimFrame(loop);
// }

// window.onload = function setupWindow() {
//   setup();
//   window.requestAnimFrame(loop);
// };

// window.onresize = resizeCanvas;

Promise.all([
  connect(),
  downloadAssets(),
]).then(() => {
  join('danne');
  console.log('Connected!');
  startRendering();
  startCapturingInput();
});
