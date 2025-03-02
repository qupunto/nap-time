import { CollisionBox } from "./CollisionBox.js";
import { CONSTANTS } from "./constants.js";

export class SolidRectangle extends CollisionBox {
    constructor(x, y, width, height, style = {}) {
        super(x, y, width, height);
        this.style = style;
    }
    contains(velocity, box) {
        // First, check if a collision occurs after moving.
        if (!super.contains(box, velocity))
            return CONSTANTS.COLLISION.NONE;

        let xEntry, yEntry;

        // Calculate the entry distance along the x-axis.
        if (velocity.x > 0) {
            // Moving right: distance from A's right edge to B's left edge.
            xEntry = box.START_X - this.END_X;
            xEntry = Number(xEntry.toFixed(2));
        } else if (velocity.x < 0) {
            // Moving left: distance from A's left edge to B's right edge.
            xEntry = box.END_X - this.START_X;
            xEntry = Number(xEntry.toFixed(2));
        } else {
            xEntry = Number.POSITIVE_INFINITY;
        }

        // Calculate the entry distance along the y-axis.
        if (velocity.y > 0) {
            // Moving down: distance from A's bottom to B's top.
            yEntry = box.START_Y - this.END_Y;
            // 2 Decimals solves javascript fuckery in the 13th digit
            yEntry = Number(yEntry.toFixed(2));
        } else if (velocity.y < 0) {
            // Moving up: distance from A's top to B's bottom.
            yEntry = box.END_Y - this.START_Y;
            // 2 Decimals solves javascript fuckery in the 13th digit
            yEntry = Number(yEntry.toFixed(2));
        } else {
            yEntry = Number.POSITIVE_INFINITY;
        }

        // Compute the time to collision on each axis.
        let tEntryX = (velocity.x !== 0) ? (xEntry / velocity.x) : Number.POSITIVE_INFINITY;
        let tEntryY = (velocity.y !== 0) ? (yEntry / velocity.y) : Number.POSITIVE_INFINITY;

        // Clamp negative entry times (which indicate an existing overlap) to Infinity,
        // so they don’t erroneously win the race.
        if (tEntryX < 0) tEntryX = Number.POSITIVE_INFINITY;
        if (tEntryY < 0) tEntryY = Number.POSITIVE_INFINITY;

        if (tEntryX === Number.POSITIVE_INFINITY && tEntryY === Number.POSITIVE_INFINITY)
            return CONSTANTS.COLLISION.NONE;

        // Compare the times to determine which side of the immovable box is hit first.
        if (tEntryX < tEntryY) {
            // For horizontal collision: if moving right, A's right hits B's left.
            return (velocity.x > 0) ? CONSTANTS.COLLISION.RIGHT : CONSTANTS.COLLISION.LEFT;
        } else if (tEntryY < tEntryX) {
            // For vertical collision: if moving down, A's bottom hits B's top.
            return (velocity.y > 0) ? CONSTANTS.COLLISION.BOTTOM : CONSTANTS.COLLISION.TOP;
        } else {
            // Corner collision handling.
            if (velocity.x > 0 && velocity.y > 0) {
                return CONSTANTS.COLLISION.CORNER_TOP_LEFT;
            } else if (velocity.x > 0 && velocity.y < 0) {
                return CONSTANTS.COLLISION.CORNER_BOTTOM_LEFT;
            } else if (velocity.x < 0 && velocity.y > 0) {
                return CONSTANTS.COLLISION.CORNER_TOP_RIGHT;
            } else if (velocity.x < 0 && velocity.y < 0) {
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