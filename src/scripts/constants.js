<<<<<<< Updated upstream
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
=======
export default class Constants{
    constructor(){
        this.full_stop=5;
        this.gravity=0.98;
        this.idle_counter=500;
        this.min_height=360;
        this.min_width=480;
        this.framerate=1000/24;
        this.gameStates=Object.freeze({
            SELECTING: "selecting",
            PLAYING: "playing",
            PAUSED:"paused",
            OVER: "over"
        });
        this.gameTypes=Object.freeze({
            FEED: "feed",
            PLAY: "play",
            PAT: "pat"
        });
        this.animalStates=Object.freeze({
            JUMPING: "jumping",
            DOUBLE_JUMPING: "double_jumping",
            SLAMMING: "slamming",
            RESTING: "resting",
            EATING: "eating",
            MOVING: "moving",
            IDLE: "idle",
            PLAYING: "playing"
        });
        this.direction=Object.freeze({
            UP: "up",
            DOWN: "down",
            LEFT: "left",
            RIGHT: "right"
        });
        this.animalTypes=Object.freeze({
            "NIT": {
                max_speed: 10,
                acceleration: 0.4,
                type: "cat",
                size: 50,
                jumping_power: 18,
                name: "Nit",
                color: "gray"
            },
            "DIA": {
                max_speed: 15,
                acceleration: 0.5,
                type: "cat",
                size: 25,
                jumping_power: 22,
                name: "Dia",
                color: "white"
            }
        });
    }
}
>>>>>>> Stashed changes
