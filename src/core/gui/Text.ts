import { Vector } from "matter-js";
import { Font } from "./Font";

export class Text {
  private content: string;
  private positon: Vector;
  private font: Font;

  constructor(content: string, position: Vector, font: Font = Font.ARIAL) {
    this.content = content;
    this.positon = position;
  }

  draw() {}
}
