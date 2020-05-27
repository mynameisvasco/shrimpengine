import { Body } from "matter-js";
import { Engine } from "./Engine";
import { Renderer } from "./Renderer";
import { GLBuffer } from "./gl/GLBuffer";

export abstract class GameObject {
  body: Body;
  _tag: string;
  _buffer: GLBuffer;

  constructor(tag: string) {
    this._tag = tag;
  }

  public get tag(): string {
    return this._tag;
  }

  public abstract load(gl: WebGL2RenderingContext): void;

  draw(): void {
    this._buffer.bind();
    this._buffer.draw();
  }

  abstract update(engine: Engine): void;
}
