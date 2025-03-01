import { CONSTANTS } from "./CONSTANTS.js";
import { CollisionBox } from "./CollisionBox.js";
import { SolidRectangle } from "./SolidRectangle.js";
import { applyRatio } from "./helpers.js";
import { Animal } from "./Animal.js";

export class Character {
  constructor(animal = new Animal(), initialX, initialY, boundaries) {
    this.SIZE_RATIO = boundaries ? boundaries.WIDTH / CONSTANTS.SCREEN_SETTINGS.WIDTH : 1;
    Object.assign(this, applyRatio(animal, this.SIZE_RATIO));
    this.BOUNDARIES = boundaries;
    this.position = { x: initialX, y: initialY };
    this.velocity = { x: 0, y: 0 };
    this.idle_count = 0;
    this.states = new Set([CONSTANTS.CHARACTER_STATES.GROUNDED]);
  }
  update(terrain = new Set()) {
    this.#computeMovement();
    this.#stayInBoundaries();
    this.#resolveCollisions(terrain);
    this.#updateIdleAnimation();
  }
  draw(ctx) {
    console.log(this.position.x,this.position.y, this.velocity.x, this.velocity.y);
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
      this.states.add(CONSTANTS.CHARACTER_STATES.IMPULSING);
      this.states.add(CONSTANTS.CHARACTER_STATES.DOUBLE_JUMPING);
    }
    if(this.states.has(CONSTANTS.CHARACTER_STATES.GROUNDED)) {
      this.states.delete(CONSTANTS.CHARACTER_STATES.GROUNDED);
      this.states.add(CONSTANTS.CHARACTER_STATES.JUMPING);
      this.states.add(CONSTANTS.CHARACTER_STATES.IMPULSING);
    }
    if(this.states.has(CONSTANTS.CHARACTER_STATES.GRIPPING)) {
      this.states.delete(CONSTANTS.CHARACTER_STATES.GRIPPING);
      this.states.add(CONSTANTS.CHARACTER_STATES.JUMPING);
      this.states.add(CONSTANTS.CHARACTER_STATES.IMPULSING);
    }
    if (this.states.has(CONSTANTS.CHARACTER_STATES.CROUCHED)) {
      this.states.delete(CONSTANTS.CHARACTER_STATES.CROUCHED);
      this.states.add(CONSTANTS.CHARACTER_STATES.STANDING);
    }
  }
  keydownDown() {
    this.#states__not_idle();
    if (this.states.has(CONSTANTS.CHARACTER_STATES.JUMPING)){
      this.states.delete(CONSTANTS.CHARACTER_STATES.JUMPING);
      this.states.add(CONSTANTS.CHARACTER_STATES.SLAMMING);
    }
    if (this.states.has(CONSTANTS.CHARACTER_STATES.DOUBLE_JUMPING)){
      this.states.delete(CONSTANTS.CHARACTER_STATES.DOUBLE_JUMPING);
      this.states.add(CONSTANTS.CHARACTER_STATES.SLAMMING);
    }
    if (this.states.has(CONSTANTS.CHARACTER_STATES.CROUCHED)) {
      this.states.delete(CONSTANTS.CHARACTER_STATES.CROUCHED);
      this.states.delete(CONSTANTS.CHARACTER_STATES.GROUNDED);
      this.states.add(CONSTANTS.CHARACTER_STATES.DROPPING);
    }
    if (this.states.has(CONSTANTS.CHARACTER_STATES.GROUNDED))
    {
      this.states.add(CONSTANTS.CHARACTER_STATES.CROUCHING);
    }
  }
  keydownLeft() {
    this.#states__not_idle();
    this.states.add(CONSTANTS.CHARACTER_STATES.MOVING_LEFT);
    this.states.delete(CONSTANTS.CHARACTER_STATES.MOVING_RIGHT);
    if(this.states.has(CONSTANTS.CHARACTER_STATES.WAITING_KEYPRESS_LEFT)){
      this.states.delete(CONSTANTS.CHARACTER_STATES.WAITING_KEYPRESS_LEFT);
      this.states.add(CONSTANTS.CHARACTER_STATES.DASHING_LEFT);
    }
  }
  keydownRight() {
    this.#states__not_idle();
    this.states.add(CONSTANTS.CHARACTER_STATES.MOVING_RIGHT);
    this.states.delete(CONSTANTS.CHARACTER_STATES.MOVING_LEFT);
    if(this.states.has(CONSTANTS.CHARACTER_STATES.WAITING_KEYPRESS_RIGHT)){
      this.states.delete(CONSTANTS.CHARACTER_STATES.WAITING_KEYPRESS_RIGHT);
      this.states.add(CONSTANTS.CHARACTER_STATES.DASHING_RIGHT);
    }
  }
  keyupLeft(){
    this.states.add(CONSTANTS.CHARACTER_STATES.WAITING_KEYPRESS_LEFT);
    setTimeout(()=>{
      this.states.delete(CONSTANTS.CHARACTER_STATES.WAITING_KEYPRESS_LEFT);
    }, CONSTANTS.GAME_SETTINGS.DASH_THRESHHOLD_MS);
  }
  keyupRight(){
    this.states.add(CONSTANTS.CHARACTER_STATES.WAITING_KEYPRESS_RIGHT);
    setTimeout(()=>{
      this.states.delete(CONSTANTS.CHARACTER_STATES.WAITING_KEYPRESS_RIGHT);
    }, CONSTANTS.GAME_SETTINGS.DASH_THRESHHOLD_MS);
  }
  noKey() {
    this.states.delete(CONSTANTS.CHARACTER_STATES.MOVING_RIGHT);
    this.states.delete(CONSTANTS.CHARACTER_STATES.MOVING_LEFT);
  }
  #computeMovement() {
    // HORIZONTAL MOVEMENT
    if(this.states.has(CONSTANTS.CHARACTER_STATES.DASHING_LEFT)){
      this.velocity.x = -this.DASHING_DISTANCE;
      this.states.delete(CONSTANTS.CHARACTER_STATES.DASHING_LEFT);
      this.states.add(CONSTANTS.CHARACTER_STATES.MOVING_LEFT);
    }
    else if(this.states.has(CONSTANTS.CHARACTER_STATES.DASHING_RIGHT)){
      this.velocity.x = this.DASHING_DISTANCE;
      this.states.delete(CONSTANTS.CHARACTER_STATES.DASHING_RIGHT);
      this.states.add(CONSTANTS.CHARACTER_STATES.MOVING_RIGHT);
    }
    else if(this.states.has(CONSTANTS.CHARACTER_STATES.MOVING_LEFT)) {
      if (this.velocity.x < -this.MAX_VELOCITY){
        this.velocity.x += this.ACCELERATION * CONSTANTS.GAME_SETTINGS.FULL_STOP;
        this.velocity.x = Math.min(this.velocity.x, -this.ACCELERATION);
      }else{
        this.velocity.x =
        this.velocity.x > 0
          ? this.velocity.x - this.ACCELERATION * CONSTANTS.GAME_SETTINGS.FULL_STOP
          : this.velocity.x - this.ACCELERATION;
      this.velocity.x = Math.max(this.velocity.x, -this.MAX_VELOCITY);
      }
    } 
    else if(this.states.has(CONSTANTS.CHARACTER_STATES.MOVING_RIGHT)) {
      if (this.velocity.x > this.MAX_VELOCITY){
        this.velocity.x -= this.ACCELERATION * CONSTANTS.GAME_SETTINGS.FULL_STOP;
        this.velocity.x = Math.max(this.velocity.x, this.ACCELERATION);
      }else{
        this.velocity.x =
        this.velocity.x < 0
          ? this.velocity.x + this.ACCELERATION * CONSTANTS.GAME_SETTINGS.FULL_STOP
          : this.velocity.x + this.ACCELERATION;
      this.velocity.x = Math.min(this.velocity.x, this.MAX_VELOCITY);
      }
    }
    else {
      //INERTIA
      this.velocity.x =
        this.velocity.x == 0
          ? 0
          : this.velocity.x < 0
            ? this.velocity.x + this.ACCELERATION * CONSTANTS.GAME_SETTINGS.FULL_STOP
            : this.velocity.x - this.ACCELERATION * CONSTANTS.GAME_SETTINGS.FULL_STOP;
      this.velocity.x =
        Math.abs(this.velocity.x) < this.ACCELERATION * CONSTANTS.GAME_SETTINGS.FULL_STOP
          ? 0
          : this.velocity.x;
    }
    // VERTICAL MOVEMENT
    if(this.states.has(CONSTANTS.CHARACTER_STATES.IMPULSING)) {
      this.states.delete(CONSTANTS.CHARACTER_STATES.IMPULSING);
      this.velocity.y = this.JUMPING_POWER;
    }
    else if(this.states.has(CONSTANTS.CHARACTER_STATES.SLAMMING)) {
      this.states.delete(CONSTANTS.CHARACTER_STATES.SLAMMING);
      this.velocity.y = -this.MAX_VELOCITY * this.SIZE / 10;
    }
    else{
      // GRAVITY
      this.velocity.y -= CONSTANTS.GAME_SETTINGS.GRAVITY*this.SIZE_RATIO;
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
      this.position.y = this.BOUNDARIES.END_Y - this.HEIGHT;
      this.#states__grounded();
      this.states.delete(CONSTANTS.CHARACTER_STATES.DROPPING);
    }
    if (this.position.y - this.velocity.y <= this.BOUNDARIES.START_Y) {
      //TOP COLLISION
      this.velocity.y = 0;
      this.position.y = this.BOUNDARIES.START_Y;
    }
  }
  #resolveCollisions(obstacles= new Set()) {
    // CROUCHING
    if(this.states.has(CONSTANTS.CHARACTER_STATES.CROUCHING)){
      this.states.delete(CONSTANTS.CHARACTER_STATES.CROUCHING);
      this.states.add(CONSTANTS.CHARACTER_STATES.CROUCHED);
      this.HEIGHT = this.SIZE / 2;
      this.position.y += this.SIZE / 2;
    }
    else if (this.states.has(CONSTANTS.CHARACTER_STATES.STANDING)){
      const collisionBox = new CollisionBox(this.position.x, this.position.y - this.SIZE/2,this.WIDTH, this.HEIGHT);
      let collides = false;
      obstacles.forEach((element) => {
        collides &= collisionBox.contains(element);
      });
      this.states.delete(CONSTANTS.CHARACTER_STATES.STANDING);
      if(collides){
        this.states.add(CONSTANTS.CHARACTER_STATES.CROUCHED);
      }
      else{
        this.HEIGHT = this.SIZE;
        this.position.y -= this.SIZE/2;
      }
    }
    else if(this.states.has(CONSTANTS.CHARACTER_STATES.DROPPING)){
      this.HEIGHT = this.SIZE;
    }

    const hitBox = new SolidRectangle(
      this.position.x,
      this.position.y,
      this.WIDTH,
      this.HEIGHT
    );

    let move = obstacles.size===0;
    console.log(obstacles.size)

    obstacles.forEach((obstacle) => {
      switch (hitBox.contains({ x: this.velocity.x, y: -this.velocity.y }, obstacle)){
        case CONSTANTS.COLLISION.RIGHT:
          // console.log("ENTRA RIGHT");
          this.velocity.x = 0;
          this.position.x = obstacle.START_X - this.SIZE;
          this.position.y -= this.velocity.y;
          this.states.delete(CONSTANTS.CHARACTER_STATES.MOVING_RIGHT);
          break;
        case CONSTANTS.COLLISION.LEFT:
          // console.log("ENTRA LEFT");
          this.velocity.x = 0;
          this.position.x = obstacle.END_X;
          this.position.y -= this.velocity.y;
          this.states.delete(CONSTANTS.CHARACTER_STATES.MOVING_LEFT);
          break;
        case CONSTANTS.COLLISION.TOP:
          // console.log("ENTRA UP");
          this.velocity.y = 0;
          this.position.x += this.velocity.x;
          this.position.y = obstacle.END_Y;
          break;
        case CONSTANTS.COLLISION.BOTTOM:
          // console.log("ENTRA DOWN");
          if(!this.states.has(CONSTANTS.CHARACTER_STATES.DROPPING)){
            this.velocity.y = 0;
            this.position.x += this.velocity.x;
            this.position.y = obstacle.START_Y - this.HEIGHT;
            this.#states__grounded();
          }else{
            move = true;
            this.states.delete(CONSTANTS.CHARACTER_STATES.DROPPING);
            this.states.add(CONSTANTS.CHARACTER_STATES.FALLING);
          }
          break;
        case CONSTANTS.COLLISION.CORNER_TOP_RIGHT:
          // console.log("ENTRA CORNER_TOP_RIGHT");
          this.velocity.x = 0;
          this.velocity.y = 0;
          this.position.x = obstacle.START_X - this.SIZE;
          this.position.y = obstacle.END_Y;
          this.states.delete(CONSTANTS.CHARACTER_STATES.MOVING_RIGHT);
          break;
        case CONSTANTS.COLLISION.CORNER_BOTTOM_RIGHT:
          // console.log("ENTRA CORNER_BOTTOM_RIGHT");
          if(!this.states.has(CONSTANTS.CHARACTER_STATES.DROPPING)){
            this.velocity.x = 0;
            this.velocity.y = 0;
            this.position.x = obstacle.START_X - this.SIZE;
            this.position.y = obstacle.START_Y - this.SIZE;
            this.states.delete(CONSTANTS.CHARACTER_STATES.MOVING_RIGHT);
            this.#states__grounded();
          }
          else{
            move = true;
            this.states.delete(CONSTANTS.CHARACTER_STATES.DROPPING);
            this.states.add(CONSTANTS.CHARACTER_STATES.FALLING);
          }
          break;
        case CONSTANTS.COLLISION.CORNER_BOTTOM_LEFT:
          // console.log("ENTRA CORNER_BOTTOM_LEFT");
          if(!this.states.has(CONSTANTS.CHARACTER_STATES.DROPPING)){
            this.velocity.x = 0;
            this.velocity.y = 0;
            this.position.x = obstacle.END_X;
            this.position.y = obstacle.START_Y - this.SIZE;
            this.states.delete(CONSTANTS.CHARACTER_STATES.MOVING_LEFT);
            this.#states__grounded();
          }
          else{
            move = true;
            this.states.delete(CONSTANTS.CHARACTER_STATES.DROPPING);
            this.states.add(CONSTANTS.CHARACTER_STATES.FALLING);
          }
          break;
        case CONSTANTS.COLLISION.CORNER_TOP_LEFT:
          // console.log("ENTRA CORNER_TOP_LEFT");
          this.velocity.x = 0;
          this.velocity.y = 0;
          this.position.x = obstacle.END_X;
          this.position.y = obstacle.END_Y;
          this.states.delete(CONSTANTS.CHARACTER_STATES.MOVING_LEFT);
          break;
        case CONSTANTS.COLLISION.NONE:
          // console.log("ENTRA",CONSTANTS.COLLISION.NONE)
          move = true;
          break;
      }
    })
    if(move)
    {
      this.position.x = this.position.x + this.velocity.x;
      this.position.y = this.position.y - this.velocity.y;
    }
  }
  #updateIdleAnimation() {
    this.idle_count = this.states.has(CONSTANTS.CHARACTER_STATES.GROUNDED) && this.states.SIZE === 1 ? this.idle_count + 1 : 0;
    if (this.idle_count > CONSTANTS.GAME_SETTINGS.IDLE_COUNTER)
      this.#states__idle();
  }
  #states__grounded(){
    this.states.delete(CONSTANTS.CHARACTER_STATES.JUMPING);
    this.states.delete(CONSTANTS.CHARACTER_STATES.DOUBLE_JUMPING);
    this.states.delete(CONSTANTS.CHARACTER_STATES.FALLING);
    this.states.add(CONSTANTS.CHARACTER_STATES.GROUNDED);
  }
  #states__idle(){
    //console.log("IDLE", this.states);
    this.states.add(CONSTANTS.CHARACTER_STATES.IDLE);
    const arr = 
    [CONSTANTS.CHARACTER_STATES.RESTING,
    CONSTANTS.CHARACTER_STATES.SLEEPING,
    CONSTANTS.CHARACTER_STATES.EATING,
    CONSTANTS.CHARACTER_STATES.PLAYING,
    CONSTANTS.CHARACTER_STATES.HIDING]
      this.states.add(arr[Math.floor(Math.random() * arr.length)]);
  }
  #states__not_idle(){
    if(this.states.has(CONSTANTS.CHARACTER_STATES.IDLE)){
      //console.log("NOT IDLE", this.states);
      this.states.delete(CONSTANTS.CHARACTER_STATES.IDLE);
      this.states.delete(CONSTANTS.CHARACTER_STATES.RESTING);
      this.states.delete(CONSTANTS.CHARACTER_STATES.SLEEPING);
      this.states.delete(CONSTANTS.CHARACTER_STATES.EATING);
      this.states.delete(CONSTANTS.CHARACTER_STATES.PLAYING);
      this.states.delete(CONSTANTS.CHARACTER_STATES.HIDING);
    }
  }
}
