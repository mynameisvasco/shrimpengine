import { Vector } from "matter-js";
import { GLBuffer, AttributeInfo } from "./gl/GLBuffer";
import { GameObject } from "./GameObject";
import { Shader } from "./gl/Shader";

export class Renderer {
  gl: WebGL2RenderingContext;
  shader: Shader;

  public static vertexShaderText: string = [
    "precision mediump float;",
    "",
    "attribute vec2 vertPosition;",
    "",
    "void main()",
    "{",
    "   gl_Position = vec4(vertPosition, 0.0, 1.0);",
    "}",
  ].join("\n");

  public static fragmentShaderText: string = [
    "precision mediump float;",
    "",
    "uniform vec4 vertColor;",
    "",
    "void main()",
    "{",
    "   gl_FragColor = vertColor;",
    "}",
  ].join("\n");

  constructor(gl: WebGL2RenderingContext) {
    this.gl = gl;
  }

  public start(gObjs: GameObject[]): void {
    this.shader = new Shader(
      "myShader",
      Renderer.vertexShaderText,
      Renderer.fragmentShaderText,
      this.gl
    );
    this.shader.use();
    gObjs.forEach((go) => go.load(this.gl));
  }

  public update(gObjs: GameObject[]): void {
    this.clear();
    let colorPosition = this.shader.getUniform("vertColor");
    this.gl.uniform4fv(
      colorPosition,
      Renderer.getFloatArrayFromARGB("#FF0000")
    );
    gObjs.forEach((go) => {
      go.load(this.gl);
      go.draw();
    });
  }

  public clear() {
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  }

  public static toWebGLCoordinateX(
    gl: WebGL2RenderingContext,
    x: number
  ): number {
    return (x / gl.canvas.width) * 2 - 1;
  }

  public static toWebGLCoordinateY(
    gl: WebGL2RenderingContext,
    y: number
  ): number {
    return (y / gl.canvas.height) * -2 + 1;
  }

  public static getFloatArrayFromARGB(argb: String): Float32Array {
    let red = parseInt(argb.substring(1, 3), 16);
    let green = parseInt(argb.substring(3, 5), 16);
    let blue = parseInt(argb.substring(5, 7), 16);
    let alpha = argb.length > 7 ? parseInt(argb.substring(7, 9), 16) : 255;
    return new Float32Array([
      red / 255.0,
      green / 255.0,
      blue / 255.0,
      alpha / 255.0,
    ]);
  }
}
