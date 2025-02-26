import {constants} from "./constants.js";

export class SolidRectangle {
    constructor(x, y, width, height, style = {}) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.style = style;
    }
    collides(b) {
        const col = this.x < b.x + b.width &&
            this.x + this.width > b.x &&
            this.y < b.y + b.height &&
            this.y + this.height > b.y;
        if (!col)
            return null;
        // Calculate centers
        const aCenterX = this.x + this.width / 2;
        const aCenterY = this.y + this.height / 2;
        const bCenterX = b.x + b.width / 2;
        const bCenterY = b.y + b.height / 2;

        // Calculate differences between centers
        const dx = aCenterX - bCenterX;
        const dy = aCenterY - bCenterY;

        // Calculate half dimensions combined
        const halfWidths = (this.width + b.width) / 2;
        const halfHeights = (this.height + b.height) / 2;

        // Determine the overlap on each axis
        const overlapX = halfWidths - Math.abs(dx);
        const overlapY = halfHeights - Math.abs(dy);

        // If overlapX is less, collision is horizontal; otherwise, vertical.
        if (overlapX < overlapY) {
            // Horizontal collision
            return dx > 0 ? constants.direction.RIGHT : constants.direction.LEFT;
        } else {
            // Vertical collision
            return dy > 0 ? constants.direction.DOWN : constants.direction.UP;
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