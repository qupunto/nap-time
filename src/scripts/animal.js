import {constants} from "./constants.js";
import {SolidRectangle} from "./solidRectangle.js";

export class Animal {
  constructor(animal, initialX, initialY) {
    this.animal = animal;
    this.state = constants.animalStates.IDLE;
    this.position = { x: initialX, y: initialY };
    this.speed = { x: 0, y: 0 };
    this.idle_count = 0;
    this.moving = null;
  }
  update(terrain = []) {
    const newPosX = this.position.x + this.speed.x;
    const newPosY = this.position.y - this.speed.y;
    const width = this.animal.size;
    const height = this.state === constants.animalStates.CORUCHING ? this.animal.size / 2 : this.animal.size;
    const newHitBox = new SolidRectangle(newPosX, newPosY, width, height);
    terrain.forEach(element => {
      switch (newHitBox.collides(element)) {
        case constants.direction.RIGHT:
          this.speed.x = 0;
          this.position.x = element.x - this.animal.size;
          break;
        case constants.direction.LEFT:
          this.speed.x = 0;
          this.position.x = element.x + element.width;
          break;
        case constants.direction.UP:
          this.speed.y = 0;
          this.position.y = element.y - this.animal.size;
          break;
        case constants.direction.DOWN:
          this.speed.y = 0;
          this.position.y = element.y + element.height;
          break;
        default:
          this.position.y = newPosY;
          this.position.x = newPosX;
          break;
      }
    });
    if (this.#isAirborne())
      this.#gravity();
    if (this.moving === null)
      this.#inertia();
    this.#update_idle_animation();
  }
  draw(ctx) {
    const width = this.animal.size;
    const height = this.state === constants.animalStates.CORUCHING ? this.animal.size / 2 : this.animal.size;
    const animalBox = new SolidRectangle(this.position.x, this.position.y, width, height, { fillStyle: this.animal.color });
    animalBox.draw(ctx);
  }
  keyUp() {
    switch (this.state) {
      case constants.animalStates.JUMPING:
        this.state = constants.animalStates.DOUBLE_JUMPING;
        this.#jump()
        break;
      case constants.animalStates.DOUBLE_JUMPING:
      case constants.animalStates.SLAMMING:
        //DO NOTHING
        break;
      default:
        this.state = constants.animalStates.JUMPING;
        this.#jump();
        break;
    }
  }
  keyDown() {
    switch (this.state) {
      case constants.animalStates.JUMPING:
      case constants.animalStates.DOUBLE_JUMPING:
        this.state = constants.animalStates.SLAMMING;
        this.#slam();
        break;
      case constants.animalStates.SLAMMING:
        //DO NOTHING
        break;
      default:
        this.state = constants.animalStates.CORUCHING;
        break;
    }
  }
  keyLeft() {
    this.speed.x =
      this.speed.x > 0
        ? this.speed.x - (this.animal.acceleration * constants.full_stop)
        : this.speed.x - this.animal.acceleration;
    this.speed.x = Math.max(this.speed.x, -this.animal.max_speed);
    this.speed.x =
      Math.abs(this.speed.x) < this.animal.acceleration ? 0 : this.speed.x;
    if (this.speed.x !== 0)
      this.moving = constants.direction.LEFT;
  }
  keyRight() {
    this.speed.x =
      this.speed.x < 0
        ? this.speed.x + (this.animal.acceleration * constants.full_stop)
        : this.speed.x + this.animal.acceleration;
    this.speed.x = Math.min(this.speed.x, this.animal.max_speed);
    this.speed.x =
      Math.abs(this.speed.x) < this.animal.acceleration ? 0 : this.speed.x;
    if (this.speed.x !== 0)
      this.moving = constants.direction.RIGHT;
  }
  noKey() {
    this.moving = null;
  }
  #jump() {
    this.speed.y = this.animal.jumping_power;
  }
  #slam() {
    this.speed.y = -this.animal.max_speed * constants.full_stop;
  }
  #gravity() {
    this.speed.y -= constants.gravity;
  }
  #inertia() {
    this.speed.x =
      this.speed.x < 0
        ? this.speed.x + (this.animal.acceleration * constants.full_stop)
        : this.speed.x > 0
          ? this.speed.x - (this.animal.acceleration * constants.full_stop)
          : 0;
    this.speed.x =
      Math.abs(this.speed.x) < (this.animal.acceleration * constants.full_stop)
        ? 0
        : this.speed.x;
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
  #isAirborne() {
    return [constants.animalStates.JUMPING, constants.animalStates.DOUBLE_JUMPING, constants.animalStates.SLAMMING].includes(this.state);
  }
  #isMoving() {
    return [constants.animalStates.MOVING, constants.animalStates.JUMPING, constants.animalStates.DOUBLE_JUMPING, constants.animalStates.SLAMMING].includes(this.state)
  }
}
