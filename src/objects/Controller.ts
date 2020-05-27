import { GameObject } from "../core/GameObject";
import { Body, Vector } from "matter-js";
import { Engine } from "../core/Engine";
import { Renderer } from "../core/Renderer";

export class Controller extends GameObject {
  gameObject: GameObject;
  body: Body;
  jumpingTime: number = 0;
  constructor(tag: string, go: GameObject) {
    super(tag);
    this.gameObject = go;
    this.body = go.body;
    this._buffer = go._buffer;
  }

  moveRight() {
    Body.setVelocity(this.body, Vector.create(5, this.body.velocity.y));
  }

  moveLeft() {
    Body.setVelocity(this.body, Vector.create(-5, this.body.velocity.y));
  }

  jump() {
    if (this.jumpingTime < 20) {
      Body.setVelocity(this.body, Vector.create(this.body.velocity.x, -5));
      this.jumpingTime++;
      console.log(this.jumpingTime);
    }
  }

  draw(): void {
    this.gameObject.draw();
  }

  public load(gl: WebGL2RenderingContext): void {
    this.gameObject.load(gl);
  }

  update(engine: Engine): void {
    if (engine.input.isKeyDown(68)) {
      this.moveRight();
    }
    if (engine.input.isKeyDown(65)) {
      this.moveLeft();
    }
    if (engine.input.isKeyDown(32)) {
      this.jump();
    } else {
      this.jumpingTime = 0;
    }
  }
}
