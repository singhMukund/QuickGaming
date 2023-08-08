import { Application, Container, Loader, Sprite, Texture } from "pixi.js";

export class Background{
    private app : Application;
    private bgContainer : Container;
    private bgImage! : Sprite;
    private loader!: Loader;
    constructor(app : Application,loader :Loader){
        this.app = app;
        this.loader = loader;
        this.bgContainer = new Container();
        this.app.stage.addChild(this.bgContainer);
        this.intializeBg();
        // this.centerBackground();
        // window.addEventListener("resize", this.centerBackground.bind(this));
    }

    private intializeBg() :void{
          // @ts-ignore
        this.bgImage = new Sprite(this.loader.resources['bg'].texture);
        this.bgImage.name = 'bgImage'
          // @ts-ignore
        const widthAndHeight =  this.calculateWidthAndHeight(this.loader.resources['bg'].texture);
          // @ts-ignore
        this.bgImage.width = widthAndHeight[0];
        this.bgImage.height = widthAndHeight[1];
        this.bgImage.x = (this.app.renderer.width - this.bgImage.width) / 2;
        this.bgImage.y = (this.app.renderer.height - this.bgImage.height) / 2;
        // this.bgContainer.addChild(this.bgImage);
    }

    setScale(scale : number) {
      this.bgImage.scale.set(scale);
    }

    setPosition(x: number, y: number) {
      this.bgImage.x = x;
      this.bgImage.y = y;
    }

    


    private calculateWidthAndHeight(texture : Texture) : number[] {

      // Calculate aspect ratio of the image
      const aspectRatio = texture.width / texture.height;
  
      // Set the maximum width and height to fit within the canvas
      const maxWidth = this.app.renderer.width;
      const maxHeight = this.app.renderer.height;
  
      // Calculate the new width and height while maintaining the aspect ratio
      let newWidth = maxWidth;
      let newHeight = newWidth / aspectRatio;
  
      if (newHeight > maxHeight) {
        newHeight = maxHeight;
        newWidth = newHeight * aspectRatio;
      }
  
      return [newWidth, newHeight];
  
    }
}


