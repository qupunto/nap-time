<<<<<<< Updated upstream
﻿import { Game } from "./game.js"
import { constants } from "./constants.js";

window.addEventListener('load', () => {
  const game = new Game('gameCanvas', constants.animalTypes.NIT);
  game.start();
=======
﻿import { default as Game } from "./game.js"
import { default as Constants } from "./constants.js"
window.addEventListener('load', () => {
  const game = new Game('gameCanvas');
  const constants = new Constants();
  game.start(constants.gameTypes.FEED, constants.animalTypes.DIA);
>>>>>>> Stashed changes
});