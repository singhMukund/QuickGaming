// Game.ts
import { Application, Container, Loader, Sprite, Texture } from 'pixi.js';
import { Background } from './Background/Background';
import { Deck } from './Components/Deck';
import { Player } from './Components/Player';
import { Dealer } from './Components/Dealer';
import { Card, Suit, Rank } from './Components/Card';
import { ResultDisplay } from './Result/ResultDisplay';
import gsap from 'gsap';
import { BackCard } from './Components/BackCard';


export class Game {
  private app: Application;
  private appWidth = 1270;
  private appHeight = 720;
  private loader!: Loader;
  private gameContainer!: Container;
  private deck!: Deck;
  private player!: Player;
  private dealer!: Dealer;
  private resultDisplay!: ResultDisplay;
  private level = 1;
  private ranks = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13'];
  private suits = [1000, 2000, 3000, 4000];

  private betAmount = 100;
  private backCard!: BackCard;


  constructor() {
    this.app = new Application({
      backgroundColor: 0x02a732,
      width: this.appWidth,
      height: this.appHeight,
      resizeTo: window,
    });

    const pixiContainer = document.getElementById('pixi-container');
    if (pixiContainer) {
      pixiContainer.appendChild(this.app.view);
    }
    (globalThis as any).__PIXI_APP__ = this.app;

    this.gameContainer = new Container();
    this.app.stage.addChild(this.gameContainer);
    this.backCard = new BackCard();
    this.gameContainer.addChild(this.backCard.getSprite());
    this.loader = new Loader();
    this.loadImages();
  }

  private loadImages() {
    for (let i: number = 0; i < this.suits.length; i++) {
      for (let j: number = 0; j < this.ranks.length; j++) {
        const fileName = `${this.suits[i] + parseInt(this.ranks[j])}.png`;
        this.loader.add(fileName, `./assets/Cards/${fileName}`);
      }
    }
    this.loader.add('bg', './assets/Background/Table_Img.png').load(this.onLoadComplete.bind(this));
  }

  private onLoadComplete() {
    new Background(this.app, this.loader);
    this.deck = new Deck();
    this.player = new Player(1000);
    this.dealer = new Dealer();
    this.resultDisplay = new ResultDisplay(); // No constructor argument needed
    this.gameContainer.addChild(this.resultDisplay.getDisplayObject());
    this.subscribeEvents();
    this.enableDealButton();
    this.startNewRound();
  }

  private enableDealButton() {
    const dealButton = document.getElementById('deal-button') as HTMLButtonElement;
    const hitButton = document.getElementById('hit-button') as HTMLButtonElement;
    const standButton = document.getElementById('stand-button') as HTMLButtonElement;
    const betButton = document.getElementById('bet-button') as HTMLButtonElement;

    if (dealButton) {
      dealButton.disabled = false;
    }
    if (hitButton) {
      hitButton.disabled = true;
    }
    if (standButton) {
      standButton.disabled = true;
    }
    if (betButton) {
      betButton.disabled = false;
    }
  }

  private subscribeEvents() {
    const dealButton = document.getElementById('deal-button');
    const hitButton = document.getElementById('hit-button');
    const standButton = document.getElementById('stand-button');
    const betButton = document.getElementById('bet-button');

    if (dealButton) {
      dealButton.addEventListener('click', () => {
        this.startNewRound();
        this.enableHitAndStandButtons();
      });
    }
    if (hitButton) {
      hitButton.addEventListener('click', () => this.hitPlayer());
    }
    if (standButton) {
      standButton.addEventListener('click', () => this.standPlayer());
    }
    if (betButton) {
      betButton.addEventListener('click', () => this.placeBet());
    }
  }

  private startNewRound() {
    this.player.clearHand();
    this.dealer.clearHand();
    this.resultDisplay.setText('');
  
    if (this.deck.getDeckSize() <= 0) {
      this.deck.resetDeck();
      this.level++;
    }
  
    for (let i = 0; i < 2; i++) {
      this.player.dealCard(this.deck.dealCard()!);
      this.dealer.dealCard(this.deck.dealCard()!);
    }
  
    this.renderCards();
  
    if (this.player.getHand().getHandValue() === 21) {
      this.endRound();
    }
    this.enableButtons();
    this.enableStandButton(); // Enable the "Stand" button at the start of a new round
  }

  private enableStandButton(): void {
    const standButton = document.getElementById('stand-button') as HTMLButtonElement;
    if (standButton) {
      standButton.disabled = false;
    }
  }

  private enableButtons(): void {
    const betButton = document.getElementById('bet-button') as HTMLButtonElement;
    const hitButton = document.getElementById('hit-button') as HTMLButtonElement;
  
    if (betButton) {
      betButton.disabled = false;
    }
  
    if (hitButton) {
      hitButton.disabled = false;
    }
  
    // Enable the "Stand" button only if the player's hand value is less than 21
    const standButton = document.getElementById('stand-button') as HTMLButtonElement;
    if (standButton) {
      standButton.disabled = this.player.getHand().getHandValue() >= 21;
    }
  }

