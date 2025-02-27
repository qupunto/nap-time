import { constants } from "./constants.js";

export class SolidRectangle {
    constructor(x, y, width, height, style = {}) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.style = style;
    }
    collides(velocity, box) {
        // First, check if a collision occurs after moving.
        const col = (this.x + velocity.x) < (box.x + box.width) &&
                    (this.x + velocity.x + this.width) > box.x &&
                    (this.y + velocity.y) < (box.y + box.height) &&
                    (this.y + velocity.y + this.height) > box.y;
        if (!col)
            return constants.collision.NONE;
    
        let xEntry, yEntry;
    
        // Calculate the entry distance along the x-axis.
        if (velocity.x > 0) {
            // Moving right: distance from A's right edge to B's left edge.
            xEntry = box.x - (this.x + this.width);
        } else if (velocity.x < 0) {
            // Moving left: distance from A's left edge to B's right edge.
            xEntry = (box.x + box.width) - this.x;
        } else {
            xEntry = Number.POSITIVE_INFINITY;
        }
    
        // Calculate the entry distance along the y-axis.
        if (velocity.y > 0) {
            // Moving down: distance from A's bottom to B's top.
            yEntry = box.y - (this.y + this.height);
        } else if (velocity.y < 0) {
            // Moving up: distance from A's top to B's bottom.
            yEntry = (box.y + box.height) - this.y;
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
    
        // Compare the times to determine which side of the immovable box is hit first.
        if (tEntryX < tEntryY) {
            // For horizontal collision: if moving right, A's right hits B's left.
            return (velocity.x > 0) ? constants.collision.RIGHT : constants.collision.LEFT;
        } else if (tEntryY < tEntryX) {
            // For vertical collision: if moving down, A's bottom hits B's top.
            return (velocity.y > 0) ? constants.collision.BOTTOM : constants.collision.TOP;
        } else {
            // Corner collision handling.
            if (velocity.x > 0 && velocity.y > 0) {
                return constants.collision.CORNER_TOP_LEFT;
            } else if (velocity.x > 0 && velocity.y < 0) {
                return constants.collision.CORNER_BOTTOM_LEFT;
            } else if (velocity.x < 0 && velocity.y > 0) {
                return constants.collision.CORNER_TOP_RIGHT;
            } else if (velocity.x < 0 && velocity.y < 0) {
                return constants.collision.CORNER_BOTTOM_RIGHT;
            } else {
                return constants.collision.NONE;
            }
        }
    }
    draw(ctx) {
        ctx.fillStyle = this.style?.fillStyle ?? 'pink';
        ctx.fillRect(
            this.x,
            this.y,
            this.width,
            this.height
        );
    }
}