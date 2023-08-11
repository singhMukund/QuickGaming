import { Sprite } from 'pixi.js';
import { Card, Rank, Suit } from './Card';
import { Hand } from './Hand';

export class Dealer {
  private hand: Hand;
  private backCard: Sprite | null;

  constructor() {
    this.hand = new Hand();
    this.backCard = null;
  }

  getHand(): Hand {
    return this.hand;
  }

  getBackCard(): Sprite | null {
    return this.backCard;
  }

  dealCard(card: Card): void {
    this.hand.addCard(card);
    // if (!this.backCard) {
    //   this.backCard = card.getCardSprite();
    //   this.backCard.visible = false;
    // } else {
      
    // }
  }

  clearHand(): void {
    this.hand.clear();
    this.backCard = null;
  }
}