  private renderCards() {
    this.gameContainer.removeChildren();

    const playerCards = this.player.getHand().getCards();
    const dealerCards = this.dealer.getHand().getCards();

    // Render player cards
    let playerCardX = 100;
    const playerCardY = 500;
    for (const card of playerCards) {
      const cardSprite = this.getCardSprite(card);
      cardSprite.position.set(playerCardX, playerCardY);
      this.gameContainer.addChild(cardSprite);
      playerCardX += 100;
    }

    // Render dealer cards
    let dealerCardX = 100;
    const dealerCardY = 100;
    for (let i = 0; i < dealerCards.length; i++) {
      const card = dealerCards[i];
      const cardSprite = this.getCardSprite(card);

      if (i === 0) {
        // Use the back card sprite for the first dealer card
        cardSprite.texture = this.backCard.getSprite().texture;
      }

      cardSprite.position.set(dealerCardX, dealerCardY);
      this.gameContainer.addChild(cardSprite);
      dealerCardX += 100;
    }
  }

  private getCardSprite(card: Card): Sprite {
    const textureName = this.getCardTextureName(card);
    return new Sprite(this.loader.resources[`${textureName}`].texture);
  }

  private getCardTextureName(card: Card): string {
    const rank = card.getRank();
    const suit = card.getSuit();
    return `${suit + parseInt(rank)}.png`;
  }

  private hitPlayer() {
    if (this.player.getHand().getHandValue() < 21) {
      this.player.dealCard(this.deck.dealCard()!);
      this.renderCards();

      if (this.player.getHand().getHandValue() >= 21) {
        this.endRound();
      }
    }
  }

  private levelUp(): void {
    // Reset the player's chips and level up
    this.player = new Player(1000);
    this.level++;
    this.resultDisplay.setText(`Level Up! Level: ${this.level}`);

    // Enable the bet button to start a new round
    this.enableBetButton();
  }
  private enableBetButton(): void {
    const betButton = document.getElementById('bet-button') as HTMLButtonElement;
    if (betButton) {
      betButton.disabled = false;
    }
  }

  private standPlayer() {
    this.endRound();
  }

  private endRound() {
    this.disableButtons();
    this.dealerTurn();
  }
  
  private dealerTurn(): void {
    const dealerHand = this.dealer.getHand();
    const cards = dealerHand.getCards();
    const lastCard = cards[cards.length - 1];
  
    if (lastCard.isCardHidden()) {
      // Flip back card by animating its alpha from 1 to 0
      gsap.to(lastCard.getCardSprite(), { alpha: 0, duration: 1, onComplete: () => {
        lastCard.hide();
        this.renderCards();
        // Continue the dealer turn after a delay (1500ms)
        this.evaluateResult();
      }});
    } else {
      // If the last card is not hidden, evaluate the result
      this.evaluateResult();
    }
  }
  
  
  private flipBackCardWithAnimation(): void {
    const dealerHand = this.dealer.getHand();
    const cards = dealerHand.getCards();
    if (cards.length > 0) {
      const lastCard = cards[cards.length - 1];
      if (lastCard.isCardHidden()) {
        lastCard.show();
        setTimeout(() => {
          lastCard.hide();
          this.renderCards();
        }, 500);
      }
    }
  }
  

  private disableButtons(): void {
    const betButton = document.getElementById('bet-button') as HTMLButtonElement;
  const hitButton = document.getElementById('hit-button') as HTMLButtonElement;
  const standButton = document.getElementById('stand-button') as HTMLButtonElement;

  if (betButton) {
    betButton.disabled = true;
  }

  if (hitButton) {
    hitButton.disabled = true;
  }

  if (standButton) {
    standButton.disabled = true;
  }
  }

  private evaluateResult() {
    const playerHandValue = this.player.getHand().getHandValue();
    const dealerHandValue = this.dealer.getHand().getHandValue();

    let resultMessage = '';
    if (playerHandValue > 21) {
      resultMessage = 'Player Busts! Dealer Wins!';
      this.player.loseBet();
    } else if (dealerHandValue > 21) {
      resultMessage = 'Dealer Busts! Player Wins!';
      this.player.addWinnings(this.betAmount);
    } else if (playerHandValue === dealerHandValue) {
      resultMessage = "It's a Tie!";
      this.player.addWinnings(this.betAmount / 2);
    } else if (playerHandValue > dealerHandValue) {
      resultMessage = 'Player Wins!';
      this.player.addWinnings(this.betAmount);
    } else {
      resultMessage = 'Dealer Wins!';
      this.player.loseBet();
    }

    this.resultDisplay.setText(resultMessage);

    if (this.player.getChips() <= 0) {
      this.levelUp();
    } else {
      this.enableDealButton();
    }
  }


  private enableHitAndStandButtons(): void {
    const hitButton = document.getElementById('hit-button') as HTMLButtonElement;
    const standButton = document.getElementById('stand-button') as HTMLButtonElement;

    if (hitButton) {
      hitButton.disabled = false;
    }
    if (standButton) {
      standButton.disabled = false;
    }
  }

  private placeBet(): void {
    console.log("Plave bet called");
    const betInput = document.getElementById('bet-amount') as HTMLInputElement;
    const betAmount = parseInt(betInput.value);

    if (betAmount >= 100 && betAmount <= 1000) {
      // Set the bet amount for the player
      this.betAmount = betAmount;

      // Disable the bet button to prevent multiple bets in one round
      const betButton = document.getElementById('bet-button') as HTMLButtonElement;
      betButton.disabled = true;

      // Enable the "Stand" button
      this.enableStandButton();

      // Start a new round
      this.startNewRound();
    } else {
      alert('Please enter a valid bet amount between 100 and 1000.');
    }
  }
}

// Card, Dealer, Deck, Hand, Player classes remain the same
