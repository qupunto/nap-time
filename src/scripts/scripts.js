import { default as Game } from "./game.js"
window.addEventListener('load', () => {
    const game = new Game('gameCanvas');
    game.start();
  });