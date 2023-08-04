import { Application, Graphics } from 'pixi.js';

export class Game {
  private app: Application<HTMLCanvasElement>;
  private appWidth = 1270;
  private appHeight = 720;
  private backgroundShape!: Graphics;

  constructor() {
    this.app = new Application<HTMLCanvasElement>({
      width: this.appWidth,
      height: this.appHeight,
      backgroundColor: 0x02a732,
    });

    // Append the PIXI.Application view directly to the document body
    const pixiContainer = document.getElementById('pixi-container');
    if (pixiContainer) {
      pixiContainer.appendChild(this.app.view);
    }
    this.subscribeEvent();


    // Your Pixi.js logic goes here
    const graphics = new Graphics();
    
  }

  private initializeBg() :void{
    this.backgroundShape = new Graphics();
    this.backgroundShape.beginFill(0x02a732);
    this.backgroundShape.drawRect(0, 0, 200, 200);
    this.backgroundShape.endFill();
    this.app.stage.addChild(this.backgroundShape);
  }

  private subscribeEvent(): void {
    window.addEventListener('load', this.resizeApp.bind(this));
    window.addEventListener('resize', this.resizeApp.bind(this));
  }

  calculateScaleAndPosition() {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
  
    const appAspectRatio = this.appWidth / this.appHeight;
    const screenAspectRatio = screenWidth / screenHeight;
  
    let scale, offsetX, offsetY;
  
    if (screenAspectRatio > appAspectRatio) {
      // Landscape orientation
      scale = screenWidth / this.appWidth;
      offsetX = 0;
      offsetY = (screenHeight - this.appHeight * scale) / 2;
    } else {
      // Portrait orientation
      scale = screenHeight / this.appHeight;
      offsetX = (screenWidth - this.appWidth * scale) / 2;
      offsetY = 0;
    }
  
    return { scale, offsetX, offsetY };
  }

  resizeApp() {
    const { scale, offsetX, offsetY } = this.calculateScaleAndPosition();
    this.app.renderer.resize(this.appWidth * scale, this.appHeight * scale);
    this.app.stage.scale.set(scale);
    this.app.stage.position.set(offsetX, offsetY);
  }


}
