import { Sprite, Texture } from 'pixi.js';

export class BackCard {
  private sprite: Sprite;

  constructor(texture:Texture) {
    this.sprite = new Sprite(texture);
    this.sprite.scale.set(0.92);
    this.hide();
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
