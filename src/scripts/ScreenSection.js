import { CollisionBox } from "./CollisionBox.js";

export class ScreenSection extends CollisionBox {
  constructor(id, x, y, width, height, obstacles = []) {
    super(x, y, width, height);
    this.ID = id;
    this.OBSTACLES = obstacles.filter(obs => super.contains(obs));
    Object.freeze(this);
  }
}
