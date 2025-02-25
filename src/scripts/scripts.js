import { default as Game } from "./game.js"
import {default as Constants} from "./constants.js"
window.addEventListener('load', () => {
    const game = new Game('gameCanvas');
    const constants = new Constants();
    game.start(constants.gameTypes.FEED, constants.animalTypes.NIT);
  });