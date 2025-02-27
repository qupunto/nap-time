import { CONSTANTS } from "./constants.js";
import { SolidRectangle } from "./SolidRectangle.js";
import { applyRatio } from "./transformations.js";

export class Animal {
  constructor(animal, initialX, initialY, boundaries = null) {
    this.SIZE_RATIO = boundaries
      ? boundaries.WIDTH / CONSTANTS.SCREEN.WIDTH
      : 1;
    Object.assign(this, applyRatio(animal, this.SIZE_RATIO));
    this.width = this.size;
    this.height = this.size;
    this.boundaries = boundaries;
    this.state = CONSTANTS.ANIMAL_STATES.IDLE;
    this.position = { x: initialX, y: initialY };
    this.velocity = { x: 0, y: 0 };
    this.idle_count = 0;
    this.moving = CONSTANTS.DIRECTION.NONE;
    this.airborne = CONSTANTS.AIRBORNE_STATES.GROUNDED;
    this.is_crouching = false;
  }
  update(terrain = []) {
    // console.log(terrain, "obstacles");
    this.#computeMovement();
    this.#stayInBoundaries();
    this.#resolveCollisions(terrain);
    this.#update_idle_animation();
  }
  draw(ctx) {
    const animalBox = new SolidRectangle(
      this.position.x,
      this.position.y,
      this.width,
      this.height,
      { fillStyle: this.color }
    );
    animalBox.draw(ctx);
  }
  keyUp() {
    if (this.is_crouching) this.#toggle_crouching();
    switch (this.airborne) {
      case CONSTANTS.AIRBORNE_STATES.JUMPING:
        this.airborne = CONSTANTS.AIRBORNE_STATES.DOUBLE_JUMPING;
        this.velocity.y = this.jumpingPower;
        break;
      case CONSTANTS.AIRBORNE_STATES.DOUBLE_JUMPING:
      case CONSTANTS.AIRBORNE_STATES.SLAMMING:
      case CONSTANTS.AIRBORNE_STATES.FALLING:
        //DO NOTHING
        break;
      default:
        this.airborne = CONSTANTS.AIRBORNE_STATES.JUMPING;
        this.velocity.y = this.jumpingPower;
        break;
    }
  }
  keyDown() {
    switch (this.airborne) {
      case CONSTANTS.AIRBORNE_STATES.JUMPING:
      case CONSTANTS.AIRBORNE_STATES.DOUBLE_JUMPING:
        this.airborne = CONSTANTS.AIRBORNE_STATES.SLAMMING;
        this.velocity.y = (-this.maxVelocity * this.size) / 5;
        break;
      case CONSTANTS.AIRBORNE_STATES.SLAMMING:
        //DO NOTHING
        break;
      default:
        this.#toggle_crouching();
        break;
    }
  }
  keyLeft() {
    this.moving = CONSTANTS.DIRECTION.LEFT;
  }
  keyRight() {
    this.moving = CONSTANTS.DIRECTION.RIGHT;
  }
  noKey() {
    this.moving = CONSTANTS.DIRECTION.NONE;
  }
  #update_idle_animation() {
    if (this.state === CONSTANTS.ANIMAL_STATES.IDLE) {
      this.idle_count++;
    } else {
      this.idle_count = 0;
    }
    if (this.idle_count > CONSTANTS.GAME_SETTINGS.IDLE_COUNTER) {
      this.state = CONSTANTS.ANIMAL_STATES.RESTING;
    }
  }
  #toggle_crouching() {
    if (this.is_crouching) {
      this.height = this.size;
      this.position.y -= this.size / 2;
    } else {
      this.height = this.size / 2;
      this.position.y += this.size / 2;
    }
    this.is_crouching = !this.is_crouching;
  }

  #computeMovement() {
    switch (this.moving) {
      case CONSTANTS.DIRECTION.LEFT:
        this.velocity.x =
          this.velocity.x > 0
            ? this.velocity.x - this.acceleration * CONSTANTS.GAME_SETTINGS.FULL_STOP
            : this.velocity.x - this.acceleration;
        this.velocity.x = Math.max(this.velocity.x, -this.maxVelocity);
        break;
      case CONSTANTS.DIRECTION.RIGHT:
        this.velocity.x =
          this.velocity.x < 0
            ? this.velocity.x + this.acceleration * CONSTANTS.GAME_SETTINGS.FULL_STOP
            : this.velocity.x + this.acceleration;
        this.velocity.x = Math.min(this.velocity.x, this.maxVelocity);
        break;
      case CONSTANTS.DIRECTION.NONE:
        this.velocity.x =
          this.velocity.x == 0
            ? 0
            : this.velocity.x < 0
            ? this.velocity.x + this.acceleration * CONSTANTS.GAME_SETTINGS.FULL_STOP
            : this.velocity.x - this.acceleration * CONSTANTS.GAME_SETTINGS.FULL_STOP;
        this.velocity.x =
          Math.abs(this.velocity.x) < this.acceleration * CONSTANTS.GAME_SETTINGS.FULL_STOP
            ? 0
            : this.velocity.x;
        break;
    }
    this.velocity.y -= CONSTANTS.GAME_SETTINGS.GRAVITY*this.SIZE_RATIO;
  }

  #stayInBoundaries() {
    if (this.boundaries) {
      if (this.position.x + this.velocity.x <= this.boundaries.START_X) {
        //LEFT COLLISION
        this.velocity.x = 0;
        this.position.x = this.boundaries.START_X;
      }
      if (this.position.x + this.velocity.x + this.width >= this.boundaries.END_X) {
        //RIGHT COLLISION
        this.velocity.x = 0;
        this.position.x = this.boundaries.END_X - this.width;
      }
      if (this.position.y - this.velocity.y + this.height >= this.boundaries.END_Y) {
        //BOTTOM COLLISION
        this.velocity.y = 0;
        this.position.y = this.boundaries.END_Y - this.height;
        this.airborne = CONSTANTS.AIRBORNE_STATES.GROUNDED;
      }
      if (this.position.y - this.velocity.y <= this.boundaries.START_Y) {
        //TOP COLLISION
        this.velocity.y = 0;
        this.position.y = this.boundaries.START_Y;
        this.airborne = CONSTANTS.AIRBORNE_STATES.FALLING;
      }
    }
  }

  #resolveCollisions(terrain=[]) {
    const hitBox = new SolidRectangle(
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
    if(terrain.length==0){
      console.log("QUE PASA");
    }
    let noCollision = true;
    terrain.forEach((element) => {
      switch (
        hitBox.collides({ x: this.velocity.x, y: -this.velocity.y }, element)
      ) {
        case CONSTANTS.COLLISION.RIGHT:
          console.log("ENTRA RIGHT");
          this.velocity.x = 0;
          this.position.x = element.START_X - this.size;
          this.position.y -= this.velocity.y;
          this.direction = CONSTANTS.DIRECTION.NONE;
          noCollision = false;
          break;
        case CONSTANTS.COLLISION.LEFT:
          console.log("ENTRA LEFT");
          this.velocity.x = 0;
          this.position.x = element.END_X;
          this.position.y -= this.velocity.y;
          this.direction = CONSTANTS.DIRECTION.NONE;
          noCollision = false;
          break;
        case CONSTANTS.COLLISION.TOP:
          console.log("ENTRA UP");
          this.velocity.y = 0;
          this.position.x += this.velocity.x;
          this.position.y = element.END_Y;
          noCollision = false;
          break;
        case CONSTANTS.COLLISION.BOTTOM:
          console.log("ENTRA DOWN");
          this.velocity.y = 0;
          this.position.x += this.velocity.x;
          this.position.y = element.START_Y - this.height;
          this.state = CONSTANTS.ANIMAL_STATES.MOVING;
          this.airborne = CONSTANTS.AIRBORNE_STATES.GROUNDED;
          noCollision = false;
          break;
        case CONSTANTS.COLLISION.CORNER_TOP_RIGHT:
          console.log("ENTRA CORNER_TOP_RIGHT");
          this.velocity.x = 0;
          this.velocity.y = 0;
          this.position.x = element.START_X - this.size;
          this.position.y = element.END_Y;
          this.direction = CONSTANTS.DIRECTION.NONE;
          this.airborne = CONSTANTS.AIRBORNE_STATES.FALLING;
          noCollision = false;
          break;
        case CONSTANTS.COLLISION.CORNER_BOTTOM_RIGHT:
          console.log("ENTRA CORNER_BOTTOM_RIGHT");
          this.velocity.x = 0;
          this.velocity.y = 0;
          this.position.x = element.START_X - this.size;
          this.position.y = element.START_Y - this.size;
          this.direction = CONSTANTS.DIRECTION.NONE;
          this.state = CONSTANTS.ANIMAL_STATES.MOVING;
          noCollision = false;
          break;
        case CONSTANTS.COLLISION.CORNER_BOTTOM_LEFT:
          console.log("ENTRA CORNER_BOTTOM_LEFT");
          this.velocity.x = 0;
          this.velocity.y = 0;
          this.position.x = element.END_X;
          this.position.y = element.START_Y - this.size;
          this.direction = CONSTANTS.DIRECTION.NONE;
          this.state = CONSTANTS.ANIMAL_STATES.MOVING;
          noCollision = false;
          break;
        case CONSTANTS.COLLISION.CORNER_TOP_LEFT:
          console.log("ENTRA CORNER_TOP_LEFT");
          this.velocity.x = 0;
          this.velocity.y = 0;
          this.position.x = element.END_X;
          this.position.y = element.END_Y;
          this.state = CONSTANTS.ANIMAL_STATES.MOVING;
          this.direction = CONSTANTS.DIRECTION.NONE;
          noCollision = false;
          break;
      }
    });
    if (noCollision) {
      this.position.x = this.position.x + this.velocity.x;
      this.position.y = this.position.y - this.velocity.y;
    }
  }
}
