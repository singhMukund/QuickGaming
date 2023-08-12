import { Container, Graphics, Sprite, Text, TextStyle, Texture, filters } from 'pixi.js';

export class Balance {
    private container: Container;
    private balanceText!: Text;
    private balance: number;
    private texture: Texture;
    private balanceBg!: Graphics;

    constructor(texture: Texture) {
        this.balance = 0;
        this.texture = texture;
        this.container = new Container();
        this.createBalanceDisplay();
        this.updateBalanceText();
        this.positionElements();
    }

    createBalanceDisplay() {
        this.balanceBg = new Graphics();
        this.balanceBg.beginFill(0x65FF37);
        this.balanceBg.drawRect(-2, -2, 200, 40);
        this.balanceBg.beginFill(0x02a732); 
        this.balanceBg.drawRect(0, 0, 195, 35); 
         // @ts-ignore
        this.balanceBg.endFill();
        this.container.addChild(this.balanceBg);
        const style = new TextStyle({
            fontFamily: 'Arial',
            fontSize: 24,
            fontWeight : 'bold',
            fill: '#000000',
        });

        this.balanceText = new Text(`Balance: ${this.balance}`, style);
        this.container.addChild(this.balanceText);
    }

    updateBalance(amount: number) {
        this.balance = amount;
        this.updateBalanceText();
    }

    getBalance(): number {
        return this.balance;
    }

    updateBalanceText() {
        this.balanceText.text = `Balance: ${this.balance}`;
    }

    positionElements() {
        this.balanceBg.x = (window.innerWidth - this.balanceBg.width) * 0.5 + 6;
        this.balanceBg.y =  45;
        this.balanceText.x = (window.innerWidth - 150) * 0.5;
        this.balanceText.y = 50; 
    }

    getContainer() {
        return this.container;
    }
}
