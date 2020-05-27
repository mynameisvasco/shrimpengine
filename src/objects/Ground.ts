import { GameObject } from "../core/GameObject";
import { Engine } from "../core/Engine";
import { Body } from "matter-js";
import { Renderer } from "../core/Renderer";

export class Ground extends GameObject {
  gameObject: GameObject;

  constructor(tag: string, go: GameObject, friction: number) {
    super(tag);
    this.gameObject = go;
    this.body = go.body;
    this.body.isStatic = true;
    this.body.friction = friction;
    this.body.restitution = 0;
  }

  public load(gl: WebGL2RenderingContext): void {
    this.gameObject.load(gl);
  }

  public draw() {
    this.gameObject.draw();
  }

  update(engine: Engine): void {
    //
  }
}
