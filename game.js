const canvas = document.getElementById('canvas');
const c = canvas.getContext('2d');
const color = (r,g,b) => { c.fillStyle = `rgb(${r},${g},${b})`}

self.Game.frameCounter = 0;

class Camera {
  constructor() {
    this.offset = { x: 0, y: 0 };
  }

  drawFromRect(rect) {
    c.fillRect(rect.x - this.offset.x, rect.y - this.offset.y, rect.width, rect.height);
  }

  drawImageWithRect(image, rect, size=false) {
    if (size == true) {
      c.drawImage(image, rect.x - this.offset.x, rect.y - this.offset.y, rect.width, rect.height);
    } else {
      c.drawImage(image, rect.x - this.offset.x, rect.y - this.offset.y);
    }
  }
}

const camera = new Camera();

class Rect {
  constructor(x,y,width,height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  collision(rect) {
    return this.x < rect.x + rect.width && this.x + this.width > rect.x && this.y < rect.y + rect.height && this.y + this.height > rect.y ? true : false;
  }
}

// tiles like the border walls, platforms, and other things
let tiles = [{"x":326,"y":250,"width":100,"height":20,"type":"1"},{"x":769,"y":340,"width":100,"height":20,"type":"1"},{"x":717,"y":328,"width":100,"height":20,"type":"1"},{"x":1068,"y":307,"width":100,"height":20,"type":"1"},{"x":620,"y":368,"width":100,"height":20,"type":"1"},{"x":537,"y":407,"width":100,"height":20,"type":"1"},{"x":995,"y":439,"width":100,"height":20,"type":"1"},{"x":648,"y":298,"width":100,"height":20,"type":"1"},{"x":563,"y":374,"width":100,"height":20,"type":"1"},{"x":-14,"y":409,"width":100,"height":20,"type":"1"},{"x":-3,"y":433,"width":100,"height":20,"type":"1"},{"x":369,"y":593,"width":100,"height":20,"type":"1"},{"x":394,"y":464,"width":100,"height":20,"type":"1"},{"x":-2,"y":306,"width":100,"height":20,"type":"1"},{"x":-184,"y":334,"width":100,"height":20,"type":"1"},{"x":-92,"y":413,"width":100,"height":20,"type":"1"},{"x":41,"y":503,"width":100,"height":20,"type":"1"},{"x":123,"y":510,"width":100,"height":20,"type":"1"},{"x":46,"y":428,"width":100,"height":20,"type":"1"},{"x":-233,"y":201,"width":730,"height":20,"type":"1"},{"x":-238,"y":128,"width":730,"height":20,"type":"1"}];

class Player extends Rect {
  constructor(x,y,width,height) {
    super(x,y,width,height);
    this.vel = { x: 0, y: 0 };

    this.walkFrame = 0; // which frame to show in the walk cycle
    this.direction = 'left'; // direction player is facing

    this.jumpCount = 0;
  }

  move() {
    this.x += this.vel.x;
    let cList = [];
    tiles.forEach(tile => {
      if (this.collision(tile)) cList.push(tile);
    });
  
    cList.forEach(collide_tile => {
      if (this.vel.x > 0) {
        this.x = collide_tile.x - this.width;
      } else if (this.vel.x < 0) {
        this.x = collide_tile.x + collide_tile.width;
      }
    });
  
    this.y += this.vel.y;
    cList = [];
    tiles.forEach(tile => {
      if (this.collision(tile)) cList.push(tile);
    });
  
    cList.forEach(collide_tile => {
      if (this.vel.y > 0) {
        this.y = collide_tile.y - this.height;
        this.vel.y = 0;
        this.jumpCount = 0;
      } else if (this.vel.y < 0) {
        this.y = collide_tile.y + collide_tile.height;
        this.vel.y = 0;
      }
    });
  }

  draw(cam) {
    let matchRectSize = true;
    if (this.direction == 'left') {
      if (this.vel.y < 0) {
        cam.drawImageWithRect(self.Game.textures.player.rising[0], this, matchRectSize);
      } else if (this.vel.y > 0) {
        cam.drawImageWithRect(self.Game.textures.player.falling[0], this, matchRectSize);
      } else {
        cam.drawImageWithRect(self.Game.textures.player.walk[this.walkFrame], this, matchRectSize);
      }
    } else if (this.direction == 'right') {
      if (this.vel.y < 0) {
        cam.drawImageWithRect(self.Game.textures.player.rising[1], this, matchRectSize);
      } else if (this.vel.y > 0) {
        cam.drawImageWithRect(self.Game.textures.player.falling[1], this, matchRectSize);
      } else {
        cam.drawImageWithRect(self.Game.textures.player.walk[this.walkFrame+4], this, matchRectSize);
      }
    }

    if (this.vel.x != 0 && self.Game.frameCounter%5==0) this.walkFrame = (this.walkFrame+1)%4;
    if (this.vel.x == 0 || this.vel.y != 0) this.walkFrame = 0;
  }
}

let player = new Player(100,150,80,108);

function render() {
  color(127,127,127);
  c.fillRect(0,0,canvas.width,canvas.height);

  player.draw(camera);

  // color(255,255,255); DEBUGGING
  // c.fillRect(Math.floor(canvas.width/2)-2, Math.floor(canvas.height/2)-2, 2, 2);

  color(0,0,0);
  tiles.forEach(tile => {
    camera.drawFromRect(tile);
  });
}

function game() {
  render();
  if (player.vel.x < 0) {
    player.direction = 'left';
  } else if (player.vel.x > 0) {
    player.direction = 'right';
  }

  player.vel.y += 0.1;
  player.move();

  camera.offset.x = player.x + Math.floor(player.width/2) - Math.floor(canvas.width/2);
  camera.offset.y = player.y + Math.floor(player.height/2) - Math.floor(canvas.height/2);
}

let keysPressed = {};
function keyEventHandler(event) {
  if (event.type == 'keydown') keysPressed[event.key] = true;
  if (event.type == 'keyup') keysPressed[event.key] = false;

  if (keysPressed['ArrowLeft']) {
    player.vel.x = -5;
  }
  if (keysPressed['ArrowRight']) {
    player.vel.x = 5;
  }
  if (!keysPressed['ArrowLeft'] && !keysPressed['ArrowRight']) {
    player.vel.x = 0;
  }

  if (keysPressed['ArrowUp'] && player.jumpCount < 2) {
    player.vel.y = -5;
    player.jumpCount += 1;
  }
}

document.addEventListener('keydown', keyEventHandler, true);
document.addEventListener('keyup', keyEventHandler, true);

setInterval(() => {
  game();
  self.Game.frameCounter += 1;
}, 1000/60);