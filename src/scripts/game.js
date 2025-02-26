﻿import {Animal} from "./animal.js"
import {constants} from "./constants.js";
import {SolidRectangle} from "./solidRectangle.js";

export class Game {
    constructor(canvasId, animal) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.canvas.height = Math.max(window.innerHeight, constants.min_height);
        this.canvas.width = Math.max(window.innerWidth, constants.min_width);
        this.animal = new Animal(animal, this.canvas.width / 2 - animal.size, this.canvas.height - 50);
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
            if (!this.keysPressed["ArrowLeft"] && !this.keysPressed["ArrowRight"])
                this.animal.noKey();
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
        this.terrain.push(new SolidRectangle(0, this.canvas.height, this.canvas.width, 50, { fillStyle: 'red' })); //bottom
        this.terrain.push(new SolidRectangle(0, 0, this.canvas.width, 1, { fillStyle: 'green' })); //top
        this.terrain.push(new SolidRectangle(0, this.canvas.height, 1, this.canvas.heigth, { fillStyle: 'yellow' })); //left
        this.terrain.push(new SolidRectangle(this.canvas.width, this.canvas.height, 1, this.canvas.heigth, { fillStyle: 'blue' })); //right
    }
}