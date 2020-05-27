export class Input {
  keys: boolean[];
  mouse: boolean[];

  constructor() {
    this.keys = [];
    this.mouse = [];
    document.addEventListener("keydown", (e) => {
      this.keys[e.keyCode] = true;
    });
    document.addEventListener("keyup", (e) => {
      this.keys[e.keyCode] = false;
    });
  }

  setKeyDown(code: number): void {
    this.keys[code] = true;
  }

  setKeyUp(code: number): void {
    this.keys[code] = false;
  }

  isKeyDown(code: number): boolean {
    return this.keys[code];
  }

  isKeyUp(code: number): boolean {
    return !this.keys[code];
  }
}
