import { Card } from './Card';

export class Hand {
  private cards: Card[];

  constructor() {
    this.cards = [];
  }

  getCards(): Card[] {
    return this.cards;
  }

  addCard(card: Card): void {
    this.cards.push(card);
  }

  clear(): void {
    this.cards = [];
  }

  getHandValue(): number {
    let handValue = 0;
    let hasAce = false;

    for (const card of this.cards) {
      const rank = card.getRank();

      if (rank === '01') {
        hasAce = true;
        handValue += 11;
      } else if (parseInt(rank) >= 11) {
        handValue += 10;
      } else {
        handValue += parseInt(rank);
      }
    }

    // Adjust Ace value if hand value exceeds 21
    if (hasAce && handValue > 21) {
      handValue -= 10;
    }

    return handValue;
  }

  // Add method to toggle the isHidden property of the last card
  toggleLastCardHidden(): void {
    const lastCard = this.cards[this.cards.length - 1];
    lastCard.toggleIsHidden();
  }

  flipLastCard(): void {
    const cards = this.getCards();
    if (cards.length > 0) {
      const lastCard = cards[cards.length - 1];
      if (lastCard.isCardHidden()) {
        lastCard.show();
      }
    }
  }
}
