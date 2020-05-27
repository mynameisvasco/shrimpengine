import * as Matter from "matter-js";
import { GameObject } from "./GameObject";
import { Input } from "./Input";
import { Renderer } from "./Renderer";

export class Engine {
  width: number;
  height: number;
  maxFps: number;
  currentFps: number = 0;
  currentTime: number;
  canvas: HTMLCanvasElement;
  onDebugMode: boolean = true;
  physicsEngine: Matter.Engine;
  bodiesList: Matter.Body[];
  gameObjects: GameObject[] = [];
  input: Input;
  renderer: Renderer;

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
    this.renderer = new Renderer(this.canvas.getContext("webgl2"));

    //Physics
    this.physicsEngine = Matter.Engine.create();
    Matter.Engine.run(this.physicsEngine);

    //Input
    this.input = new Input();
    this.gameObjects = [];
  }

  public start() {
    this.currentTime = performance.now();
    this.renderer.start(this.gameObjects);
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
    this.gameObjects.forEach((go) => go.update(this));
  }

  public draw() {
    this.renderer.clear();
    if (this.onDebugMode) this.renderDebug();
    this.renderer.update(this.gameObjects);
  }

  public addGameObj(go: GameObject): void {
    this.gameObjects.push(go);
    Matter.World.add(this.physicsEngine.world, go.body);
  }

  private renderDebug() {
    /*this.graphicsContext.fill = "#FF00FF";
    this.graphicsContext.font = "30px Arial";
    this.graphicsContext.fillText("FPS: " + this.currentFps.toFixed(1), 0, 20);*/
  }
}
