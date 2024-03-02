self.Game.textures = {}

// player textures
self.Game.textures.player = {};
self.Game.textures.player.falling = [];
for (let i=0;i<2;i++) {
  let image = new Image();
  image.src = `./textures/player/falling/${i}.png`;
  self.Game.textures.player.falling.push(image);
}

self.Game.textures.player.rising = [];
for (let i=0;i<2;i++) {
  let image = new Image();
  image.src = `./textures/player/rising/${i}.png`;
  self.Game.textures.player.rising.push(image);
}

self.Game.textures.player.walk = [];
for (let i=0;i<8;i++) { // < 8 instead of < 4 since there's two sets of walking animations (left and right)
  let image = new Image();
  image.src = `./textures/player/walk/${i}.png`;
  self.Game.textures.player.walk.push(image);
}

// miscellaneous textures (background, particles, etc.)
self.Game.textures.background = [];
for (let i=0;i<3;i++) {
  let image = new Image();
  image.src = `./textures/background/${i}.png`;
  self.Game.textures.background.push(image);
}
// (() => {
//   let image = new Image();
//   image.onload = () => { self.Game.textures.background = image; }
//   image.src = './textures/background.png';
// })();

// interactive rect textures
(() => {
  let image = new Image();
  image.onload = () => { self.Game.textures.coin = image; }
  image.src = './textures/coin.png';
})();

(() => {
  let image = new Image();
  image.onload = () => { self.Game.textures.heart = image; }
  image.src = './textures/mi amor.png';
})();