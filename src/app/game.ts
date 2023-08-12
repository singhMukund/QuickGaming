// Game.ts
import { Application, Container, Graphics, Loader, Sprite, Text, TextStyle, Texture, autoDetectRenderer } from 'pixi.js';
import { Background } from './Background/Background';
import { Deck } from './Components/Deck';
import { Player } from './Components/Player';
import { Dealer } from './Components/Dealer';
import { Card, Suit, Rank } from './Components/Card';
import { ResultDisplay } from './Result/ResultDisplay';
import gsap from 'gsap';
import { BackCard } from './Components/BackCard';
import { Chips } from './Components/Chips';
import { Balance } from './UI/Balance';


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
  private chips!: Chips;
  private level = 1;
  private ranks = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13'];
  private suits = [1000, 2000, 3000, 4000];
  private cardIds: string[] = [];
  private balanceDisplay!: Balance;




  private betAmount = 0;
  private backCard!: BackCard;
  private playerCardMap: Map<string, Card> = new Map();
  private dealerCardMap: Map<string, Card> = new Map();
  private scoreCardContainer!: Container;
  private scoreCardUI!: Sprite;
  private playerText !: Text;

  private dealerScoreCardUI!: Sprite;
  private dealerScoreText !: Text;
  textStyle = new TextStyle({
    fontFamily: 'Arial',
    fontSize: 24,
    fill: '#ffffff',
    align: 'center' // White color
  });
  private renderer: any;



  constructor() {
    this.app = new Application({
      backgroundColor: 0x02a732,
      width: window.innerWidth,
      height: window.innerHeight,
      // autoResize: true,
    });
    const pixiContainer = document.getElementById('pixi-container');
    if (pixiContainer) {
      pixiContainer.appendChild(this.app.view);
    }
    (globalThis as any).__PIXI_APP__ = this.app;

    this.gameContainer = new Container();
    this.app.stage.addChild(this.gameContainer);
    this.loader = new Loader();
    this.loadImages();
  }

  private loadImages() {
    this.loader.add('scoreCardBG', './assets/UI_ICON/scoreCard.png');
    this.loader.add('BackCard', './assets/BackCard/BackCard.png');
    this.loader.add('Chip1', './assets/Chips/Chips1.png');
    this.loader.add('Chip2', './assets/Chips/Chips2.png');
    this.loader.add('Chip5', './assets/Chips/Chips5.png');
    this.loader.add('Chip10', './assets/Chips/Chips10.png');
    this.loader.add('Chip20', './assets/Chips/Chips20.png');
    this.loader.add('Chips_Back', './assets/Chips/chips_Back.png');
    this.loader.add('Add_button', './assets/UI_ICON/add_button.png');


    for (let i: number = 0; i < this.suits.length; i++) {
      for (let j: number = 0; j < this.ranks.length; j++) {
        const fileName = `${this.suits[i] + parseInt(this.ranks[j])}`;
        this.cardIds.push(fileName);
        this.loader.add(fileName, `./assets/Cards/${fileName}.png`);
      }
    }
    this.loader.add('bg', './assets/Background/Table_Img.png');
    // @ts-ignore
    const loadAssets = () => {
      return new Promise<void>((resolve, reject) => {
        this.loader.load(() => {
          resolve();
        });
        // @ts-ignore
        this.loader.onError.add((error) => {
          // Handle loading errors
          console.error("Error loading assets:", error);
          reject(error);
        });
      });
    };


    loadAssets()
      .then(() => {
        // This is called when assets are loaded
        this.onLoadComplete();
      })
      .catch((error) => {
        // Handle any errors from loading assets
      });
  }

  private onLoadComplete() {
    new Background(this.app, this.loader);
    this.deck = new Deck();
    this.player = new Player(1000);
    this.dealer = new Dealer();
    this.resultDisplay = new ResultDisplay(); 
    this.balanceDisplay = new Balance(Texture.from('Add_button')); // You can set the initial balance here
    this.app.stage.addChild(this.balanceDisplay.getContainer());// No constructor argument needed
    this.app.stage.addChild(this.resultDisplay.getDisplayObject());
    this.resultDisplay.getDisplayObject().x =(window.innerWidth) * 0.5;
    this.resultDisplay.getDisplayObject().y = (window.innerHeight - 50) * 0.5;
    this.scoreCardContainer = new Container();
    this.backCard = new BackCard(Texture.from('BackCard'));
    this.app.stage.addChild(this.backCard.getSprite());
    this.initializeUIcon();
    this.subscribeEvents();
    this.enableDealButton();
    this.initializeChips();
    this.startNewRound();
    this.updateBalance(this.player.getChips());
  }

  private initializeChips(): void {
    const chipTextures = [
      Texture.from('Chip1'),
      Texture.from('Chip2'),
      Texture.from('Chip5'),
      Texture.from('Chip10'),
      Texture.from('Chip20'),
    ];
    this.chips = new Chips([1, 2, 5, 10, 20], this.onChipClick.bind(this), chipTextures);
    this.app.stage.addChild(this.chips.getContainer());
  }

  private onChipClick(value: number): void {
    console.log("Chips click" + value);
    this.betAmount += value;
    let balance = this.balanceDisplay.getBalance() - value;
    this.updateBalance(balance);
  }

  private initializeUIcon(): void {
    this.app.stage.addChild(this.scoreCardContainer);
    this.scoreCardContainer.name = 'scoreCardContainer';
    this.scoreCardUI = new Sprite(Texture.from('scoreCardBG'));
    this.scoreCardContainer.addChild(this.scoreCardUI);
    this.scoreCardUI.name = 'scoreCardUI';
    this.scoreCardUI.setTransform(300, 400);
    this.playerText = new Text('0', this.textStyle);
    this.scoreCardContainer.addChild(this.playerText);


    //Dealer Score Card 

    this.dealerScoreCardUI = new Sprite(Texture.from('scoreCardBG'));
    this.scoreCardContainer.addChild(this.dealerScoreCardUI);
    this.dealerScoreCardUI.name = 'dealerScoreCardUI';
    this.dealerScoreCardUI.setTransform(300, 400);
    this.dealerScoreText = new Text('0', this.textStyle);
    this.scoreCardContainer.addChild(this.dealerScoreText);


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

  updateBalance(amount: number) {
    this.balanceDisplay.updateBalance(amount);
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
    this.addResizeListener();
  }

  private startNewRound() {
    this.player.clearHand();
    this.dealer.clearHand();
    this.resultDisplay.setText('');

    if (this.deck.getDeckSize() <= 4) {
      this.deck.resetDeck();
      this.level++;
      this.levelUp(`Level Up! Level: ${this.level}`);
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

  private addResizeListener() {
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  private renderCards() {
    this.gameContainer.removeChildren();
    const playerCards = this.player.getHand().getCards();
    const dealerCards = this.dealer.getHand().getCards();
    // Distance between cards
    const cardSpacing = 0;
    // Angle of rotation for the cards
    let rotationAngle = -20; // in degrees
    const centerX = window.innerWidth * 0.5;
    // Render player cards
    // let playerCardX = 100;
    // const playerCardY = 500;
    this.backCard.getSprite().alpha = 1;
    this.backCard.getSprite().scale.set(0.65);
    this.backCard.getSprite().skew.set(0, 0);

    let playerCardX = (centerX - (playerCards.length - 1) * cardSpacing * 0.5);
    for (let i = 0; i < playerCards.length; i++) {
      rotationAngle = rotationAngle + 5 * i;
      if (i === dealerCards.length - 1) {
        rotationAngle = 0;
      }
      const card = playerCards[i];
      const cardSprite = card.getSprite();
      card.setId(`playerCard_${i}`);
      cardSprite.anchor.set(0, 1);
      this.playerCardMap.set(`playerCard_${i}`, card);
      const playerCardY = window.innerHeight - cardSprite.height;
      cardSprite.position.set(playerCardX - (cardSprite.width * 0.5), (playerCardY));
      cardSprite.rotation = rotationAngle * (Math.PI / 180); // Convert degrees to radians
      this.gameContainer.addChild(cardSprite);
      this.scoreCardUI.setTransform(cardSprite.x, cardSprite.y - 60);
      this.playerText.text = `${this.player.getHand().getHandValue()}`;
      this.playerText.y = this.scoreCardUI.y + (this.scoreCardUI.height) / 4 + 5;
      this.playerText.x = this.scoreCardUI.x + (this.scoreCardUI.width) / 4 + 5;
      playerCardX += cardSpacing;
    }

    // Render dealer cards
    rotationAngle = -15;
    let dealerCardX = (centerX - (dealerCards.length - 1) * cardSpacing * 0.5);
    this.backCard.show();
    for (let i = 0; i < dealerCards.length; i++) {
      rotationAngle = rotationAngle + 5 * i;
      if (i === dealerCards.length - 1) {
        rotationAngle = 0;
      }
      const card = dealerCards[i];
      const cardSprite = card.getSprite();
      card.setId(`dealerCard_${i}`);
      cardSprite.anchor.set(0, 1);
      this.dealerCardMap.set(`dealerCard_${i}`, card);
      const dealerCardY = window.innerHeight - cardSprite.height;
      cardSprite.position.set(dealerCardX - (cardSprite.width * 0.5), (dealerCardY * 0.5));
      cardSprite.rotation = rotationAngle * (Math.PI / 180); // Convert degrees to radians
      this.gameContainer.addChild(cardSprite);
      dealerCardX += cardSpacing;
      this.backCard.getSprite().x = cardSprite.x;
      this.backCard.getSprite().y = cardSprite.y;
      this.backCard.getSprite().anchor.set(0, 1);
      this.backCard.getSprite().rotation = cardSprite.rotation;

      //score card text n
      this.dealerScoreCardUI.setTransform(cardSprite.x, cardSprite.y - 60);
      this.dealerScoreText.text = `${this.dealer.getHand().getHandValue()}`;
      this.dealerScoreText.y = this.dealerScoreCardUI.y + (this.dealerScoreCardUI.height) / 4 + 5;
      this.dealerScoreText.x = this.dealerScoreCardUI.x + (this.dealerScoreCardUI.width) / 4 + 5;
      if (i === 1) {
        card.hide();
        cardSprite.alpha = 0;
      }
    }
  }


  private hitPlayer() {
    if (this.player.getHand().getHandValue() < 21) {
      this.player.dealCard(this.deck.dealCard()!);
      if (this.deck.getDeckSize() <= 4) {
        this.deck.resetDeck();
        this.level++;
        this.levelUp(`Level Up! Level: ${this.level}`);
      }
      this.renderCards();

      if (this.player.getHand().getHandValue() >= 21) {
        this.endRound();
      }
    }
  }

  private levelUp(text: string): void {
    // Reset the player's chips and level up
    this.player = new Player(1000);
    this.resultDisplay.setText(text);

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

  // Handler function for window resize events
  private handleResize(): void {
    this.app.renderer.resize(window.innerWidth, window.innerHeight);
    // Update your game layout and positions here
    // const screenWidth = window.innerWidth;
    // const screenHeight = window.innerHeight;

    // // Adjust app size
    // this.app.renderer.resize(screenWidth, screenHeight);
    // if (window.innerWidth / window.innerHeight >= this.ratio) {
    //   var w = window.innerHeight * this.ratio;
    //   var h = window.innerHeight;
    // } else {
    //   var w = window.innerWidth;
    //   var h = window.innerWidth / this.ratio;
    // }
    // this.renderer.view.style.width = w + 'px';
    // this.renderer.view.style.height = h + 'px';
    // const parent = this.app.view.parentNode;

    // // Resize the renderer
    // if (parent !== null) {
    //   // @ts-ignore
    //   this.app.renderer.resize(parent.clientWidth, parent.clientHeight);
    // }
  }

  private dealerTurn(): void {
    const dealerHand = this.dealer.getHand();
    const cards = dealerHand.getCards();
    const lastCard = cards[cards.length - 1];

    if (!lastCard.getActive()) {
      lastCard.show();
      // Flip back card by animating its alpha from 1 to 0
      // Flip the hidden card by rotating it from 0 to 180 degrees
      gsap.to(this.backCard.getSprite().skew, {
        y: -3.6, duration: 0.5, onStart: () => {
          gsap.to(this.backCard.getSprite(), {
            alpha: 0, duration: 0.5
          })
          // After the first rotation, change the texture to the front face
          const card: Sprite = lastCard.getSprite()

          // Flip the card back to its original position by rotating it from 180 to 360 degrees
          gsap.to(card, {
            alpha: 1, duration: 0.5, onComplete: () => {
              // Continue with the evaluation after a delay (1500ms)

              this.evaluateResult();
            }
          });
        }
      });
    } else {
      // If the last card is not hidden, evaluate the result
      this.evaluateResult();
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
    let winAmount = 0;

    let resultMessage = '';
    if (playerHandValue > 21) {
      resultMessage = 'Player Busts! Dealer Wins!';
      this.player.loseBet();
      winAmount = -this.betAmount;
    } else if (dealerHandValue > 21) {
      resultMessage = `Dealer Busts! Player Wins!\n Win Amount is ${this.betAmount}`;
      this.player.addWinnings(this.betAmount);
      winAmount = this.betAmount;
    } else if (playerHandValue === dealerHandValue) {
      resultMessage = "It's a Tie!";
      this.player.addWinnings(this.betAmount / 2);
      winAmount = this.betAmount / 2;
    } else if (playerHandValue > dealerHandValue) {
      resultMessage = `Player Wins! \n Win Amount is ${this.betAmount}`;
      this.player.addWinnings(this.betAmount);
      winAmount = - this.betAmount;
    } else {
      resultMessage = 'Dealer Wins!';
      this.player.loseBet();
    }
    this.updateBalance(this.balanceDisplay.getBalance() + winAmount);

    this.resultDisplay.setText(resultMessage);
    this.resultDisplay.getDisplayObject().alpha = 0;
    this.resultDisplay.getDisplayObject().scale.set(0);

    gsap.timeline()
    .to(this.resultDisplay.getDisplayObject(), { alpha: 1, duration: 0.5,  onStart: () => {
      gsap.to(this.resultDisplay.getDisplayObject().scale, { x : 1, y:1, duration: 0.5, ease: 'power2.out' })
    }, ease: 'power2.out' })
    .to({}, { duration: 0.5, delay: 0.5 }) // Wait for 500ms
    .to(this.resultDisplay.getDisplayObject(), { alpha: 0, duration: 0.5,  onStart: () => {
      gsap.to(this.resultDisplay.getDisplayObject().scale, { x : 0, y:0, duration: 0.5, ease: 'power2.in' })
    }, ease: 'power2.in' });

    // setTimeout(() => {
    //   // this.resultDisplay.getDisplayObject().visible = false;
    // }, 1500);
  
    if (this.player.getChips() <= 0) {
      this.levelUp('Fill the pump by add new bet by place bet button');
    } else {
      this.enableDealButton();
    }
    this.betAmount= 0;
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
