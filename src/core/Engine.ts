import * as Matter from "matter-js";
import { Input } from "./Input";
import { Renderer } from "./Renderer";
import { AbstractGame } from "./AbstractGame";
import { GLContext } from "./gl/GLContext";
import { MessageManager } from "./messaging/MessageManager";

export class Engine {
  width: number;
  height: number;
  maxFps: number;
  currentFps: number = 0;
  currentTime: number;
  canvas: HTMLCanvasElement;
  onDebugMode: boolean = true;
  physicsEngine: Matter.Engine;
  input: Input;
  renderer: Renderer;
  game: AbstractGame;

  constructor(
    width: number,
    height: number,
    maxFps: number,
    canvas: HTMLCanvasElement
  ) {
    //Canvas
    this.width = width;
    this.height = height;
    this.maxFps = maxFps;
    this.canvas = canvas;
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    //Renderer
    GLContext.init(this.canvas.getContext("webgl2"));
    this.renderer = new Renderer();

    //Physics
    this.physicsEngine = Matter.Engine.create();
    Matter.Engine.run(this.physicsEngine);

    //Input
    this.input = new Input();
  }

  public start(game: AbstractGame) {
    this.game = game;
    this.currentTime = performance.now();
    this.renderer.start(this.game.gameObjects);
    requestAnimationFrame(() => this.run());
  }

  public run() {
    let time = performance.now();
    if (time - this.currentTime >= this.maxFps / 1000) {
      this.currentFps = (time - this.currentTime) * 100;
      this.update();
      this.draw();
      this.currentTime = performance.now();
    }

    requestAnimationFrame(() => this.run());
  }

  public update() {
    this.game.gameObjects.forEach((go) => go.update(this));
    MessageManager.update();
  }

  public draw() {
    this.renderer.clear();
    if (this.onDebugMode) this.renderDebug();
    this.renderer.update(this.game.gameObjects);
  }

  private renderDebug() {
    /*this.graphicsContext.fill = "#FF00FF";
    this.graphicsContext.font = "30px Arial";
    this.graphicsContext.fillText("FPS: " + this.currentFps.toFixed(1), 0, 20);*/
  }
}
