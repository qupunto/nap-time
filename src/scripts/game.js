import { Character } from "./Character.js";
import { Animal } from "./Animal.js";
import { CONSTANTS, GAME } from "./constants.js";
import { ScreenSection } from "./ScreenSection.js";
import { SolidRectangle } from "./SolidRectangle.js";

export class Game {
  #lastTime = 0;
  constructor(canvasId, animal = new Animal()) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext("2d");
    this.keysPressed = {};
    this.bindKeys();
    this.boundaries = {};
    this.#createCanvas();
    this.backgroundTerrain = [];
    this.foregroundTerrain = [];
    this.#createTerrain();
    this.screenSections = [];
    this.#assignScreenSections();
    this.drops = [];
    // this.character = new Character(
    //   animal,
    //   this.boundaries,
    //   {x: this.boundaries.START_X + this.boundaries.WIDTH / 2 - animal.SIZE * this.SIZE_RATIO,
    //     y:this.boundaries.HEIGHT - animal.SIZE * this.SIZE_RATIO,
    //   }
    // );
    const states = new Set([CONSTANTS.CHARACTER_STATES.GROUNDED, CONSTANTS.CHARACTER_STATES.MOVING_LEFT, CONSTANTS.CHARACTER_STATES.CROUCHING, CONSTANTS.CHARACTER_STATES.DASHING_LEFT]);
    this.character = new Character(
      animal,
      this.boundaries,
      {x: 195,y:750},
      states,
      {x:-10,y:0}
    );
    // New accumulator for the fixed timestep
    this.accumulator = 0;
    this.gameLoop = this.gameLoop.bind(this);
  }
  
  bindKeys() {
    document.addEventListener("keydown", (event) => {
      if (event.code === "ArrowLeft") {
        this.character.keydownLeft();
      } else if (event.code === "ArrowRight") {
        this.character.keydownRight();
      } else if (event.code === "ArrowUp") {
        if (!this.keysPressed[event.code])
          this.character.keydownUp();
      } else if (event.code === "ArrowDown") {
        if (!this.keysPressed[event.code])
          this.character.keydownDown();
      }
      if (!this.keysPressed[event.code]) this.keysPressed[event.code] = true;
    });
    document.addEventListener("keyup", (event) => {
      if (event.code === "ArrowLeft") {
        this.character.keyupLeft();
      } else if (event.code === "ArrowRight") {
        this.character.keyupRight();
      }
      this.keysPressed[event.code] = false;
      if (this.keysPressed["ArrowLeft"]) {
        this.character.keydownLeft();
      } else if (this.keysPressed["ArrowRight"]) {
        this.character.keydownRight();
      } else {
        this.character.noKey();
      }
    });
  }
  
  new() {
    this.score = 0;
    this.gameState = GAME.STATES.SELECTING;
  }
  
  update() {
    this.character.update(this.#getNearbyTerrain());
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.boundaries.draw(this.ctx);
    this.backgroundTerrain.forEach((element) => {
      element.draw(this.ctx);
    });
    // this.drops.forEach((element) => {
    //   element.draw(this.ctx);
    // });
    this.character.draw(this.ctx);
    // this.foregroundTerrain.forEach((element) => {
    //   element.draw(this.ctx);
    // });
    if (GAME.SYSTEM.DEBUG) this.#showGrid();
  }

  gameLoop(time) {
    const fixedDelta = GAME.SYSTEM.DELTA_TIME_MS;
    if (this.#lastTime === 0) {
      this.#lastTime = time;
    }
    let deltaTime = time - this.#lastTime;
    this.#lastTime = time;
    this.accumulator += deltaTime;
    
    while (this.accumulator >= fixedDelta) {
      this.update();
      this.accumulator -= fixedDelta;
    }
    
    this.draw();
    requestAnimationFrame(this.gameLoop);
  }

  start() {
    this.gameState = GAME.STATES.PLAYING;
    requestAnimationFrame(this.gameLoop);
  }

  #createTerrain() {
    //TODO import from terrain file, maybe constants?
    this.backgroundTerrain.push(
      new SolidRectangle(
        this.boundaries.START_X,
        this.boundaries.END_Y - 200 * this.SIZE_RATIO,
        400 * this.SIZE_RATIO,
        200 * this.SIZE_RATIO,
        {
          fillStyle: "darkgrey",
        }
      )
    );
    this.backgroundTerrain.push(
      new SolidRectangle(
        this.boundaries.START_X + 600 * this.SIZE_RATIO,
        this.boundaries.END_Y - 400 * this.SIZE_RATIO,
        200 * this.SIZE_RATIO,
        20 * this.SIZE_RATIO,
        {
          fillStyle: "yellow",
        }
      )
    );
    this.backgroundTerrain.push(
      new SolidRectangle(
        this.boundaries.START_X + 900 * this.SIZE_RATIO,
        this.boundaries.END_Y - 600 * this.SIZE_RATIO,
        200 * this.SIZE_RATIO,
        20 * this.SIZE_RATIO,
        {
          fillStyle: "fuchsia",
        }
      )
    );
    this.backgroundTerrain.push(
      new SolidRectangle(
        this.boundaries.START_X + 1100 * this.SIZE_RATIO,
        this.boundaries.END_Y - 800 * this.SIZE_RATIO,
        200 * this.SIZE_RATIO,
        20 * this.SIZE_RATIO,
        {
          fillStyle: "red",
        }
      )
    );
    this.backgroundTerrain.push(
      new SolidRectangle(
        this.boundaries.END_X -20 * this.SIZE_RATIO,
        this.boundaries.START_Y + 100 * this.SIZE_RATIO,
        20*this.SIZE_RATIO,
        this.boundaries.HEIGHT - 100 * this.SIZE_RATIO,
        {
          fillStyle: "brown",
        }
      )
    );
    this.backgroundTerrain.push(
      new SolidRectangle(
        this.boundaries.START_X,
        this.boundaries.START_Y + 100 * this.SIZE_RATIO,
        20*this.SIZE_RATIO,
        this.boundaries.HEIGHT - 100 * this.SIZE_RATIO,
        {
          fillStyle: "brown",
        }
      )
    );
  }

  #createCanvas() {
    this.canvas.height = Math.max(
      window.innerHeight,
      GAME.SCREEN.MIN_HEIGHT
    );
    this.canvas.width = Math.max(window.innerWidth, GAME.SCREEN.MIN_WIDTH);

    const availableWidth =
      this.canvas.width -
      (GAME.SCREEN.PADDING_LEFT + GAME.SCREEN.PADDING_RIGHT);
    const availableHeight =
      this.canvas.height -
      (GAME.SCREEN.PADDING_TOP + GAME.SCREEN.PADDING_BOTTOM);

    let rectWidth,
      rectHeight,
      widthClosest = true;

    if (availableWidth / availableHeight < GAME.SCREEN.ASPECT_RATIO) {
      rectWidth = availableWidth;
      rectHeight = Math.round(availableWidth / GAME.SCREEN.ASPECT_RATIO);
    } else {
      widthClosest = false;
      rectHeight = availableHeight;
      rectWidth = Math.round(availableHeight * GAME.SCREEN.ASPECT_RATIO);
    }

    const offsetX = widthClosest
      ? GAME.SCREEN.PADDING_LEFT
      : (this.canvas.width - rectWidth) / 2;
    const offsetY = !widthClosest
      ? GAME.SCREEN.PADDING_TOP
      : (this.canvas.height - rectHeight) / 2;

    this.ctx.fillStyle = GAME.SCREEN.OUTSIDE_COLOR;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.boundaries = new SolidRectangle(
      offsetX,
      offsetY,
      rectWidth,
      rectHeight,
      { fillStyle: GAME.SCREEN.BACKGROUND_COLOR }
    );
    this.SIZE_RATIO = this.boundaries.WIDTH / GAME.SCREEN.WIDTH;
  }

  #assignScreenSections() {
    let n = 0;
    const width = this.boundaries.WIDTH / 16;
    const height = this.boundaries.HEIGHT / 9;
    for (let x = 0; x < 16; x++) {
      for (let y = 0; y < 9; y++) {
        this.screenSections.push(
          new ScreenSection(
            n,
            this.boundaries.START_X + width * x,
            this.boundaries.START_Y + height * y,
            width,
            height,
            this.backgroundTerrain
          )
        );
        n++;
      }
    }
  }
  
  #showGrid() {
    const sectionWidth = this.boundaries.WIDTH / 16;
    const sectionHeight = this.boundaries.HEIGHT / 9;

    this.ctx.strokeStyle = "green";
    this.ctx.lineWidth = 1;
    this.ctx.fillStyle = "green";

    let firstLine = true;
    let n = 0;
    for (let x = 0; x < 16; x++) {
      this.ctx.font = '14px arial';
      this.ctx.beginPath();
      this.ctx.moveTo(this.boundaries.START_X + x * sectionWidth, this.boundaries.START_Y);
      this.ctx.lineTo(this.boundaries.START_X + x * sectionWidth, this.boundaries.END_Y);
      this.ctx.stroke();
      this.ctx.fillText(Math.trunc(x * sectionWidth) + "px", this.boundaries.START_X + x * sectionWidth + 5, this.boundaries.START_Y + 15);
      for (let y = 0; y < 9; y++) {
        if (firstLine) {
          this.ctx.font = '14px arial';
          this.ctx.beginPath();
          this.ctx.moveTo(this.boundaries.START_X, this.boundaries.START_Y + y * sectionHeight);
          this.ctx.lineTo(this.boundaries.END_X, this.boundaries.START_Y + y * sectionHeight);
          this.ctx.stroke();
          this.ctx.fillText(Math.trunc(y * sectionHeight) + "px", this.boundaries.START_X + 5, this.boundaries.START_Y + y * sectionHeight + 15);
        }
        this.ctx.font = '20px arial';
        this.ctx.fillText(n, this.boundaries.START_X + x * sectionWidth + sectionWidth / 2 - 10, this.boundaries.START_Y + y * sectionHeight + sectionHeight / 2 + 10);
        n++;
      }
      firstLine = false;
    }
  }
  
  #getNearbyTerrain() {
    const SECTION_WIDTH = this.boundaries.WIDTH / 16;
    const SECTION_HEIGHT = this.boundaries.HEIGHT / 9;
    const SECTION_START_X = Math.trunc((this.character.position.x - this.character.velocity.x - this.boundaries.START_X) / SECTION_WIDTH);
    const SECTION_START_Y = Math.trunc((this.character.position.y - this.character.velocity.y - this.boundaries.START_Y) / SECTION_HEIGHT);
    const SECTION_END_X = Math.trunc((this.character.position.x + this.character.WIDTH + this.character.velocity.x - this.boundaries.START_X) / SECTION_WIDTH);
    const SECTION_END_Y = Math.trunc((this.character.position.y + this.character.HEIGHT - this.character.velocity.y - this.boundaries.START_Y) / SECTION_HEIGHT);

    const ids = new Set();
    ids.add(getId(SECTION_START_X, SECTION_START_Y));
    ids.add(getId(SECTION_START_X, SECTION_END_Y));
    ids.add(getId(SECTION_END_X, SECTION_START_Y));
    ids.add(getId(SECTION_END_X, SECTION_END_Y));

    function getId(posX, posY) {
      return posX * 9 + posY;
    }

    const obstacles = [];
    this.screenSections
      .filter((obj) => ids.has(obj.ID))
      .forEach((obj) => {
        obstacles.push(...obj.OBSTACLES);
      });
    return new Set(obstacles);
  }
}
