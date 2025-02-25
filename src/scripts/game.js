import { default as Animal } from "./animal.js"
import {default as Constants} from "./constants.js"
export default class Game {
    constructor(canvasId){
        this.constants = new Constants();
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.canvas.height = Math.max(window.innerHeight,this.constants.min_height);
        this.canvas.width = Math.max(window.innerWidth,this.constants.min_width);
        this.animal = {};
        this.direction = {};
        this.keysPressed = {};
        this.bindKeys();
        this.gameLoop = this.gameLoop.bind(this);
    }
    bindKeys() {
        document.addEventListener('keydown', (event) => {
            console.log(event.key, !Boolean(this.keysPressed[event.code]))
            if (event.code === 'ArrowLeft') {
                this.direction.x = this.constants.direction.LEFT;
            } else if (event.code === 'ArrowRight') {
                this.direction.x = this.constants.direction.RIGHT;
            } else if (event.code === 'ArrowUp' && !Boolean(this.keysPressed[event.code])) {
                this.animal.jump();
            } else if (event.code === 'ArrowDown' && !this.keysPressed[event.code]) {
                this.animal.slam();
            }
            if (!this.keysPressed[event.code])
                this.keysPressed[event.code] = true;
        });

        document.addEventListener('keyup', (event) => {
            this.keysPressed[event.code] = false;

            if(this.keysPressed["ArrowLeft"]) this.direction.x = this.constants.direction.LEFT;
            else if (this.keysPressed["ArrowRight"]) this.direction.x = this.constants.direction.RIGHT;
            else this.direction.x = null;

        });
      }
    new(){
        this.score = 0;
        this.gameState = this.constants.gameStates.SELECTING;
        this.player = null;
    }
    update(){
        this.animal.update(this.direction?.x);
    }
    draw(){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.animal.draw();
    }
    gameLoop() {
        this.update();
        this.draw();
        requestAnimationFrame(this.gameLoop);
      }

    start(){
        this.gameState=this.constants.gameStates.PLAYING;
        this.animal = new Animal(this.constants.animalTypes.DIA, this.canvas, this.ctx);
        this.gameType=this.constants.gameTypes.FEED;
        this.gameLoop();
    }
}