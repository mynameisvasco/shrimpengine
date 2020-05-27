export var gl: WebGL2RenderingContext;

export class GLContext {
  static init(_gl: WebGL2RenderingContext): void {
    gl = _gl;
  }

  public get gl(): WebGL2RenderingContext {
    return this.gl;
  }
}
