import { Application, Graphics } from 'pixi.js';

export class Game {
  private app: Application<HTMLCanvasElement>;

  constructor() {
    this.app = new Application<HTMLCanvasElement>({
      width: 1800,
      height: 600,
      backgroundColor: 0xAAAAAA,
    });

    // Append the PIXI.Application view directly to the document body
    const pixiContainer = document.getElementById('pixi-container');
    if (pixiContainer) {
      pixiContainer.appendChild(this.app.view);
    }


    // Your Pixi.js logic goes here
    const graphics = new Graphics();
    graphics.beginFill(0xfffff0);
    graphics.drawRect(100, 100, 200, 200);
    graphics.endFill();
    this.app.stage.addChild(graphics);
  }
}
