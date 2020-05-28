import { Texture } from "./Texture";

export class TextureReferenceNode {
  texture: Texture;
  referenceCount: number = 1;

  constructor(texture: Texture) {
    this.texture = texture;
  }
}

export class TextureManager {
  private static _textures: { [name: string]: TextureReferenceNode } = {};

  static getTexture(name: string): Texture {
    if (TextureManager._textures[name] === undefined) {
      let texture = new Texture(name);
      TextureManager._textures[name] = new TextureReferenceNode(texture);
    } else {
      TextureManager._textures[name].referenceCount++;
    }
    return TextureManager._textures[name].texture;
  }

  static releaseTexture(name: string) {
    if (TextureManager._textures[name] === undefined) {
      console.warn("Texture " + name + " already exists on texture manager");
    } else {
      TextureManager._textures[name].referenceCount--;
      if (TextureManager._textures[name].referenceCount < 1) {
        TextureManager._textures[name].texture.destroy();
        TextureManager._textures[name] = undefined;
        delete TextureManager._textures[name];
      }
    }
  }
}
