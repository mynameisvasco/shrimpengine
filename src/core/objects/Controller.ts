import { GameObject } from "./GameObject";
import { Body, Vector } from "matter-js";
import { Engine } from "../Engine";
import { Renderer } from "../Renderer";

export class Controller extends GameObject {
  gameObject: GameObject;
  body: Body;
  jumpingTime: number = 0;
  constructor(tag: string, go: GameObject) {
    super(tag);
    this.gameObject = go;
    this.body = go.body;
    this.sprite = go.sprite;
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
    }
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
