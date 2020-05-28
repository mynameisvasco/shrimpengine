import { GLBuffer, AttributeInfo } from "../gl/GLBuffer";
import { Texture } from "./Texture";
import { Vector } from "matter-js";
import { TextureManager } from "./TextureManager";
import { Shader } from "../gl/Shader";
import { gl } from "../gl/GLContext";
import { Renderer } from "../Renderer";

export class Sprite {
  _name: string;
  _width: number;
  _height: number;
  _buffer: GLBuffer;
  _textureName: string;
  _texture: Texture;
  tint: string;
  position: Vector;

  constructor(
    name: string,
    textureName: string,
    width: number = 100,
    height: number = 100,
    position: Vector,
    tint: string = "#FFFFFF"
  ) {
    this._name = name;
    this._textureName = textureName;
    this._width = width;
    this._height = height;
    this._texture = TextureManager.getTexture(this._textureName);
    this.position = position;
    this.tint = tint;
  }

  get name(): string {
    return this._name;
  }

  get width(): number {
    return this._width;
  }

  get height(): number {
    return this._height;
  }

  destroy(): void {
    this._buffer.destroy();
    TextureManager.releaseTexture(this._textureName);
  }

  load(): void {
    this._buffer = new GLBuffer(5);

    let positionAttribute = new AttributeInfo();
    //Usualy position attribute is the first one but TODO: Fix harcoded value
    positionAttribute.location = 0;
    positionAttribute.offset = 0;
    positionAttribute.size = 3;
    this._buffer.addAttributeLocation(positionAttribute);

    let texCoordAttribute = new AttributeInfo();
    //Usualy position attribute is the first one but TODO: Fix harcoded value
    texCoordAttribute.location = 1;
    texCoordAttribute.offset = 3;
    texCoordAttribute.size = 2;
    this._buffer.addAttributeLocation(texCoordAttribute);

    let vertices = [
      //V1
      Renderer.toWebGLCoordinateX(gl, this.position.x - this.width / 2),
      Renderer.toWebGLCoordinateY(gl, this.position.y + this.height / 2),
      0,
      0,
      0,
      //V2
      Renderer.toWebGLCoordinateX(gl, this.position.x - this.width / 2),
      Renderer.toWebGLCoordinateY(gl, this.position.y - this.height / 2),
      0,
      0,
      1.0,
      //V3
      Renderer.toWebGLCoordinateX(gl, this.position.x + this.width / 2),
      Renderer.toWebGLCoordinateY(gl, this.position.y - this.height / 2),
      0,
      1.0,
      1.0,

      //V1
      Renderer.toWebGLCoordinateX(gl, this.position.x + this.width / 2),
      Renderer.toWebGLCoordinateY(gl, this.position.y - this.height / 2),
      0,
      1.0,
      1.0,
      //V2
      Renderer.toWebGLCoordinateX(gl, this.position.x + this.width / 2),
      Renderer.toWebGLCoordinateY(gl, this.position.y + this.height / 2),
      0,
      1.0,
      0,
      //V3
      Renderer.toWebGLCoordinateX(gl, this.position.x - this.width / 2),
      Renderer.toWebGLCoordinateY(gl, this.position.y + this.height / 2),
      0,
      0,
      0,
    ];
    this._buffer.pushData(vertices);
    this._buffer.dispatch();
    this._buffer.unbind();
  }

  draw(shader: Shader) {
    this._texture.activate(0);
    let diffuseLocation = shader.getUniformLocation("diffuse");
    gl.uniform1i(diffuseLocation, 0);
    let tintPosition = shader.getUniformLocation("tint");
    gl.uniform4fv(tintPosition, Renderer.getFloatArrayFromARGB(this.tint));
    this._buffer.bind();
    this._buffer.draw();
  }
}
