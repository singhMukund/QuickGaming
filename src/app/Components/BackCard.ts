import { Sprite, Texture } from 'pixi.js';

export class BackCard {
  private texture: Texture;
  private sprite: Sprite;

  constructor() {
    this.texture = Texture.from('./assets/BackCard/BackCard.png');
    this.sprite = new Sprite(this.texture);
    this.hide(); // By default, the back card is hidden
  }

  show(): void {
    this.sprite.visible = true;
  }

  hide(): void {
    this.sprite.visible = false;
  }

  getSprite(): Sprite {
    return this.sprite;
  }
}
