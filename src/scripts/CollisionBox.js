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
  
  // Continuous collision detection: checks the swept bounding box over the trajectory.
  collides(box, v = { x: 0, y: 0 }) {
    const sweptStartX = Math.min(this.START_X, this.START_X + v.x);
    const sweptEndX = Math.max(this.END_X, this.END_X + v.x);
    const sweptStartY = Math.min(this.START_Y, this.START_Y + v.y);
    const sweptEndY = Math.max(this.END_Y, this.END_Y + v.y);
    
    return sweptStartX < box.END_X &&
           sweptEndX > box.START_X &&
           sweptStartY < box.END_Y &&
           sweptEndY > box.START_Y;
  }
}