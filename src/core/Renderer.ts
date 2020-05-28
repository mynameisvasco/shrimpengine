import { Vector } from "matter-js";
import { GLBuffer, AttributeInfo } from "./gl/GLBuffer";
import { GameObject } from "./objects/GameObject";
import { Shader } from "./gl/Shader";
import { gl } from "./gl/GLContext";

export class Renderer {
  shader: Shader = new Shader(
    "myShader",
    Renderer.vertexShaderText,
    Renderer.fragmentShaderText
  );

  public static vertexShaderText: string = [
    "precision mediump float;",
    "",
    "attribute vec3 vertPosition;",
    "attribute vec2 texCoord;",
    "",
    "uniform mat4 projection;",
    "uniform mat4 model;",
    "",
    "varying vec2 v_texCoord;",
    "",
    "void main()",
    "{",
    "   gl_Position =  vec4(vertPosition, 1.0);",
    "   v_texCoord = texCoord;",
    "}",
  ].join("\n");

  public static fragmentShaderText: string = [
    "precision mediump float;",
    "",
    "uniform vec4 tint;",
    "uniform sampler2D diffuse;",
    "",
    "varying vec2 v_texCoord;",
    "",
    "void main()",
    "{",
    "   gl_FragColor = tint * texture2D(diffuse,v_texCoord);",
    "}",
  ].join("\n");

  public start(gObjs: GameObject[]): void {
    this.shader.use();

    gObjs.forEach((go) => go.sprite.load());
  }

  public update(gObjs: GameObject[]): void {
    this.clear();
    gObjs.forEach((go) => {
      go.sprite.load();
      go.sprite.draw(this.shader);
    });
  }

  public clear() {
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
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
