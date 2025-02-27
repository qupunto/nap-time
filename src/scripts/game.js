import { Animal } from "./Animal.js";
import { CONSTANTS } from "./constants.js";
import { ScreenSection } from "./ScreenSection.js";
import { SolidRectangle } from "./SolidRectangle.js";

export class Game {
  constructor(canvasId, animal) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext("2d");
    this.keysPressed = {};
    this.bindKeys();
    this.gameLoop = this.gameLoop.bind(this);
    this.boundaries = {};
    this.#createCanvas();
    this.terrain = [];
    this.#createTerrain();
    this.screenSections = [];
    this.#assignScreenSections();
    console.log(this.screenSections, "SECTIONS");
    this.drops = [];
    this.character = new Animal(
      animal,
      this.boundaries.WIDTH / 2 - animal.size * this.SIZE_RATIO,
      this.boundaries.HEIGHT - animal.size * this.SIZE_RATIO,
      this.boundaries
    );
  }
  bindKeys() {
    document.addEventListener("keydown", (event) => {
      if (!this.keysPressed[event.code]) this.keysPressed[event.code] = true;

      if (event.code === "ArrowLeft") {
        this.character.keyLeft();
      } else if (event.code === "ArrowRight") {
        this.character.keyRight();
      } else if (event.code === "ArrowUp") {
        this.character.keyUp();
      } else if (event.code === "ArrowDown") {
        this.character.keyDown();
      }
    });
    document.addEventListener("keyup", (event) => {
      this.keysPressed[event.code] = false;
      if (this.keysPressed["ArrowLeft"]) {
        this.character.keyLeft();
      } else if (this.keysPressed["ArrowRight"]) {
        this.character.keyRight();
      } else {
        this.character.noKey();
      }
    });
  }
  new() {
    this.score = 0;
    this.gameState = CONSTANTS.GAME_STATES.SELECTING;
  }
  update() {
    const obstacles = this.#getNearbyTerrain();
    this.character.update(obstacles);
  }

  draw() {
    // this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.boundaries.draw(this.ctx);
    this.terrain.forEach((element) => {
      element.draw(this.ctx);
    });
    // this.drops.forEach((element) => {

    // });
    if(CONSTANTS.GAME_SETTINGS.DEBUG) this.#showGrid();
    this.character.draw(this.ctx);
  }

  gameLoop() {
    this.update();
    this.draw();
    requestAnimationFrame(this.gameLoop);
  }

  start() {
    this.gameState = CONSTANTS.GAME_STATES.PLAYING;
    this.gameLoop();
  }

  #createTerrain() {
    //TODO import from terrain file, maybe constants?
    this.terrain.push(
      new SolidRectangle(
        this.boundaries.START_X,
        this.boundaries.END_Y - 200 * this.SIZE_RATIO,
        400 * this.SIZE_RATIO,
        200 * this.SIZE_RATIO,
        {
          fillStyle: "blue",
        }
      )
    );
    this.terrain.push(
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
    this.terrain.push(
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
    this.terrain.push(
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
    this.terrain.forEach((element) => {
      element.draw(this.ctx);
    });
  }

  #createCanvas() {
    this.canvas.height = Math.max(
      window.innerHeight,
      CONSTANTS.SCREEN.MIN_HEIGHT
    );
    this.canvas.width = Math.max(window.innerWidth, CONSTANTS.SCREEN.MIN_WIDTH);

    const availableWidth =
      this.canvas.width -
      (CONSTANTS.SCREEN.PADDING_LEFT + CONSTANTS.SCREEN.PADDING_RIGHT);
    const availableHeight =
      this.canvas.height -
      (CONSTANTS.SCREEN.PADDING_TOP + CONSTANTS.SCREEN.PADDING_BOTTOM);

    let rectWidth,
      rectHeight,
      widthClosest = true;

    if (availableWidth / availableHeight < CONSTANTS.SCREEN.ASPECT_RATIO) {
      rectWidth = availableWidth;
      rectHeight = Math.round(availableWidth / CONSTANTS.SCREEN.ASPECT_RATIO);
    } else {
      widthClosest = false;
      rectHeight = availableHeight;
      rectWidth = Math.round(availableHeight * CONSTANTS.SCREEN.ASPECT_RATIO);
    }

    const offsetX = widthClosest
      ? CONSTANTS.SCREEN.PADDING_LEFT
      : (this.canvas.width - rectWidth) / 2;
    const offsetY = !widthClosest
      ? CONSTANTS.SCREEN.PADDING_TOP
      : (this.canvas.height - rectHeight) / 2;

    this.ctx.fillStyle = CONSTANTS.SCREEN.OUTSIDE_COLOR;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = CONSTANTS.SCREEN.BACKGROUND_COLOR;
    this.ctx.fillRect(offsetX, offsetY, rectWidth, rectHeight);
    this.boundaries = new SolidRectangle(
      offsetX,
      offsetY,
      rectWidth,
      rectHeight,
      { fillStyle: CONSTANTS.SCREEN.BACKGROUND_COLOR }
    );
    this.SIZE_RATIO = this.boundaries.WIDTH / CONSTANTS.SCREEN.WIDTH;
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
            this.terrain
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
        this.ctx.font = '10px arial';
        this.ctx.beginPath();
        this.ctx.moveTo(this.boundaries.START_X + x * sectionWidth, this.boundaries.START_Y);
        this.ctx.lineTo(this.boundaries.START_X + x * sectionWidth, this.boundaries.END_Y);
        this.ctx.stroke();
        this.ctx.fillText(Math.trunc(x * sectionWidth) + "px",this.boundaries.START_X + x*sectionWidth + 5,  this.boundaries.START_Y + 10);
        for (let y = 0; y < 9; y++) {
            if(firstLine){
                this.ctx.font = '10px arial';
                this.ctx.beginPath();
                this.ctx.moveTo(this.boundaries.START_X, this.boundaries.START_Y + y * sectionHeight);
                this.ctx.lineTo(this.boundaries.END_X, this.boundaries.START_Y + y * sectionHeight);
                this.ctx.stroke();
                this.ctx.fillText(Math.trunc(y * sectionHeight) + "px", this.boundaries.START_X + 5, this.boundaries.START_Y + y*sectionHeight - 5);
            }
            this.ctx.font = '20px arial';
            this.ctx.fillText(n, this.boundaries.START_X + x* sectionWidth + sectionWidth/2 -10, this.boundaries.START_Y + y*sectionHeight + sectionHeight/2 + 10);
            n++;
        }
        firstLine = false;
    }
  }
  #getNearbyTerrain() {
    const sectionWidth = this.boundaries.WIDTH / 16;
    const sectionHeight = this.boundaries.HEIGHT / 9;
    const SECTION_START_X = Math.trunc((this.character.position.x - this.character.velocity.x - this.boundaries.START_X ) / sectionWidth);
    const SECTION_START_Y = Math.trunc((this.character.position.y - this.character.velocity.y - this.boundaries.START_Y) / sectionHeight);
    const SECTION_END_X = Math.trunc((this.character.position.x + this.character.width + this.character.velocity.x - this.boundaries.START_X) / sectionWidth);
    const SECTION_END_Y = Math.trunc((this.character.position.y + this.character.height - this.character.velocity.y - this.boundaries.START_Y) / sectionHeight);

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
