import { GAME, CONSTANTS } from "./constants.js";
import { CollisionBox } from "./CollisionBox.js";
import { SolidRectangle } from "./SolidRectangle.js";
import { applyRatio } from "./helpers.js";
import { Animal } from "./Animal.js";

export class Character {
  constructor(animal = new Animal(), initialX, initialY, boundaries) {
    const self = this;
    this.BOUNDARIES = boundaries;
    this.RESIZE_RATIO = this.BOUNDARIES.WIDTH / GAME.SCREEN.WIDTH;
    Object.assign(this, applyRatio(animal, this.RESIZE_RATIO));
    this._width = this.SIZE;
    this._height = this.SIZE;
    this.position = {
      _x: initialX,
      _y: initialY,
      get rawX(){
        return this._x;
      },
      get x() {
        return self.states.has(CONSTANTS.CHARACTER_STATES.GRIPPING_RIGHT) ? this._x + self.WIDTH : this._x;
      },
      get rawY(){
        return this._y;
      },
      get y() {
        return self.is_crouching ? this._y + self.HEIGHT : this._y;
      },
      set x(val) {
        this._x = val;
      },
      set y(val) {
        this._y = val;
      }
    }
    this.states = new Set([CONSTANTS.CHARACTER_STATES.GROUNDED]);
    this.velocity = { x: 0, y: 0 };
    this.idle_timeout = null;
    this.gripping_timeout = null;
  }
  update(terrain = new Set()) {
    this.#computeMovement();
    this.#resolveCollisions(terrain);
    this.#stayInBoundaries();
    this.#updateIdleAnimation();
  }
  draw(ctx) {
    new SolidRectangle(
      this.position.x,
      this.position.y,
      this.WIDTH,
      this.HEIGHT,
      { fillStyle: this.color }
    ).draw(ctx);
  }
  keydownUp() {
    this.#states__not_idle();
    if (this.states.has(CONSTANTS.CHARACTER_STATES.JUMPING)) {
      this.states.delete(CONSTANTS.CHARACTER_STATES.JUMPING)
      this.states.add(CONSTANTS.CHARACTER_STATES.IMPULSING_UP);
      this.states.add(CONSTANTS.CHARACTER_STATES.DOUBLE_JUMPING);
    }
    if (this.states.has(CONSTANTS.CHARACTER_STATES.GROUNDED)) {
      this.states.delete(CONSTANTS.CHARACTER_STATES.GROUNDED);
      this.states.add(CONSTANTS.CHARACTER_STATES.JUMPING);
      this.states.add(CONSTANTS.CHARACTER_STATES.IMPULSING_UP);
    }
    if (this.states.has(CONSTANTS.CHARACTER_STATES.GRIPPING_RIGHT)) {
      this.states.delete(CONSTANTS.CHARACTER_STATES.GRIPPING_RIGHT);
      clearTimeout(this.gripping_timeout);
      this.gripping_timeout = null;
      this.states.add(CONSTANTS.CHARACTER_STATES.JUMPING);
      this.states.add(CONSTANTS.CHARACTER_STATES.IMPULSING_UP);
      this.states.add(CONSTANTS.CHARACTER_STATES.IMPULSING_LEFT);
    }
    if (this.states.has(CONSTANTS.CHARACTER_STATES.GRIPPING_LEFT)) {
      this.states.delete(CONSTANTS.CHARACTER_STATES.GRIPPING_LEFT);
      clearTimeout(this.gripping_timeout);
      this.gripping_timeout = null;
      this.states.add(CONSTANTS.CHARACTER_STATES.JUMPING);
      this.states.add(CONSTANTS.CHARACTER_STATES.IMPULSING_UP);
      this.states.add(CONSTANTS.CHARACTER_STATES.IMPULSING_RIGHT);
    }
    7
    if (this.states.has(CONSTANTS.CHARACTER_STATES.CROUCHING)) {
      this.states.delete(CONSTANTS.CHARACTER_STATES.CROUCHING);
      this.states.add(CONSTANTS.CHARACTER_STATES.STANDING);
    }
  }
  keydownDown() {
    this.#states__not_idle();
    if (this.states.has(CONSTANTS.CHARACTER_STATES.JUMPING)) {
      this.states.delete(CONSTANTS.CHARACTER_STATES.JUMPING);
      this.states.add(CONSTANTS.CHARACTER_STATES.SLAMMING);
    }
    if (this.states.has(CONSTANTS.CHARACTER_STATES.DOUBLE_JUMPING)) {
      this.states.delete(CONSTANTS.CHARACTER_STATES.DOUBLE_JUMPING);
      this.states.add(CONSTANTS.CHARACTER_STATES.SLAMMING);
    }
    if (this.states.has(CONSTANTS.CHARACTER_STATES.CROUCHING)) {
      // this.states.delete(CONSTANTS.CHARACTER_STATES.CROUCHING);
      // this.states.delete(CONSTANTS.CHARACTER_STATES.GROUNDED);
      this.states.add(CONSTANTS.CHARACTER_STATES.DROPPING);
    }
    if (this.states.has(CONSTANTS.CHARACTER_STATES.GROUNDED)) {
      this.states.add(CONSTANTS.CHARACTER_STATES.CROUCHING);
    }
  }
  keydownLeft() {
    this.#states__not_idle();
    if(this.states.has(CONSTANTS.CHARACTER_STATES.GRIPPING_LEFT))
      return;
    this.states.add(CONSTANTS.CHARACTER_STATES.MOVING_LEFT);
    this.states.delete(CONSTANTS.CHARACTER_STATES.MOVING_RIGHT);
    this.states.delete(CONSTANTS.CHARACTER_STATES.GRIPPING_RIGHT);
    if (this.states.has(CONSTANTS.CHARACTER_STATES.WAITING_KEYPRESS_LEFT)) {
      this.states.delete(CONSTANTS.CHARACTER_STATES.WAITING_KEYPRESS_LEFT);
      this.states.add(CONSTANTS.CHARACTER_STATES.DASHING_LEFT);
    }
  }
  keydownRight() {
    this.#states__not_idle();
    if(this.states.has(CONSTANTS.CHARACTER_STATES.GRIPPING_RIGHT))
      return;
    this.states.add(CONSTANTS.CHARACTER_STATES.MOVING_RIGHT);
    this.states.delete(CONSTANTS.CHARACTER_STATES.MOVING_LEFT);
    this.states.delete(CONSTANTS.CHARACTER_STATES.GRIPPING_LEFT);
    if (this.states.has(CONSTANTS.CHARACTER_STATES.WAITING_KEYPRESS_RIGHT)) {
      this.states.delete(CONSTANTS.CHARACTER_STATES.WAITING_KEYPRESS_RIGHT);
      this.states.add(CONSTANTS.CHARACTER_STATES.DASHING_RIGHT);
    }
  }
  keyupLeft() {
    this.states.add(CONSTANTS.CHARACTER_STATES.WAITING_KEYPRESS_LEFT);
    setTimeout(() => {
      this.states.delete(CONSTANTS.CHARACTER_STATES.WAITING_KEYPRESS_LEFT);
    }, GAME.PARAMETERS.DASH_THRESHHOLD_MS);
  }
  keyupRight() {
    this.states.add(CONSTANTS.CHARACTER_STATES.WAITING_KEYPRESS_RIGHT);
    setTimeout(() => {
      this.states.delete(CONSTANTS.CHARACTER_STATES.WAITING_KEYPRESS_RIGHT);
    }, GAME.PARAMETERS.DASH_THRESHHOLD_MS);
  }
  noKey() {
    this.states.delete(CONSTANTS.CHARACTER_STATES.MOVING_RIGHT);
    this.states.delete(CONSTANTS.CHARACTER_STATES.MOVING_LEFT);
  }
  #computeMovement() {
    // HORIZONTAL MOVEMENT
    if (this.states.has(CONSTANTS.CHARACTER_STATES.IMPULSING_LEFT)) {
      this.velocity.x = -this.DASHING_DISTANCE / 2;
      this.states.delete(CONSTANTS.CHARACTER_STATES.IMPULSING_LEFT);
    }
    else if (this.states.has(CONSTANTS.CHARACTER_STATES.IMPULSING_RIGHT)) {
      this.velocity.x = this.DASHING_DISTANCE / 2;
      this.states.delete(CONSTANTS.CHARACTER_STATES.IMPULSING_RIGHT);
    }
    else if (this.states.has(CONSTANTS.CHARACTER_STATES.DASHING_LEFT)) {
      this.velocity.x = -this.DASHING_DISTANCE;
      this.states.delete(CONSTANTS.CHARACTER_STATES.DASHING_LEFT);
      // this.states.add(CONSTANTS.CHARACTER_STATES.MOVING_LEFT);
    }
    else if (this.states.has(CONSTANTS.CHARACTER_STATES.DASHING_RIGHT)) {
      this.velocity.x = this.DASHING_DISTANCE;
      this.states.delete(CONSTANTS.CHARACTER_STATES.DASHING_RIGHT);
      // this.states.add(CONSTANTS.CHARACTER_STATES.MOVING_RIGHT);
    }
    else if (this.states.has(CONSTANTS.CHARACTER_STATES.MOVING_LEFT)) {
      if (this.velocity.x < -this.MAX_VELOCITY) {
        // DASHES
        this.velocity.x += this.ACCELERATION * GAME.PARAMETERS.FULL_STOP;
        this.velocity.x = Math.min(this.velocity.x, -this.ACCELERATION);
      } else {
        this.velocity.x =
          this.velocity.x > 0
            ? this.velocity.x - this.ACCELERATION * GAME.PARAMETERS.FULL_STOP
            : this.velocity.x - this.ACCELERATION;
        this.velocity.x = Math.max(this.velocity.x, -this.MAX_VELOCITY);
      }
    }
    else if (this.states.has(CONSTANTS.CHARACTER_STATES.MOVING_RIGHT)) {
      if (this.velocity.x > this.MAX_VELOCITY) {
        // DASHES
        this.velocity.x -= this.ACCELERATION * GAME.PARAMETERS.FULL_STOP;
        this.velocity.x = Math.max(this.velocity.x, this.ACCELERATION);
      } else {
        this.velocity.x =
          this.velocity.x < 0
            ? this.velocity.x + this.ACCELERATION * GAME.PARAMETERS.FULL_STOP
            : this.velocity.x + this.ACCELERATION;
        this.velocity.x = Math.min(this.velocity.x, this.MAX_VELOCITY);
      }
    }
    else {
      //INERTIA
      if (!this.states.has(CONSTANTS.CHARACTER_STATES.FALLING)) {
        this.velocity.x =
          this.velocity.x == 0
            ? 0
            : this.velocity.x < 0
              ? this.velocity.x + this.ACCELERATION * GAME.PARAMETERS.FULL_STOP
              : this.velocity.x - this.ACCELERATION * GAME.PARAMETERS.FULL_STOP;
        this.velocity.x =
          Math.abs(this.velocity.x) < this.ACCELERATION * GAME.PARAMETERS.FULL_STOP
            ? 0
            : this.velocity.x;
      }
    }
    // VERTICAL MOVEMENT
    if (this.is_gripping) {
      this.velocity.y = 0;
    }
    if (this.states.has(CONSTANTS.CHARACTER_STATES.IMPULSING_UP)) {
      this.states.delete(CONSTANTS.CHARACTER_STATES.IMPULSING_UP);
      this.velocity.y = this.JUMPING_POWER;
    }
    else if (this.states.has(CONSTANTS.CHARACTER_STATES.SLAMMING)) {
      this.states.delete(CONSTANTS.CHARACTER_STATES.SLAMMING);
      this.velocity.y = -this.MAX_VELOCITY * this.SIZE / 10;
    }
    else {
      // GRAVITY
      this.velocity.y -= GAME.PARAMETERS.GRAVITY * this.RESIZE_RATIO;
    }
  }
  #stayInBoundaries() {
    if (this.position.x + this.velocity.x <= this.BOUNDARIES.START_X) {
      //LEFT COLLISION
      this.velocity.x = 0;
      this.position.x = this.BOUNDARIES.START_X;
      this.states.delete(CONSTANTS.CHARACTER_STATES.MOVING_LEFT);
    }
    if (this.position.x + this.velocity.x + this.WIDTH >= this.BOUNDARIES.END_X) {
      //RIGHT COLLISION
      this.velocity.x = 0;
      this.position.x = this.BOUNDARIES.END_X - this.WIDTH;
      this.states.delete(CONSTANTS.CHARACTER_STATES.MOVING_RIGHT);
    }
    if (this.position.y - this.velocity.y + this.HEIGHT >= this.BOUNDARIES.END_Y) {
      //BOTTOM COLLISION
      this.velocity.y = 0;
      this.position.y = this.BOUNDARIES.END_Y - this.SIZE;
      this.#states__grounded();
    }
    if (this.position.y - this.velocity.y <= this.BOUNDARIES.START_Y) {
      //TOP COLLISION
      this.velocity.y = 0;
      this.position.y = this.BOUNDARIES.START_Y;
    }
  }
  #resolveCollisions(obstacles = new Set()) {
    // CROUCHING
    if (this.states.has(CONSTANTS.CHARACTER_STATES.STANDING)) {
      const collisionBox = new CollisionBox(this.position.x, this.position.y - this.HEIGHT, this.WIDTH, this.HEIGHT);
      let collides = false;
      obstacles.forEach((element) => {
        collides &= collisionBox.contains(element);
      });
      this.states.delete(CONSTANTS.CHARACTER_STATES.STANDING);
      if (collides) {
        this.states.add(CONSTANTS.CHARACTER_STATES.CROUCHING);
      }
    }

    const hitBox = new SolidRectangle(
      this.position.x,
      this.position.y,
      this.WIDTH,
      this.HEIGHT
    );

    let move = obstacles.size === 0;

    obstacles.forEach((obstacle) => {
      switch (hitBox.contains({ x: this.velocity.x, y: -this.velocity.y }, obstacle)) {
        case CONSTANTS.COLLISION.RIGHT:
          if (this.is_airborne)
            this.#states__gripping_right();
          if(this.is_gripping)
            this.velocity.y = 0;
          this.velocity.x = 0;
          this.position.x = obstacle.START_X - this.SIZE;
          this.position.y = this.position.rawY - this.velocity.y;
          break;
        case CONSTANTS.COLLISION.LEFT:
          if (this.is_airborne)
            this.#states__gripping_left();
          if(this.is_gripping)
            this.velocity.y = 0;
          this.velocity.x = 0;
          this.position.x = obstacle.END_X;
          this.position.y = this.position.rawY - this.velocity.y;
          break;
        case CONSTANTS.COLLISION.TOP:
          this.velocity.y = 0;
          this.position.x = this.position.rawX + this.velocity.x;
          this.position.y = obstacle.END_Y;
          break;
        case CONSTANTS.COLLISION.BOTTOM:
          if (!this.states.has(CONSTANTS.CHARACTER_STATES.DROPPING)) {
            this.velocity.y = 0;
            this.position.x = this.position.rawX + this.velocity.x;
            this.position.y = obstacle.START_Y - this.SIZE;
            this.#states__grounded();
          } else {
            move = true;
            this.states.delete(CONSTANTS.CHARACTER_STATES.DROPPING);
            this.states.add(CONSTANTS.CHARACTER_STATES.FALLING);
            this.states.delete(CONSTANTS.CHARACTER_STATES.CROUCHING);
          }
          break;
        case CONSTANTS.COLLISION.CORNER_TOP_RIGHT:
          this.velocity.x = 0;
          this.velocity.y = 0;
          this.position.x = obstacle.START_X - this.SIZE;
          this.position.y = obstacle.END_Y;
          break;
        case CONSTANTS.COLLISION.CORNER_BOTTOM_RIGHT:
          if (!this.states.has(CONSTANTS.CHARACTER_STATES.DROPPING)) {
            this.velocity.x = 0;
            this.velocity.y = 0;
            this.position.x = obstacle.START_X - this.SIZE;
            this.position.y = obstacle.START_Y - this.SIZE;
            this.#states__grounded();
          }
          else {
            move = true;
            this.states.delete(CONSTANTS.CHARACTER_STATES.DROPPING);
            this.states.add(CONSTANTS.CHARACTER_STATES.FALLING);
          }
          break;
        case CONSTANTS.COLLISION.CORNER_BOTTOM_LEFT:
          if (!this.states.has(CONSTANTS.CHARACTER_STATES.DROPPING)) {
            this.velocity.x = 0;
            this.velocity.y = 0;
            this.position.x = obstacle.END_X;
            this.position.y = obstacle.START_Y - this.SIZE;
            this.#states__grounded();
          }
          else {
            move = true;
            this.states.delete(CONSTANTS.CHARACTER_STATES.DROPPING);
            this.states.add(CONSTANTS.CHARACTER_STATES.FALLING);
          }
          break;
        case CONSTANTS.COLLISION.CORNER_TOP_LEFT:
          this.velocity.x = 0;
          this.velocity.y = 0;
          this.position.x = obstacle.END_X;
          this.position.y = obstacle.END_Y;
          break;
        case CONSTANTS.COLLISION.NONE:
          move = !this.is_gripping && true;
          break;
      }
    })
    if (move) {
      if (this.is_airborne)
        this.#states__falling();
      this.position.x = this.position.rawX + this.velocity.x;
      this.position.y = this.position.rawY - this.velocity.y;
    }
  }
  #updateIdleAnimation() {
    if(this.idle_timeout === null &&
       this.states.has(CONSTANTS.CHARACTER_STATES.GROUNDED) &&
    (this.states.size === 1 || this.states.has(CONSTANTS.CHARACTER_STATES.CROUCHED) && this.states.size === 2)){
      this.idle_timeout = setTimeout(() => {
        this.#states__idle();
        clearTimeout(this.idle_timeout);
        this.idle_timeout = null;
      }, GAME.PARAMETERS.IDLE_TIMER_MS);
    }
  }
  get is_airborne() {
    return [CONSTANTS.CHARACTER_STATES.FALLING,
    CONSTANTS.CHARACTER_STATES.DROPPING,
    CONSTANTS.CHARACTER_STATES.IMPULSING_UP,
    CONSTANTS.CHARACTER_STATES.JUMPING,
    CONSTANTS.CHARACTER_STATES.DOUBLE_JUMPING].some(state => this.states.has(state))
  }
  get is_crouching() {
    return this.states.has(CONSTANTS.CHARACTER_STATES.CROUCHING);
  }
  get is_gripping() {
    return [CONSTANTS.CHARACTER_STATES.GRIPPING_LEFT,
    CONSTANTS.CHARACTER_STATES.GRIPPING_RIGHT].some(state => this.states.has(state))
  }
  get WIDTH() {
    return this.is_gripping ? this.SIZE / 2 : this.SIZE;
  }
  get HEIGHT() {
    return this.is_crouching ? this.SIZE / 2 : this.SIZE;
  }
  set WIDTH(val) {
    this._width = val;
  }
  set HEIGHT(val) {
    this._height = val;
  }
  #states__falling() {
    this.states.delete(CONSTANTS.CHARACTER_STATES.IMPULSING_UP);
    this.states.delete(CONSTANTS.CHARACTER_STATES.DROPPING);
    this.states.add(CONSTANTS.CHARACTER_STATES.FALLING);
  }
  #states__grounded() {
    this.#states__not_airborne();
    this.states.add(CONSTANTS.CHARACTER_STATES.GROUNDED);
  }
  #states__idle() {
    this.states.add(CONSTANTS.CHARACTER_STATES.IDLE);
    const arr =
      [CONSTANTS.CHARACTER_STATES.RESTING,
      CONSTANTS.CHARACTER_STATES.SLEEPING,
      CONSTANTS.CHARACTER_STATES.EATING,
      CONSTANTS.CHARACTER_STATES.PLAYING,
      CONSTANTS.CHARACTER_STATES.HIDING]
    this.states.add(arr[Math.floor(Math.random() * arr.length)]);
  }
  #states__not_idle() {
    if (this.states.has(CONSTANTS.CHARACTER_STATES.IDLE)) {
      this.states.delete(CONSTANTS.CHARACTER_STATES.IDLE);
      this.states.delete(CONSTANTS.CHARACTER_STATES.RESTING);
      this.states.delete(CONSTANTS.CHARACTER_STATES.SLEEPING);
      this.states.delete(CONSTANTS.CHARACTER_STATES.EATING);
      this.states.delete(CONSTANTS.CHARACTER_STATES.PLAYING);
      this.states.delete(CONSTANTS.CHARACTER_STATES.HIDING);
    }
  }
  #states__not_airborne() {
    this.states.delete(CONSTANTS.CHARACTER_STATES.IMPULSING_UP);
    this.states.delete(CONSTANTS.CHARACTER_STATES.IMPULSING_LEFT);
    this.states.delete(CONSTANTS.CHARACTER_STATES.IMPULSING_RIGHT);
    this.states.delete(CONSTANTS.CHARACTER_STATES.JUMPING);
    this.states.delete(CONSTANTS.CHARACTER_STATES.DOUBLE_JUMPING);
    this.states.delete(CONSTANTS.CHARACTER_STATES.FALLING);
    this.states.delete(CONSTANTS.CHARACTER_STATES.DROPPING);
    this.states.delete(CONSTANTS.CHARACTER_STATES.GRIPPED);
  }
  #states__gripping_left() {
    if (!this.states.has(CONSTANTS.CHARACTER_STATES.GRIPPED)) {
      this.#states__not_airborne();
      this.states.add(CONSTANTS.CHARACTER_STATES.GRIPPING_LEFT);
      this.states.add(CONSTANTS.CHARACTER_STATES.GRIPPED);
      if (this.gripping_timeout === null) {
        this.gripping_timeout = setTimeout(() => {
          if (this.states.has(CONSTANTS.CHARACTER_STATES.GRIPPING_LEFT)) {
            this.states.delete(CONSTANTS.CHARACTER_STATES.GRIPPING_LEFT);
            this.states.add(CONSTANTS.CHARACTER_STATES.FALLING);
            this.states.add(CONSTANTS.CHARACTER_STATES.IMPULSING_RIGHT);
          }
          clearTimeout(this.gripping_timeout);
          this.gripping_timeout = null;
        }, GAME.PARAMETERS.GRIPPING_TIMER_MS);
      }
    }
  }
  #states__gripping_right() {
    if (!this.states.has(CONSTANTS.CHARACTER_STATES.GRIPPED)) {
      this.#states__not_airborne();
      this.states.add(CONSTANTS.CHARACTER_STATES.GRIPPING_RIGHT);
      this.states.add(CONSTANTS.CHARACTER_STATES.GRIPPED);
      if (this.gripping_timeout === null) {
        this.gripping_timeout = setTimeout(() => {
          if (this.states.has(CONSTANTS.CHARACTER_STATES.GRIPPING_RIGHT)) {
            this.states.delete(CONSTANTS.CHARACTER_STATES.GRIPPING_RIGHT);
            this.states.add(CONSTANTS.CHARACTER_STATES.FALLING);
            this.states.add(CONSTANTS.CHARACTER_STATES.IMPULSING_LEFT);
          }
          clearTimeout(this.gripping_timeout);
          this.gripping_timeout = null;
        }, GAME.PARAMETERS.GRIPPING_TIMER_MS);
      }
    }
  }
}
