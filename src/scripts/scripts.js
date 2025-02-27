﻿import { Game } from "./Game.js"
import { CONSTANTS } from "./constants.js";

window.addEventListener('load', () => {
  const game = new Game('gameCanvas', CONSTANTS.ANIMAL_TYPES.NIT);
  game.start();
});