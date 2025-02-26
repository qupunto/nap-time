﻿import { Game } from "./game.js"
import { constants } from "./constants.js";

window.addEventListener('load', () => {
  const game = new Game('gameCanvas', constants.animalTypes.NIT);
  game.start();
});