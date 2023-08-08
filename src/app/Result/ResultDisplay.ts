// ResultDisplay.ts
import { Container, Text, TextStyle } from 'pixi.js';

export class ResultDisplay {
  private displayObject: Container;
  private resultText: Text;

  constructor() {
    this.displayObject = new Container();
    this.resultText = new Text('', new TextStyle({
      fontFamily: 'Arial',
      fontSize: 24,
      fill: '#ffffff',
      align: 'center',
    }));
    this.resultText.anchor.set(0.5);
    this.displayObject.addChild(this.resultText);
  }

  public getDisplayObject(): Container {
    return this.displayObject;
  }

  public setText(text: string): void {
    this.resultText.text = text;
  }
}
