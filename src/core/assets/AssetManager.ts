import { IAssetLoader } from "./IAssetLoader";
import { IAsset } from "./IAsset";
import { Message, MessagePriority } from "../messaging/Message";
import { ImageAssetLoader } from "./ImageAssetLoader";

export const MESSAGE_ASSET_LOADER_ASSET_LOADED =
  "MESSAGE_ASSET_LOADER_ASSET_LOADED";

export class AssetManager {
  private static _loaders: IAssetLoader[];
  private static _loadedAssets: { [name: string]: IAsset } = {};

  private constructor() {}

  static init(): void {
    AssetManager._loaders.push(new ImageAssetLoader());
  }

  //TODO: Error checking loader is unique
  static registerLoader(loader: IAssetLoader): void {
    AssetManager._loaders.push(loader);
  }

  static onAssetLoaded(asset: IAsset): void {
    AssetManager._loadedAssets[asset.name] = asset;
    Message.send(
      MESSAGE_ASSET_LOADER_ASSET_LOADED + " " + asset.name,
      this,
      asset,
      MessagePriority.LOW
    );
  }

  static loadAsset(name: string): void {
    let extension = name.split(".")[1].toLocaleLowerCase();
    AssetManager._loaders.forEach((l) => {
      if (l.supportedExtensions.find((lExt) => lExt === extension)) {
        l.loadAsset(name);
        return;
      }
    });

    console.warn("No capable loader found to load " + extension + " extension");
  }

  static isAssetLoaded(name: string): boolean {
    return AssetManager._loadedAssets[name] !== undefined;
  }

  static getAsset(name: string): IAsset {
    if (AssetManager.isAssetLoaded(name)) {
      return AssetManager._loadedAssets[name];
    } else {
      AssetManager.loadAsset(name);
    }
    return undefined;
  }
}
