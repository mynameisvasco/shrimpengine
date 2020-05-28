import { Body } from "matter-js";
import { Engine } from "../Engine";
import { Renderer } from "../Renderer";
import { GLBuffer } from "../gl/GLBuffer";
import { Sprite } from "../graphics/Sprite";

export abstract class GameObject {
  body: Body;
  _tag: string;
  _sprite: Sprite;

  constructor(tag: string) {
    this._tag = tag;
  }

  public get tag(): string {
    return this._tag;
  }

  public set sprite(sprite: Sprite) {
    this._sprite = sprite;
  }

  public get sprite() {
    return this._sprite;
  }

  abstract update(engine: Engine): void;
}
