import { gl } from "../gl/GLContext";
import {
  AssetManager,
  MESSAGE_ASSET_LOADER_ASSET_LOADED,
} from "../assets/AssetManager";
import { Message } from "../messaging/Message";
import { IMessageHandler } from "../messaging/IMessageHandler";
import { ImageAsset } from "../assets/ImageAssetLoader";

const LEVEL: number = 0;
const BORDER: number = 0;
const IMAGE_TMP_DATA: Uint8Array = new Uint8Array([255, 50, 255, 255]);

export class Texture implements IMessageHandler {
  private _name: string;
  private _glHandler: WebGLTexture;
  private _isLoaded: boolean = false;
  private _width: number;
  private _height: number;

  constructor(name: string, width: number = 10, height: number = 10) {
    this._name = name;
    this._width = width;
    this._height = height;
    this._glHandler = gl.createTexture();

    Message.subscribe(MESSAGE_ASSET_LOADER_ASSET_LOADED + this.name, this);

    this.bind();

    gl.texImage2D(
      gl.TEXTURE_2D,
      LEVEL,
      gl.RGBA,
      1,
      1,
      BORDER,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      IMAGE_TMP_DATA
    );

    let asset = AssetManager.getAsset(this.name) as ImageAsset;
    if (asset !== undefined) {
      this.loadTextureFromAsset(asset);
    }
  }

  loadTextureFromAsset(asset: ImageAsset): void {
    this._width = asset.width;
    this._height = asset.height;
    this.bind();
    gl.texImage2D(
      gl.TEXTURE_2D,
      LEVEL,
      gl.RGBA,
      this._width,
      this._height,
      BORDER,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      asset.data
    );
    this._isLoaded = true;
  }

  onMessage(message: Message): void {
    if (message.code === MESSAGE_ASSET_LOADER_ASSET_LOADED + this.name) {
      this.loadTextureFromAsset(message.content as ImageAsset);
    }
  }

  public destroy(): void {
    gl.deleteTexture(this._glHandler);
  }

  public bind(): void {
    gl.bindTexture(gl.TEXTURE_2D, this._glHandler);
  }

  public activate(unit: number = 0): void {
    gl.activeTexture(gl.TEXTURE0 + unit);
    this.bind();
  }

  public unbind(): void {
    gl.bindTexture(gl.TEXTURE_2D, undefined);
  }

  public get name(): string {
    return this._name;
  }

  public get width(): number {
    return this._width;
  }

  public get height(): number {
    return this._height;
  }

  public get isLoaded(): boolean {
    return this._isLoaded;
  }
}
