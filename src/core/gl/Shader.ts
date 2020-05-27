export class Shader {
  gl: WebGL2RenderingContext;
  private _name: string;
  private _program: WebGLProgram;
  private _attributes: { [name: string]: number } = {};
  private _uniforms: { [name: string]: WebGLUniformLocation } = {};

  constructor(
    name: string,
    vertexSource: string,
    fragmentSource: string,
    gl: WebGL2RenderingContext
  ) {
    this._name = name;
    this.gl = gl;
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
    this.gl.useProgram(this._program);
  }

  public getAttributeLocation(name: string): number {
    if (this._attributes[name] === undefined)
      throw Error(
        "Attribute " + name + " not found on " + this._name + " shader."
      );

    return this._attributes[name];
  }

  public getUniform(name: string): WebGLUniformLocation {
    if (this._uniforms[name] === undefined)
      throw Error(
        "Uniform " + name + " not found on " + this._name + " shader."
      );

    return this._uniforms[name];
  }

  private loadShader(source: string, shaderType: number): WebGLShader {
    let shader: WebGLShader = this.gl.createShader(shaderType);
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      throw new Error(
        "Error compiling shader " +
          this._name +
          ": " +
          this.gl.getShaderInfoLog(shader)
      );
    }
    return shader;
  }

  private createProgram(
    vertexShader: WebGLShader,
    fragmentShader: WebGLShader
  ): void {
    this._program = this.gl.createProgram();
    this.gl.attachShader(this._program, vertexShader);
    this.gl.attachShader(this._program, fragmentShader);
    this.gl.linkProgram(this._program);
    if (!this.gl.getProgramParameter(this._program, this.gl.LINK_STATUS)) {
      throw new Error(
        "Error linking shader " +
          this._name +
          ": " +
          this.gl.getProgramInfoLog(this._program)
      );
    }
  }

  private detectAttributes(): void {
    let attributesCount = this.gl.getProgramParameter(
      this._program,
      this.gl.ACTIVE_ATTRIBUTES
    );
    for (let i = 0; i < attributesCount; ++i) {
      let attributeInfo: WebGLActiveInfo = this.gl.getActiveAttrib(
        this._program,
        i
      );
      if (!attributeInfo) break;
      this._attributes[attributeInfo.name] = this.gl.getAttribLocation(
        this._program,
        attributeInfo.name
      );
    }
  }

  private detectUniforms(): void {
    let uniformsCount = this.gl.getProgramParameter(
      this._program,
      this.gl.ACTIVE_UNIFORMS
    );
    for (let i = 0; i < uniformsCount; ++i) {
      let uniformInfo: WebGLActiveInfo = this.gl.getActiveUniform(
        this._program,
        i
      );
      if (!uniformInfo) break;
      this._uniforms[uniformInfo.name] = this.gl.getUniformLocation(
        this._program,
        uniformInfo.name
      );
    }
  }
}
