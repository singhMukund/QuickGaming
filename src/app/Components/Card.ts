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

  constructor(suit: number, rank: string) {
    this.suit = suit;
    this.rank = rank;
    this.isHidden = true;
    this.frontTexture = Texture.from(`${suit + parseInt(rank)}.png`);
    this.sprite = new Sprite(this.frontTexture);
  }

  getSuit(): number {
    return this.suit;
  }

  getRank(): string {
    return this.rank;
  }

  getValue(): number {
    // For simplicity, assume that the value of cards is equal to their rank
    // For face cards (11, 12, 13), value will be 10
    // For Ace (01), value can be either 1 or 11 (handled in Hand class)
    const numericValue = parseInt(this.rank);
    return isNaN(numericValue) ? 10 : numericValue;
  }

  // Show the front face of the card
  show(): void {
    this.sprite.visible = true;
    this.isHidden = false;
  }

  // Hide the card
  hide(): void {
    this.sprite.visible = false;
    this.isHidden = true;
  }

  // Check if the card is currently hidden
  isCardHidden(): boolean {
    return this.isHidden;
  }

  // Get the PIXI.Sprite for the card's image
  getCardSprite(): Sprite {
    return this.sprite;
  }

  toggleIsHidden(): void {
    this.isHidden = !this.isHidden;
  }
}
