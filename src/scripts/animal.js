import { CONSTANTS } from "./CONSTANTS.js";
export class Animal {
    constructor(name = "chi", type = CONSTANTS.ANIMAL_TYPES.CAT, color = "gray", maxVelocity = 10, acceleration = 0.5, size = 30, jumpingPower = 18, dashingDistance = 25) {
        this.NAME = name;
        this.TYPE = type;
        this.COLOR = color;
        this.MAX_VELOCITY = maxVelocity;
        this.ACCELERATION = acceleration;
        this.SIZE = size;
        this.JUMPING_POWER = jumpingPower;
        this.DASHING_DISTANCE = dashingDistance;
        this.WIDTH = size;
        this.HEIGHT = size;
    }
}