// What the Library Game Hub shows about YOUR game (Hub Contract, rule 1).
// Lab Step 6: replace every CHANGE_ME value with your own.
const pkg = require('../../package.json');

module.exports = {
  slug: 'card-clash',            // your group's game, lower case with hyphens, for example shelf-climb
  name: 'Card Clash',            // the name players will see
  team: 'Group 2 (3-2)',            // your group's name and section, for example Bookworms (3-1)
  developer: 'ryzaboribor88',       // YOUR GitHub username: this build is yours
  description: 'A competitive educational card game where players or teams choose from a continuous card path, answer questions, discover hidden Power Cards, manage HP, and use strategy to achieve the highest score before time runs out.',     // one sentence about how the game is played
  min_players: 1,               // change to the limits your game is designed for
  max_players: 30,
  version: pkg.version,         // read from package.json, do not edit here
};
