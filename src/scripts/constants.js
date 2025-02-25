export default class Constants{
    constructor(){
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
                max_speed: 15,
                acceleration: 1,
                type: "cat",
                size: 50,
                jumping_power: 15,
                name: "Nit",
                color: "gray"
            },
            "DIA": {
                max_speed: 20,
                acceleration: 1.5,
                type: "cat",
                size: 30,
                jumping_power: 20,
                name: "Dia",
                color: "white"
            }
        });
    }
}