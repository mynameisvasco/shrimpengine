import { IAssetLoader } from "./IAssetLoader";
import { IAsset } from "./IAsset";
import { AssetManager } from "./AssetManager";

export class ImageAsset implements IAsset {
  readonly name: string;
  readonly data: HTMLImageElement;

  constructor(name: string, data: HTMLImageElement) {
    this.name = name;
    this.data = data;
  }

  get width(): number {
    return this.data.width;
  }

  get height(): number {
    return this.data.height;
  }
}

export class ImageAssetLoader implements IAssetLoader {
  public get supportedExtensions(): string[] {
    return ["png", "jpeg", "jpg", "gif"];
  }

  loadAsset(name: string): void {
    let htmlImage = new HTMLImageElement();
    htmlImage.onload = this.onImageLoaded(name, htmlImage);
    htmlImage.src = name;
  }

  private onImageLoaded(name: string, image: HTMLImageElement): any {
    console.log("onImageLoaded: name/image", name, image);
    let asset = new ImageAsset(name, image);
    AssetManager.onAssetLoaded(asset);
  }
}
