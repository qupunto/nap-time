import { GAME } from "./constants.js";

export class CollisionBox {
  constructor(x, y, width, height) {
    this.START_X = x;
    this.START_Y = y;
    this.END_X = x + width;
    this.END_Y = y + height;
    this.WIDTH = width;
    this.HEIGHT = height;
  }

  contains(box, v = { x: 0, y: 0 }) {
    return this.START_X + v.x < box.END_X &&
      this.END_X + v.x > box.START_X &&
      this.START_Y + v.y < box.END_Y &&
      this.END_Y + v.y > box.START_Y;
  }

  collides(box, v = { x: 0, y: 0 }) {
    const n = Math.abs(v.x) > Math.abs(v.y) ? Math.abs(Math.trunc(v.x / GAME.SYSTEM.VELOCITY_STEPS_PX))+1 : Math.abs(Math.trunc(v.y / GAME.SYSTEM.VELOCITY_STEPS_PX))+1;
    const stepX = v.x / n;
    const stepY = v.y / n;
    for (let i = 1; i <= n; i++) {
      const stepV = { x: stepX * i, y: stepY * i }
      if (this.contains(box, stepV)) 
        return stepV;
    }
    return null;
  }
}