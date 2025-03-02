﻿import { Game } from "./Game.js"
import { ANIMALS } from "./constants.js";

window.addEventListener('load', () => {
  const game = new Game('gameCanvas', ANIMALS.NIT);
  game.start();
});