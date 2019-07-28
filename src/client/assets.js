const { IMG_NAMES } = require('../shared/constants.js');

const assets = {};

function downloadAsset(assetName) {
  console.log(`Downloading: ${assetName}`);
  return new Promise((resolve) => {
    const asset = new Image();
    asset.onload = (() => {
      console.log(`Downloaded ${assetName}`);
      assets[assetName] = asset;
      resolve();
    });
    asset.src = `/images/${assetName}`;
  });
}

const downloadPromise = Promise.all(IMG_NAMES.map(downloadAsset));

export const downloadAssets = () => downloadPromise;
export const getAsset = assetName => assets[assetName];
