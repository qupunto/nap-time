import {default as Constants} from "./constants.js"
export default class Animal{
    constructor(animal, canvas, ctx){
        this.constants = new Constants();
        this.canvas = canvas;
        this.ctx  = ctx;
        this.animal = animal;
        this.position={x:this.canvas.width / 2 - this.animal.size,y:this.canvas.height - 50 - this.animal.size};
        this.speed={x:0,y:0};
    }
    update(direction){
        switch(direction){
            case this.constants.direction.left:
                this.speed.x = this.speed.x>0 ? this.speed.x - this.animal.acceleration^2 : this.speed.x - this.animal.acceleration;
                this.speed.x = Math.max(this.speed.x, -this.animal.max_speed);
                this.position.x = (this.position.x + this.speed.x) <= 0 ? 0 : this.position.x + this.speed.x;
                break;
            case this.constants.direction.right:
                this.speed.x = this.speed.x<0 ? this.speed.x + this.animal.acceleration^2 : this.speed.x + this.animal.acceleration;
                this.speed.x = Math.min(this.speed.x, this.animal.max_speed);
                this.position.x = (this.position.x + this.speed.x + this.size) >= this.canvas.width ? this.canvas.width - this.size: this.position.x + this.speed.x;
                break;
        }
    }
    draw(){
        this.ctx.fillStyle= 'pink';
        this.ctx.fillRect(this.position.x, this.position.y, this.size, this.size);
    }
}