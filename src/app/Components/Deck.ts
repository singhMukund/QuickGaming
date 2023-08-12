// Deck.ts

import { Texture } from 'pixi.js';
import { Card, Suit, Rank } from './Card';

export class Deck {
  private cards: Card[];

  constructor() {
    this.cards = this.createDeck();
    this.shuffleDeck();
  }

  private createDeck(): Card[] {
    const cards: Card[] = [];

    for (let i : number = 0;i<Suit.length;i++) {
      for (let j:number=0;j<Rank.length;j++) {
        let texture : Texture = Texture.from(`${Suit[i] + parseInt(Rank[j])}`);
        const card = new Card(Suit[i], Rank[j],texture);
        cards.push(card);
      }
    }

    return cards;
  }

  private shuffleDeck(): void {
    let currentIndex = this.cards.length;
    let temporaryValue;
    let randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      temporaryValue = this.cards[currentIndex];
      this.cards[currentIndex] = this.cards[randomIndex];
      this.cards[randomIndex] = temporaryValue;
    }
  }

  dealCard(): Card | null {
    if (this.cards.length > 0) {
      return this.cards.pop()!;
    }
    return null;
  }

  getDeckSize(): number {
    return this.cards.length;
  }

  resetDeck(): void {
    this.cards = this.createDeck();
    this.shuffleDeck(); 
  }
}
