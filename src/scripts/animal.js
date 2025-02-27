import { constants } from "./constants.js";
import { SolidRectangle } from "./solidRectangle.js";

export class Animal {
  constructor(animal, initialX, initialY) {
    this.animal = animal;
    this.width = animal.size;
    this.height = animal.size;
    this.state = constants.animalStates.IDLE;
    this.position = { x: initialX, y: initialY };
    this.speed = { x: 0, y: 0 };
    this.idle_count = 0;
    this.moving = null;
    this.is_crouching = false;
  }
  update(terrain = []) {
    switch (this.moving) {
      case constants.direction.LEFT:
        this.speed.x = this.speed.x > 0 ?
          this.speed.x - this.animal.acceleration * constants.full_stop :
          this.speed.x - this.animal.acceleration;
        this.speed.x = Math.max(this.speed.x, -this.animal.max_speed);
        break;
      case constants.direction.RIGHT:
        this.speed.x = this.speed.x < 0 ?
          this.speed.x + this.animal.acceleration * constants.full_stop :
          this.speed.x + this.animal.acceleration;
        this.speed.x = Math.min(this.speed.x, this.animal.max_speed);
        break;
      case constants.direction.NONE:
        this.speed.x =
          this.speed.x == 0 ? 0 :
            this.speed.x < 0
              ? this.speed.x + (this.animal.acceleration * constants.full_stop)
              : this.speed.x - (this.animal.acceleration * constants.full_stop);
        this.speed.x =
          Math.abs(this.speed.x) < (this.animal.acceleration * constants.full_stop)
            ? 0
            : this.speed.x;
        break;
    }
    const newHitBox = new SolidRectangle(this.position.x, this.position.y, this.width, this.height);
    let noCollision = true;
    this.speed.y -= constants.gravity;
    terrain.forEach(element => {
      switch (newHitBox.collides({x:this.speed.x, y: -this.speed.y}, element)) {
        case constants.collision.RIGHT:
          console.log("ENTRA RIGHT")
          this.speed.x = 0;
          this.position.x = element.x - this.animal.size;
          this.position.y -= this.speed.y;
          this.direction = constants.direction.NONE;
          noCollision = false;
          break;
        case constants.collision.LEFT:
          console.log("ENTRA LEFT")
          this.speed.x = 0;
          this.position.x = element.x + element.width;
          this.position.y -= this.speed.y;
          this.direction = constants.direction.NONE;
          noCollision = false;
          break;
        case constants.collision.TOP:
          console.log("ENTRA UP")
          this.speed.y = 0;
          this.position.x += this.speed.x;
          this.position.y = element.y + this.animal.size;
          noCollision = false;
          break;
        case constants.collision.BOTTOM:
          console.log("ENTRA DOWN")
          this.speed.y = 0;
          this.position.x += this.speed.x;
          this.position.y = element.y - this.height;
          this.state = constants.animalStates.MOVING;
          noCollision = false;
          break;
        case constants.collision.CORNER_TOP_RIGHT:
          console.log("ENTRA CORNER_TOP_RIGHT")
          this.speed.x = 0;
          this.speed.y = 0;
          this.position.x = element.x - this.animal.size;
          this.position.y = element.y + element.height;
          this.direction = constants.direction.NONE;
          noCollision = false;
          break;
        case constants.collision.CORNER_BOTTOM_RIGHT:
          console.log("ENTRA CORNER_BOTTOM_RIGHT")
          this.speed.x = 0;
          this.speed.y = 0;
          this.position.x = element.x - this.animal.size;
          this.position.y = element.y - this.animal.size;
          this.direction = constants.direction.NONE;
          this.state = constants.animalStates.MOVING;
          noCollision = false;
          break;
        case constants.collision.CORNER_BOTTOM_LEFT:
          console.log("ENTRA CORNER_BOTTOM_LEFT")
          this.speed.x = 0;
          this.speed.y = 0;
          this.position.x = element.x + element.width;
          this.position.y = element.y - this.animal.size;
          this.direction = constants.direction.NONE;
          this.state = constants.animalStates.MOVING;
          noCollision = false;
          break;
        case constants.collision.CORNER_TOP_LEFT:
          console.log("ENTRA CORNER_TOP_LEFT")
          this.speed.x = 0;
          this.speed.y = 0;
          this.position.x = element.x + element.width;
          this.position.y = element.y + element.height;
          this.state = constants.animalStates.MOVING;
          this.direction = constants.direction.NONE;
          noCollision = false;
          break;
      }
    });
    if(noCollision){
      this.position.x = this.position.x + this.speed.x;
      this.position.y = this.position.y - this.speed.y;
    }
    this.#update_idle_animation();
  }
  draw(ctx) {
    const animalBox = new SolidRectangle(this.position.x, this.position.y, this.width, this.height, { fillStyle: this.animal.color });
    animalBox.draw(ctx);
  }
  keyUp() {
    if(this.is_crouching)
      this.#toggle_crouching();
    switch (this.state) {
      case constants.animalStates.JUMPING:
        this.state = constants.animalStates.DOUBLE_JUMPING;
        this.speed.y = this.animal.jumping_power;
        break;
      case constants.animalStates.DOUBLE_JUMPING:
      case constants.animalStates.SLAMMING:
        //DO NOTHING
        break;
      default:
        this.state = constants.animalStates.JUMPING;
        this.speed.y = this.animal.jumping_power;
        break;
    }
  }
  keyDown() {
    console.log("STATE", this.state)
    switch (this.state) {
      case constants.animalStates.JUMPING:
      case constants.animalStates.DOUBLE_JUMPING:
        this.state = constants.animalStates.SLAMMING;
        this.speed.y = -this.animal.max_speed * this.animal.size/5;
        break;
      case constants.animalStates.SLAMMING:
        //DO NOTHING
        break;
      default:
        this.#toggle_crouching()
        break;
    }
  }
  keyLeft() {
    this.moving = constants.direction.LEFT;
  }
  keyRight() {
    this.moving = constants.direction.RIGHT;
  }
  noKey() {
    this.moving = constants.direction.NONE;
  }
  #update_idle_animation() {
    if (this.state === constants.animalStates.IDLE) {
      this.idle_count++;
    }
    else {
      this.idle_count = 0;
    }
    if (this.idle_count > constants.idle_counter) {
      this.state = constants.animalStates.RESTING;
    }
  }
  #toggle_crouching(){
    if(this.is_crouching){
      this.height = this.animal.size;
      this.position.y -= this.animal.size / 2;
    }else{
      this.height = this.animal.size / 2;
      this.position.y += this.animal.size / 2;
    }
    this.is_crouching = !this.is_crouching;
  }
}
