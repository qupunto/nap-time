export const constants = Object.freeze({
    full_stop: 1,
    gravity: 1,
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
        CROUCHING: "crouching",
        RESTING: "resting",
        EATING: "eating",
        MOVING: "moving",
        IDLE: "idle",
        PLAYING: "playing",
        HIDING: "hiding",
        CLIMBING: "climbing"
    },
    collision: {
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
        NONE: "collision_none"
    },
    direction: {
        UP: "direction_up",
        DOWN: "direction_down",
        LEFT: "direction_left",
        RIGHT: "direction_right",
        NONE: "direction_none"
    },
    animalTypes: {
        NIT: {
            max_speed: 10,
            acceleration: 0.4,
            type: "cat",
            size: 50,
            jumping_power: 18,
            name: "Nit",
            color: "gray"
        },
        DIA: {
            max_speed: 15,
            acceleration: 0.5,
            type: "cat",
            size: 25,
            jumping_power: 22,
            name: "Dia",
            color: "white"
        }
    },
});
