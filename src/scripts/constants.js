import { Animal } from "./Animal.js";
export const GAME  = Object.freeze({
  SYSTEM: {
    DEBUG: true,
  },
  SETTINGS: {
    FULL_STOP: 2,
    GRAVITY: 1,
    IDLE_TIMER_MS: 10000,
    DASH_THRESHHOLD_MS: 80,
    GRIPPING_TIMER_MS: 2000
  }, 
  SCREEN: {
    PADDING_LEFT: 5,
    PADDING_RIGHT: 5,
    PADDING_TOP: 5,
    PADDING_BOTTOM: 20,
    BACKGROUND_COLOR: "black",
    OUTSIDE_COLOR: "green",
    ASPECT_RATIO: 16 / 9,
    MIN_HEIGHT: 360,
    MIN_WIDTH: 480,
    WIDTH: 1920,
    HEIGHT: 1080,
    FRAMERATE: 1,
  },
  STATES: {
    SELECTING: "selecting",
    PLAYING: "playing",
    PAUSED: "paused",
    OVER: "over",
  },
  TYPES: {
    FEED: "feed",
    PLAY: "play",
    PAT: "pat",
  },
});
export const CONSTANTS = Object.freeze({
  CHARACTER_STATES: {
    //IDLE STATES
    IDLE: "idle",
    SLEEPING: "sleeping",
    RESTING: "resting",
    SLEEPING: "sleeping",
    EATING: "eating",
    PLAYING: "playing",
    HIDING: "hiding",
    //MOVEMENT STATES
    GROUNDED: "grounded",
    GRIPPED: "gripped",
    GRIPPING_LEFT: "gripping_left",
    GRIPPING_RIGHT: "gripping_right",
    MOVING_LEFT: "moving_left",
    MOVING_RIGHT: "moving_right",
    CROUCHED: "crouched",
    JUMPING: "jumping",
    DOUBLE_JUMPING: "double_jumping",
    FALLING: "falling",
    CLIMBING: "climbing",
    //TRIGGER STATES
    SLAMMING: "slamming",
    DROPPING: "dropping",
    CROUCHING: "crouching",
    IMPULSING_UP: "impulsing_up",
    IMPULSING_RIGHT: "impulsing_right",
    IMPULSING_LEFT: "impulsing_left",
    STANDING: "standing",
    WAITING_KEYPRESS_LEFT: "waiting_keypress_left",
    WAITING_KEYPRESS_RIGHT: "waiting_keypress_right",
    DASHING_LEFT: "dashing_left",
    DASHING_RIGHT: "dashing_right",
  },
  COLLISION: {
    TOP: "collision_top",
    BOTTOM: "collision_bottom",
    LEFT: "collision_left",
    RIGHT: "collision_right",
    FRONT: "collision_front",
    BACK: "collision_back",
    CORNER_TOP_RIGHT: "collision_corner_top_right",
    CORNER_BOTTOM_RIGHT: "collision_corner_bottom_right",
    CORNER_TOP_LEFT: "collision_corner_top_left",
    CORNER_BOTTOM_LEFT: "collision_corner_bottom_left",
    NONE: "collision_none",
  },
  DIRECTION: {
    UP: "direction_up",
    DOWN: "direction_down",
    LEFT: "direction_left",
    RIGHT: "direction_right",
    NONE: "direction_none",
  },
  ANIMAL_TYPES:{
    CAT:"cat",
    DOG:"dog",
    SHEEP:"sheep",
    BEAR: "bear",
    RACOON: "racoon",
    RABBIT: "rabbit",
    KANGAROO: "kangaroo",
    SNAKE: "snake",
  }
});
export const ANIMALS = Object.freeze({
  NIT: new Animal("Nit", CONSTANTS.ANIMAL_TYPES.CAT, "gray", 10, 0.5, 40, 15, 20),
  DIA: new Animal("Dia", CONSTANTS.ANIMAL_TYPES.CAT, "white", 12, 0.6, 25, 22, 30),
});