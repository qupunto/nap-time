export class ScreenSection {
  constructor(id, x, y, width, height, obstacles = []) {
    this.ID = id;
    this.START_X = x;
    this.START_Y = y;
    this.END_X = x + width;
    this.END_Y = y + height;
    this.WIDTH = width;
    this.HEIGHT = height;
    this.OBSTACLES = obstacles.filter(obs => this.contains(obs));
    Object.freeze(this);
  }
  contains(box){
    return  this.START_X < (box.END_X) &&
    this.END_X > box.START_X &&
    this.START_Y < box.END_Y &&
    this.END_Y > box.START_Y;
  }
}
