import { Animal } from "./animal.js"
import { constants } from "./constants.js";
import { SolidRectangle } from "./solidRectangle.js";

export class Game {
    constructor(canvasId, animal) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.canvas.height = Math.max(window.innerHeight, constants.min_height);
        this.canvas.width = Math.max(window.innerWidth, constants.min_width);
        this.animal = new Animal(animal, this.canvas.width / 2 - animal.size, this.canvas.height - 20 - animal.size);
        this.keysPressed = {};
        this.bindKeys();
        this.gameLoop = this.gameLoop.bind(this);
        this.terrain = [];
        this.#createTerrain();
    }
    bindKeys() {
        document.addEventListener('keydown', (event) => {
            if (!this.keysPressed[event.code])
                this.keysPressed[event.code] = true;

            if (event.code === 'ArrowLeft') {
                this.animal.keyLeft();
            } else if (event.code === 'ArrowRight') {
                this.animal.keyRight();
            } else if (event.code === 'ArrowUp') {
                this.animal.keyUp();
            } else if (event.code === 'ArrowDown') {
                this.animal.keyDown();
            }
        });
        document.addEventListener('keyup', (event) => {
            this.keysPressed[event.code] = false;
            if (this.keysPressed["ArrowLeft"]) { this.animal.keyLeft() }
            else if (this.keysPressed["ArrowRight"]) { this.animal.keyRight() }
            else { this.animal.noKey() }
        });
    }
    new() {
        this.score = 0;
        this.gameState = constants.gameStates.SELECTING;
    }
    update() {
        this.animal.update(this.terrain);
    }
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.terrain.forEach(element => {
            element.draw(this.ctx);
        });
        this.animal.draw(this.ctx);
    }
    gameLoop() {
        this.update();
        this.draw();
        requestAnimationFrame(this.gameLoop);
    }

    start() {
        this.gameState = constants.gameStates.PLAYING;
        this.gameLoop();
    }
    #createTerrain() {
        this.terrain.push(new SolidRectangle(0, this.canvas.height - 20, this.canvas.width, 200, { fillStyle: 'green' })); //bottom
        this.terrain.push(new SolidRectangle(0, 0, this.canvas.width, 5, { fillStyle: 'green' })); //top
        this.terrain.push(new SolidRectangle(0, 0, 5, this.canvas.height, { fillStyle: 'green' })); //left
        this.terrain.push(new SolidRectangle(this.canvas.width - 5, 0, 5, this.canvas.height, { fillStyle: 'green' })); //right
        this.terrain.push(new SolidRectangle(5, this.canvas.height - 20 - 200, 400, 200, { fillStyle: 'blue' }));
        this.terrain.push(new SolidRectangle(600, this.canvas.height - 20 - 400, 200, 20, { fillStyle: 'yellow' }));
        this.terrain.push(new SolidRectangle(900, this.canvas.height - 20 - 600, 200, 20, { fillStyle: 'fuchsia' }));
        this.terrain.push(new SolidRectangle(1200, this.canvas.height - 20 - 800, 200, 20, { fillStyle: 'red' }));
    }
}