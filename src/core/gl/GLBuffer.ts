export class AttributeInfo {
  public location: number;
  public size: number;
  public offset: number;
}

export class GLBuffer {
  private gl: WebGL2RenderingContext;
  private _hasAttributeLocation: boolean = false;
  private _elementSize: number;
  private _stride: number;
  private _buffer: WebGLBuffer;
  private _targetBufferType: number;
  private _dataType: number;
  private _mode: number;
  private _typeSize: number;
  private _data: number[] = [];
  private _attributes: AttributeInfo[] = [];

  constructor(
    elementSize: number,
    gl: WebGL2RenderingContext,
    dataType: number = gl.FLOAT,
    targetBufferType: number = gl.ARRAY_BUFFER,
    mode: number = gl.TRIANGLES
  ) {
    this._elementSize = elementSize;
    this._dataType = dataType;
    this._targetBufferType = targetBufferType;
    this._mode = mode;
    this.gl = gl;
    switch (this._dataType) {
      case gl.FLOAT:
      case gl.INT:
      case gl.UNSIGNED_INT:
        this._typeSize = 4;
        break;
      case gl.SHORT:
      case gl.UNSIGNED_SHORT:
        this._typeSize = 2;
        break;
      case gl.BYTE:
      case gl.UNSIGNED_BYTE:
        this._typeSize = 1;
        break;
      default:
        throw new Error("Unknown data type: " + dataType.toString());
    }

    this._stride = this._elementSize * this._typeSize;
    this._buffer = this.gl.createBuffer();
  }

  public destroy() {
    this.gl.deleteBuffer(this._buffer);
  }

  public bind(isNormalized: boolean = false): void {
    this.gl.bindBuffer(this._targetBufferType, this._buffer);
    if (this._hasAttributeLocation) {
      for (let attr of this._attributes) {
        this.gl.vertexAttribPointer(
          attr.location,
          attr.size,
          this._dataType,
          isNormalized,
          this._stride,
          attr.offset * this._typeSize
        );
        this.gl.enableVertexAttribArray(attr.location);
      }
    }
  }

  public unbind(): void {
    if (this._hasAttributeLocation) {
      for (let attr of this._attributes) {
        this.gl.disableVertexAttribArray(attr.location);
      }
    }
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this._buffer);
  }

  public pushData(data: number[]): void {
    data.forEach((d) => this._data.push(d));
  }

  public dispatch() {
    this.gl.bindBuffer(this._targetBufferType, this._buffer);
    let bufferData: ArrayBuffer;
    switch (this._dataType) {
      case this.gl.FLOAT:
        bufferData = new Float32Array(this._data);
        break;
      case this.gl.INT:
        bufferData = new Int32Array(this._data);
        break;
      case this.gl.UNSIGNED_INT:
        bufferData = new Uint32Array(this._data);
        break;
      case this.gl.SHORT:
        bufferData = new Int16Array(this._data);
        break;
      case this.gl.UNSIGNED_SHORT:
        bufferData = new Uint16Array(this._data);
        break;
      case this.gl.BYTE:
        bufferData = new Int8Array(this._data);
        break;
      case this.gl.UNSIGNED_BYTE:
        bufferData = new Uint8Array(this._data);
        break;
      default:
        throw new Error("Unknown data type");
    }
    this.gl.bufferData(this._targetBufferType, bufferData, this.gl.STATIC_DRAW);
  }

  public addAttributeLocation(info: AttributeInfo): void {
    this._hasAttributeLocation = true;
    this._attributes.push(info);
  }

  public draw(): void {
    if (this._targetBufferType == this.gl.ARRAY_BUFFER) {
      this.gl.drawArrays(this._mode, 0, this._data.length / this._elementSize);
    } else if (this._targetBufferType === this.gl.ELEMENT_ARRAY_BUFFER) {
      this.gl.drawElements(this._mode, this._data.length, this._dataType, 0);
    }
  }
}
