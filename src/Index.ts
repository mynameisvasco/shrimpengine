import { Engine } from "./core/Engine";
import { Rectangle } from "./core/objects/Rectangle";
import { Vector } from "matter-js";
import { Controller } from "./core/objects/Controller";
import { Ground } from "./core/objects/Ground";
import { Game } from "./Game";
import { Texture } from "./core/graphics/Texture";
import { Sprite } from "./core/graphics/Sprite";

const engine: Engine = new Engine(
  1280,
  720,
  60,
  <HTMLCanvasElement>document.getElementById("myCanvas")
);

const game: Game = new Game(engine);

engine.start(game);

const r1 = new Rectangle("r1", 100, 100, "#FF0000", Vector.create(300, 50));
r1._sprite = new Sprite(
  "wood_crate",
  "res/textures/wood_crate.png",
  100,
  100,
  r1.body.position
);
const myController = new Controller("player", r1);
const ground = new Ground(
  "Ground",
  new Rectangle("groundRect", 250, 10, "#000000", Vector.create(200, 200)),
  50
);
ground._sprite = new Sprite(
  "wood_crate",
  "res/textures/wood_crate.png",
  250,
  10,
  ground.body.position,
  "#FF0000"
);
const ground2 = new Ground(
  "Ground2",
  new Rectangle("groundRect2", 250, 120, "#000000", Vector.create(200, 600)),
  50
);

ground2._sprite = new Sprite(
  "wood_crate",
  "res/textures/wood_crate.png",
  250,
  120,
  ground2.body.position,
  "#FF0000"
);

game.addGameObject(myController);
game.addGameObject(ground);
game.addGameObject(ground2);
