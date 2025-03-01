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
  }