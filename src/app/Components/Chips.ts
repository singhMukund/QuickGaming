import { Container, Sprite, Text, TextStyle, Texture } from 'pixi.js';

export class Chips {
    private container: Container;
    private chips!: Sprite[];
    private chipsValues: number[];
    private onClick: (value: number) => void;
    chipTextures: Texture[];
    clonedShip!: Sprite;
    constructor(chipsValues: number[], onClick: (value: number) => void, chipTextures: Texture[]) {
        this.chipsValues = chipsValues;
        this.onClick = onClick;
        this.chipTextures = chipTextures;
        this.container = new Container();
        this.createChips();
        this.positionChips();
    }

    createChips() {
        this.chips = this.chipsValues.map((value, index) => {
            const chip = new Sprite(this.chipTextures[index]);
            chip.anchor.set(0.5);
            chip.scale.set(0.15);
            if (index === this.chipsValues.length - 1) {
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

        const totalChipsWidth = this.chips.reduce((totalWidth, chip) => totalWidth + chip.width, 0) + (this.chips.length - 1) * chipSpacing;

        const startX = (window.innerWidth - totalChipsWidth) / 2;

        let x = startX;

        this.chips.forEach((chip, index) => {
            chip.x = x;
            chip.y = window.innerHeight - chip.height / 2 - 10; // Adjust the position as needed
            x += chip.width + chipSpacing;

            if (index === this.chips.length - 1) {
                chip.y += 10;
            }
        });
    }

    getContainer() {
        return this.container;
    }
}
