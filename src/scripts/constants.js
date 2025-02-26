export const constants = Object.freeze({
    full_stop: 4,
    gravity: 0.98,
    idle_counter: 500,
    min_height: 360,
    min_width: 480,
    framerate: 1000 / 24,
    gameStates: {
        SELECTING: "selecting",
        PLAYING: "playing",
        PAUSED: "paused",
        OVER: "over"
    },
    gameTypes: {
        FEED: "feed",
        PLAY: "play",
        PAT: "pat"
    },
    animalStates: {
        JUMPING: "jumping",
        DOUBLE_JUMPING: "double_jumping",
        SLAMMING: "slamming",
        CORUCHING: "crouching",
        RESTING: "resting",
        EATING: "eating",
        MOVING: "moving",
        IDLE: "idle",
        PLAYING: "playing",
        HIDING: "hiding",
        CLIMBING: "climbing"
    },
    direction: {
        UP: "up",
        DOWN: "down",
        LEFT: "left",
        RIGHT: "right"
    },
    animalTypes: {
        NIT: {
            max_speed: 15,
            acceleration: 0.5,
            type: "cat",
            size: 25,
            jumping_power: 22,
            name: "Nit",
            color: "gray"
        },
        DIA: {
            max_speed: 10,
            acceleration: 0.4,
            type: "cat",
            size: 50,
            jumping_power: 18,
            name: "Dia",
            color: "white"
        }
    },
});