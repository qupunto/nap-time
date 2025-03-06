import { CollisionBox } from "./CollisionBox.js";
import { CONSTANTS } from "./constants.js";

export class SolidRectangle extends CollisionBox {
  constructor(x, y, width, height, style = {}) {
    super(x, y, width, height);
    this.style = style;
  }

  contains(box, v = { x: 0, y: 0 }) {
    return super.contains(box, v);
  }

  collides(box, v = { x: 0, y: 0 }) {
    const collision = super.collides(box, v);
    return super.direction(collision.normal)

  }

  draw(ctx) {
    ctx.fillStyle = this.style?.fillStyle ?? 'pink';
    ctx.fillRect(
      this.START_X,
      this.START_Y,
      this.WIDTH,
      this.HEIGHT
    );
  }
}
