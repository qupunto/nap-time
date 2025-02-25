import { default as Constants } from "./constants.js";
export default class Animal {
  constructor(animal, canvas, ctx) {
    this.constants = new Constants();
    this.canvas = canvas;
    this.ctx = ctx;
    this.animal = animal;
    this.state = this.constants.animalStates.IDLE;
    this.baseline = this.canvas.height - 50 - this.animal.size;
    this.position = {
      x: this.canvas.width / 2 - this.animal.size,
      y: this.baseline,
    };
    this.speed = { x: 0, y: 0 };
    this.idle_count=0;
  }
  update(direction) {
    switch (direction) {
      case this.constants.direction.LEFT:
        console.log("ENTRA LEFT")
        this.speed.x =
          this.speed.x > 0
            ? (this.speed.x - this.animal.acceleration) ^ 2
            : this.speed.x - this.animal.acceleration;
        this.speed.x = Math.max(this.speed.x, -this.animal.max_speed);
        this.speed.x =
          Math.abs(this.speed.x) < this.animal.acceleration ? 0 : this.speed.x;
        this.position.x =
          this.position.x + this.speed.x <= 0
            ? 0
            : this.position.x + this.speed.x;
        break;
      case this.constants.direction.RIGHT:
        console.log("ENTRA RIGHT")
        this.speed.x =
          this.speed.x < 0
            ? (this.speed.x + this.animal.acceleration) ^ 2
            : this.speed.x + this.animal.acceleration;
        this.speed.x = Math.min(this.speed.x, this.animal.max_speed);
        this.speed.x =
          Math.abs(this.speed.x) < this.animal.acceleration ? 0 : this.speed.x;
        this.position.x = this.position.x + this.speed.x;
        break;
      default:
        console.log("ENTRA DEFAULT")
        this.speed.x =
          this.speed.x < 0
            ? (this.speed.x + this.animal.acceleration) ^ 2
            : this.speed.x > 0
            ? (this.speed.x - this.animal.acceleration) ^ 2
            : 0;
        this.speed.x =
          Math.abs(this.speed.x) < this.animal.acceleration ? 0 : this.speed.x;
        this.position.x = this.position.x + this.speed.x;
        break;
    }
    if (this.position.y > this.baseline) {
      this.position.y += this.speed.y;
      this.speed.y -= this.constants.gravity;
    }
    if (this.state === this.constants.animalStates.IDLE){
        this.idle_count++;
    }
    if (this.idle_count>this.constants.idle_counter){
        this.state = this.constants.animalStates.RESTING;
    }
    this.animalInBox();
  }
  draw() {
    this.ctx.fillStyle = this.animal.color;
    console.log(
        this.position.x,
        this.position.y,
        this.animal.size,
        this.animal.size
      );
    this.ctx.fillRect(
      this.position.x,
      this.position.y,
      this.animal.size,
      this.animal.size
    );
  }
  animalInBox() {
    if (this.position.x <= 0) {
      this.position.x = 0;
      this.speed.x = 0;
    }
    if (this.position.x + this.animal.size >= this.canvas.width) {
      this.position.x = this.canvas.width - this.animal.size;
      this.speed.x = 0;
    }
    if([this.constants.animalStates.JUMPING,this.constants.animalStates.DOUBLE_JUMPING].includes(this.state) && this.position.y <= this.baseline){
        this.position.y = this.baseline;
        this.state = this.constants.animalStates.IDLE;
    }
  }
  jump() {
    if (this.state != this.constants.animalStates.DOUBLE_JUMPING) {
      this.speed.y += this.animal.jumping_power * this.animal.size;
      this.state =
        this.state === this.constants.animalStates.JUMPING
          ? this.constants.animalStates.DOUBLE_JUMPING
          : this.constants.animalStates.JUMPING;
    }
  }
  slam() {}
}
