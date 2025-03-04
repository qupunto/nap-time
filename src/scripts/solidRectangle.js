import { CollisionBox } from "./CollisionBox.js";
import { CONSTANTS } from "./constants.js";

export class SolidRectangle extends CollisionBox {
  constructor(x, y, width, height, style = {}) {
    super(x, y, width, height);
    this.style = style;
  }

  // Modified collision detection with swept AABB to handle tunneling.
  // "velocity" is the displacement vector for the moving object (this),
  // and "box" is the static object.
  contains(box,v={x:0,y:0}){
    return super.contains(box,v);
  }
  collides(box, v={x:0,y:0}) {
    v = super.collides(box, v);
    if(v === null)
        return CONSTANTS.COLLISION.NONE;

    let xEntry, xExit, yEntry, yExit;
    
    // Calculate entry and exit distances along the x-axis.
    if (v.x > 0) {
      xEntry = box.START_X - this.END_X;
      xExit  = box.END_X - this.START_X;
    } else if (v.x < 0) {
      xEntry = box.END_X - this.START_X;
      xExit  = box.START_X - this.END_X;
    } else {
      // No horizontal movement.
      xEntry = -Infinity;
      xExit  = Infinity;
    }
    
    // Calculate entry and exit distances along the y-axis.
    if (v.y > 0) {
      yEntry = box.START_Y - this.END_Y;
      yExit  = box.END_Y - this.START_Y;
    } else if (v.y < 0) {
      yEntry = box.END_Y - this.START_Y;
      yExit  = box.START_Y - this.END_Y;
    } else {
      // No vertical movement.
      yEntry = -Infinity;
      yExit  = Infinity;
    }
    
    // Compute the times at which the collision enters and exits for each axis.
    let tEntryX = (v.x !== 0) ? (xEntry / v.x) : -Infinity;
    let tEntryY = (v.y !== 0) ? (yEntry / v.y) : -Infinity;
    let tExitX  = (v.x !== 0) ? (xExit  / v.x) : Infinity;
    let tExitY  = (v.y !== 0) ? (yExit  / v.y) : Infinity;
    
    // The overall times of collision entry and exit.
    let tEntry = Math.max(tEntryX, tEntryY);
    let tExit  = Math.min(tExitX, tExitY);
    
    // No collision if:
    //   • The entry time is after the exit time,
    //   • The collision happens in the past,
    //   • Or the collision occurs after the movement interval.
    if (tEntry > tExit || tEntry < 0 || tEntry > 1) {
      return CONSTANTS.COLLISION.NONE;
    }
    
    // Determine which axis collides last; that side is where the collision occurs.
    if (tEntryX > tEntryY) {
      return (v.x > 0) ? CONSTANTS.COLLISION.RIGHT : CONSTANTS.COLLISION.LEFT;
    } else if (tEntryY > tEntryX) {
      return (v.y > 0) ? CONSTANTS.COLLISION.BOTTOM : CONSTANTS.COLLISION.TOP;
    } else {
      // If both times are equal, handle as a corner collision.
      if (v.x > 0 && v.y > 0) {
        return CONSTANTS.COLLISION.CORNER_TOP_LEFT;
      } else if (v.x > 0 && v.y < 0) {
        return CONSTANTS.COLLISION.CORNER_BOTTOM_LEFT;
      } else if (v.x < 0 && v.y > 0) {
        return CONSTANTS.COLLISION.CORNER_TOP_RIGHT;
      } else if (v.x < 0 && v.y < 0) {
        return CONSTANTS.COLLISION.CORNER_BOTTOM_RIGHT;
      } else {
        return CONSTANTS.COLLISION.NONE;
      }
    }
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
