const { CANVAS_DIMENSIONS } = require('../shared/constants.js');

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = CANVAS_DIMENSIONS.width;
canvas.height = CANVAS_DIMENSIONS.height;

module.exports = {
  canvas,
  ctx,
};
