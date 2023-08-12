import { Hand } from './Hand';
import { Card } from './Card';

export class Player {
  private hand: Hand;
  private chips: number;
  private bet: number;

  constructor(startingChips: number) {
    this.hand = new Hand();
    this.chips = startingChips;
    this.bet = 0;
  }

  getChips(): number {
    return this.chips;
  }

  getBet(): number {
    return this.bet;
  }

  getHand(): Hand {
    return this.hand;
  }

  placeBet(amount: number): boolean {
    if (amount >= 100 && amount <= this.chips) {
      this.bet = amount;
      this.chips -= amount; // Deduct the bet amount from the player's chips
      return true;
    }
    return false;
  }

  clearBet(): void {
    this.bet = 0;
  }

  addWinnings(winnings: number): void {
    this.chips += winnings;
  }

  // Subtract bet from chips when losing
  loseBet(): void {
    this.chips -= this.bet;
  }

  dealCard(card: Card): void {
    this.hand.addCard(card);
  }

  clearHand(): void {
    this.hand.clear();
  }
}
