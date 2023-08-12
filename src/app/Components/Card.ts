import { Sprite, Texture } from 'pixi.js';

export const Suit = [1000, 2000, 3000, 4000];

export const Rank = [
  '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13'
];

export class Card {
  private suit: number;
  private rank: string;
  private isHidden: boolean;
  private frontTexture: Texture;
  private sprite: Sprite;
  private id: string ='';

  constructor(suit: number, rank: string,texture:Texture) {
    this.suit = suit;
    this.rank = rank;
    this.isHidden = true;
    this.frontTexture = texture;
    this.sprite = new Sprite(this.frontTexture);
    this.sprite.scale.set(0.7);
  }

  getId() :string{
    return this.id;
  }

  getSprite() :Sprite{
    return this.sprite;
  }

  

  setId(id:string) :void{
    this.id = id;
  }

  getSuit(): number {
    return this.suit;
  }

  getRank(): string {
    return this.rank;
  }

  getValue(): number {
    const numericValue = parseInt(this.rank);
    return isNaN(numericValue) ? 10 : numericValue;
  }

  setTexture(texture:Texture):void{
    this.frontTexture = texture;
    this.sprite.texture = texture;
  }

  getActive() : boolean{
    return this.sprite.visible;
  }

  show(): void {
    this.sprite.visible = true;
    this.isHidden = false;
  }

  hide(): void {
    this.sprite.visible = false;
    this.isHidden = true;
  }

  isCardHidden(): boolean {
    return this.isHidden;
  }

  getCardSprite(): Sprite {
    return this.sprite;
  }

  toggleIsHidden(): void {
    this.isHidden = !this.isHidden;
  }
}
