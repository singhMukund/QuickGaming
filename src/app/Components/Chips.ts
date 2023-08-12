import { Container, Sprite, Text, TextStyle, Texture } from 'pixi.js';

export class Chips {
    private container: Container;
    private chips!: Sprite[];
    private chipsValues: number[];
    private onClick: (value: number) => void;
    chipTextures: Texture[];
    constructor(chipsValues : number[], onClick :(value: number) => void ,chipTextures: Texture[]) {
        this.chipsValues = chipsValues;
        this.onClick = onClick;
        this.chipTextures= chipTextures;
        this.container = new Container();
        this.createChips();
        this.positionChips();
    }

    createChips() {
        this.chips = this.chipsValues.map((value, index) => {
            const chip = new Sprite(this.chipTextures[index]);
            chip.anchor.set(0.5);
            chip.scale.set(0.15);
            if(index === this.chipsValues.length -1){
                chip.scale.set(1);
            }
            chip.interactive = true;
            chip.buttonMode = true;
            chip.on('pointerdown', () => this.onClick(value));
            this.container.addChild(chip);
            return chip;
        });
    }

    positionChips() {
        const chipSpacing = 10;
        let x = chipSpacing;

        this.chips.forEach(chip => {
            chip.x = x;
            chip.y = window.innerHeight - chip.height / 2 - 10; // Adjust the position as needed
            x += chip.width + chipSpacing;
        });
    }

    getContainer() {
        return this.container;
    }
}
