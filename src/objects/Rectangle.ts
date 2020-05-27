import { GameObject } from "../core/GameObject";
import { Bodies, Vector, Render } from "matter-js";
import { Renderer } from "../core/Renderer";
import { Shader } from "../core/gl/Shader";
import { GLBuffer, AttributeInfo } from "../core/gl/GLBuffer";

export class Rectangle extends GameObject {
  width: number;
  height: number;
  color: string;
  shader: Shader = null;

  constructor(
    tag: string,
    width: number,
    height: number,
    color: string,
    pos: Vector
  ) {
    super(tag);
    this.body = Bodies.rectangle(pos.x, pos.y, width, height);
    this.width = width;
    this.height = height;
    this.color = color;
  }

  public load(gl: WebGL2RenderingContext): void {
    this._buffer = new GLBuffer(2, gl);

    let positionAttribute = new AttributeInfo();
    //Usualy position attribute is the first one but TODO: Fix harcoded value
    positionAttribute.location = 0;
    positionAttribute.offset = 0;
    positionAttribute.size = 3;
    this._buffer.addAttributeLocation(positionAttribute);

    let vertices = [
      /*TRIANGLE 1*/
      //V1
      Renderer.toWebGLCoordinateX(gl, this.body.position.x - this.width / 2),
      Renderer.toWebGLCoordinateY(gl, this.body.position.y + this.height / 2),
      //V2
      Renderer.toWebGLCoordinateX(gl, this.body.position.x - this.width / 2),
      Renderer.toWebGLCoordinateY(gl, this.body.position.y - this.height / 2),
      //V3
      Renderer.toWebGLCoordinateX(gl, this.body.position.x + this.width / 2),
      Renderer.toWebGLCoordinateY(gl, this.body.position.y - this.height / 2),

      /*TRIANGLE 2*/
      //V1
      Renderer.toWebGLCoordinateX(gl, this.body.position.x + this.width / 2),
      Renderer.toWebGLCoordinateY(gl, this.body.position.y - this.height / 2),
      //V2
      Renderer.toWebGLCoordinateX(gl, this.body.position.x + this.width / 2),
      Renderer.toWebGLCoordinateY(gl, this.body.position.y + this.height / 2),
      //V3
      Renderer.toWebGLCoordinateX(gl, this.body.position.x - this.width / 2),
      Renderer.toWebGLCoordinateY(gl, this.body.position.y + this.height / 2),
    ];

    this._buffer.pushData(vertices);
    this._buffer.dispatch();
    this._buffer.unbind();
  }

  update(): void {}
}
