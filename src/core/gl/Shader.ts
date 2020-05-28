import { gl } from "./GLContext";

export class Shader {
  private _name: string;
  private _program: WebGLProgram;
  private _attributes: { [name: string]: number } = {};
  private _uniforms: { [name: string]: WebGLUniformLocation } = {};

  constructor(name: string, vertexSource: string, fragmentSource: string) {
    this._name = name;
    let vertexShader = this.loadShader(vertexSource, gl.VERTEX_SHADER);
    let fragmentShader = this.loadShader(fragmentSource, gl.FRAGMENT_SHADER);
    this.createProgram(vertexShader, fragmentShader);
    this.detectAttributes();
    this.detectUniforms();
  }

  public get name(): string {
    return this.name;
  }

  public use(): void {
    gl.useProgram(this._program);
  }

  public getAttributeLocation(name: string): number {
    if (this._attributes[name] === undefined)
      throw Error(
        "Attribute " + name + " not found on " + this._name + " shader."
      );

    return this._attributes[name];
  }

  public getUniformLocation(name: string): WebGLUniformLocation {
    if (this._uniforms[name] === undefined)
      throw Error(
        "Uniform " + name + " not found on " + this._name + " shader."
      );

    return this._uniforms[name];
  }

  private loadShader(source: string, shaderType: number): WebGLShader {
    let shader: WebGLShader = gl.createShader(shaderType);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw new Error(
        "Error compiling shader " +
          this._name +
          ": " +
          gl.getShaderInfoLog(shader)
      );
    }
    return shader;
  }

  private createProgram(
    vertexShader: WebGLShader,
    fragmentShader: WebGLShader
  ): void {
    this._program = gl.createProgram();
    gl.attachShader(this._program, vertexShader);
    gl.attachShader(this._program, fragmentShader);
    gl.linkProgram(this._program);
    if (!gl.getProgramParameter(this._program, gl.LINK_STATUS)) {
      throw new Error(
        "Error linking shader " +
          this._name +
          ": " +
          gl.getProgramInfoLog(this._program)
      );
    }
  }

  private detectAttributes(): void {
    let attributesCount = gl.getProgramParameter(
      this._program,
      gl.ACTIVE_ATTRIBUTES
    );
    for (let i = 0; i < attributesCount; ++i) {
      let attributeInfo: WebGLActiveInfo = gl.getActiveAttrib(this._program, i);
      if (!attributeInfo) break;
      this._attributes[attributeInfo.name] = gl.getAttribLocation(
        this._program,
        attributeInfo.name
      );
    }
  }

  private detectUniforms(): void {
    let uniformsCount = gl.getProgramParameter(
      this._program,
      gl.ACTIVE_UNIFORMS
    );
    for (let i = 0; i < uniformsCount; ++i) {
      let uniformInfo: WebGLActiveInfo = gl.getActiveUniform(this._program, i);
      if (!uniformInfo) break;
      this._uniforms[uniformInfo.name] = gl.getUniformLocation(
        this._program,
        uniformInfo.name
      );
    }
  }
}
