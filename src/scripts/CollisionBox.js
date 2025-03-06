import { CONSTANTS } from "./constants.js";

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

  collides(box, v = { x: 0, y: 0 }, dt = 1) {
    let xEntry, xExit, yEntry, yExit, xInvEntry, yInvEntry, xInvExit, yInvExit;
    // Check for horizontal (x-axis) overlap.
    if (this.END_X > box.START_X && this.START_X < box.END_X) {
      // Already overlapping in x; don't let x restrict the collision time.
      xEntry = -Infinity;
      xExit = Infinity;
    } else {
      // Compute x-axis times normally.
      if (v.x > 0) {
        xInvEntry = box.START_X - this.END_X;
        xInvExit = box.END_X - this.START_X;
        xEntry = xInvEntry / v.x;
        xExit = xInvExit / v.x;

      } else {
        xInvEntry = box.END_X - this.START_X;
        xInvExit = box.START_X - this.END_X;
        xEntry = xInvEntry / v.x;
        xExit = xInvExit / v.x;

      }
    }

    // Check for vertical (y-axis) overlap.
    if (this.END_Y > box.START_Y && this.START_Y < box.END_Y) {
      // Already overlapping in y; don't let y restrict the collision time.
      yEntry = -Infinity;
      yExit = Infinity;
    } else {
      // Compute y-axis times normally.
      if (v.y > 0) {
        yInvEntry = box.START_Y - this.END_Y;
        yInvExit = box.END_Y - this.START_Y;
        yEntry = yInvEntry / v.y;
        yExit = yInvExit / v.y;
      } else {
        yInvEntry = box.END_Y - this.START_Y;
        yInvExit = box.START_Y - this.END_Y;
        yEntry = yInvEntry / v.y;
        yExit = yInvExit / v.y;
      }
    }

    if(Math.abs(yEntry) == Infinity && xInvEntry === 0){
      if (v.x>0)
        return { collision: true, t: 0, normal: { x: -1, y: 0 } };
      else if (v.x<0)
        return { collision: true, t: 0, normal: { x: 1, y: 0 } };
    }
    if(Math.abs(xEntry) == Infinity && yInvEntry === 0){
      if (v.y>0)
        return { collision: true, t: 0, normal: { x: 0, y: -1 } };
      else if (v.y<0)
        return { collision: true, t: 0, normal: { x: 0, y: 1 } };
    }

    // Find the overall times of collision
    const entryTime = Math.max(xEntry, yEntry);
    const exitTime = Math.min(xExit, yExit);

    // Check if there is no collision
    if (entryTime > exitTime || (xEntry < 0 && yEntry < 0) || entryTime > dt) {
      return { collision: false, t: null, normal: { x: 0, y: 0 } };
    }

    // Optionally, calculate the collision normal
    const normalX = (xEntry < yEntry) ? 0 : (xInvEntry < 0) ? 1 : -1;
    const normalY = (xEntry > yEntry) ? 0 : (yInvEntry < 0) ? 1 : -1;

    return { collision: true, t: entryTime, normal: { x: normalX, y: normalY } };
  }

  direction(normal) {
    if (normal.x === 1) {
      if (normal.y === 1) {
        return CONSTANTS.COLLISION.TOP_LEFT;
      }
      else if (normal.y === 0) {
        return CONSTANTS.COLLISION.LEFT;
      }
      else if (normal.y === -1) {
        return CONSTANTS.COLLISION.BOTTOM_LEFT;
      }
    }
    else if (normal.x === 0) {
      if (normal.y === 1) {
        return CONSTANTS.COLLISION.TOP;
      }
      else if (normal.y === 0) {
        return CONSTANTS.COLLISION.NONE;
      }
      else if (normal.y === -1) {
        return CONSTANTS.COLLISION.BOTTOM;
      }
    }
    else if (normal.x === -1) {
      if (normal.y === 1) {
        return CONSTANTS.COLLISION.TOP_RIGHT;
      }
      else if (normal.y === 0) {
        return CONSTANTS.COLLISION.RIGHT;
      }
      else if (normal.y === -1) {
        return CONSTANTS.COLLISION.BOTTOM_RIGHT;
      }
    }
  }
}