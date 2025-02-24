export default class Constants{
    constructor(){
        this.min_height=360;
        this.min_width=480;
        this.framerate=1000/24;
        this.gameStates=Object.freeze({
            "SELECTING": Symbol("selecting"),
            "PLAYING": Symbol("playing"),
            "PAUSED":Symbol("paused"),
            "OVER": Symbol("over")
        });
        this.gameTypes=Object.freeze({
            "FEED": Symbol("feed"),
            "PLAY": Symbol("play"),
            "PAT": Symbol("pat")
        });
        this.animalTypes=Object.freeze({
            "NIT": {
                max_speed: 25,
                acceleration: 1.39,
                type: "cat",
                size: 30,
                name: "Nit"
            },
            "DIA": {
                max_speed: 30,
                acceleration: 2.5,
                type: "cat",
                size: 20,
                name: "Dia"
            }
        });
        this.direction=Object.freeze({
            up: "up",
            down: "down",
            left: "left",
            right: "right"
        });
        this.keys=Object.freeze({
            up: false,
            down: false,
            left: false,
            right: false
        });
        this.axis=Object.freeze({
            x: 0,
            y: 0
        })

    }
}