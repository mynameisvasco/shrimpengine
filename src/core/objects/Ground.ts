import { GameObject } from "./GameObject";
import { Engine } from "../Engine";

export class Ground extends GameObject {
  gameObject: GameObject;

  constructor(tag: string, go: GameObject, friction: number) {
    super(tag);
    this.gameObject = go;
    this.body = go.body;
    this.body.isStatic = true;
    this.body.friction = friction;
    this.sprite = this.gameObject.sprite;
  }

  update(engine: Engine): void {
    //
  }
}
