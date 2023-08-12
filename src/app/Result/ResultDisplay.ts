// ResultDisplay.ts
import { Container, Graphics, Text, TextStyle } from 'pixi.js';

export class ResultDisplay {
  private displayObject: Container;
  private resultText: Text;
  private resultBG : Graphics;

  constructor() {
    this.displayObject = new Container();
    this.resultBG = new Graphics()
    this.resultBG.beginFill(0x000000); // Set the color of the shape
    this.resultBG.drawRect(0, 0, window.innerWidth, window.innerHeight);
    this.resultBG.endFill();
    this.resultBG.x = - window.innerWidth * 0.5;
    this.resultBG.y = - window.innerHeight * 0.5;
    this.resultBG.alpha = 0.3;
    this.displayObject.addChild(this.resultBG);
    this.resultText = new Text('', new TextStyle({
      fontFamily: 'Arial',
      fontSize: 24,
      fill: '#ffffff',
      align: 'center',
    }));
    this.resultText.anchor.set(0.5);
    this.displayObject.addChild(this.resultText);
    this.hide();
  }

  hide() :void{
    this.displayObject.visible = false;
  }

  show() :void{
    this.displayObject.visible = true;
  }

  public getDisplayObject(): Container {
    return this.displayObject;
  }


  public setText(text: string): void {
    this.resultText.text = text;
  }
}
