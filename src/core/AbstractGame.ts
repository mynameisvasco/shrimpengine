import { GameObject } from "./objects/GameObject";
import { World } from "matter-js";
import { Engine } from "./Engine";

export abstract class AbstractGame {
  private _gameObjects: GameObject[] = [];
  private _engine: Engine;

  constructor(engine: Engine) {
    this._engine = engine;
  }

  abstract update(): void;
  abstract draw(): void;

  public get gameObjects(): GameObject[] {
    return this._gameObjects;
  }

  public addGameObject(go: GameObject): void {
    this.gameObjects.push(go);
    World.add(this._engine.physicsEngine.world, go.body);
  }
}
