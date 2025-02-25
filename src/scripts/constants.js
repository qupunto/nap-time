export default class Constants{
    constructor(){
        this.gravity=2;
        this.idle_counter=500;
        this.min_height=360;
        this.min_width=480;
        this.framerate=1000/24;
        this.gameStates=Object.freeze({
            SELECTING: Symbol("selecting"),
            PLAYING: Symbol("playing"),
            PAUSED:Symbol("paused"),
            OVER: Symbol("over")
        });
        this.gameTypes=Object.freeze({
            FEED: Symbol("feed"),
            PLAY: Symbol("play"),
            PAT: Symbol("pat")
        });
        this.animalStates=Object.freeze({
            JUMPING: Symbol("jumping"),
            DOUBLE_JUMPING: Symbol("double_jumping"),
            RESTING: Symbol("resting"),
            EATING: Symbol("eating"),
            MOVING: Symbol("moving"),
            IDLE: Symbol("idle"),
            PLAYING: Symbol("playing")
        });
        this.direction=Object.freeze({
            UP: Symbol("up"),
            DOWN: Symbol("down"),
            LEFT: Symbol("left"),
            RIGHT: Symbol("right")
        });
        this.animalTypes=Object.freeze({
            "NIT": {
                max_speed: 25,
                acceleration: 1,
                type: "cat",
                size: 40,
                jumping_power: 5,
                name: "Nit",
                color: "gray"
            },
            "DIA": {
                max_speed: 30,
                acceleration: 1.5,
                type: "cat",
                size: 25,
                jumping_power: 10,
                name: "Dia",
                color: "white"
            }
        });
    }
}