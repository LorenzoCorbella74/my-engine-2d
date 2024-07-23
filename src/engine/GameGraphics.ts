import { Graphics, Container } from 'pixi.js';

export class GameGraphics {
    private graphic: Graphics;

    constructor(parent: Container) {
        this.graphic = new Graphics();
        parent.addChild(this.graphic);
    }

    drawRectangle(x: number, y: number, width: number, height: number, color: number = 0xFFFFFF, alpha: number = 1) {
        this.graphic.rect(x, y, width, height);
        this.graphic.fill(color);
        this.graphic.position.set(x, y);    
        return this.graphic
    }

    drawCircle(x: number, y: number, radius: number, color: number = 0xFFFFFF, alpha: number = 1) {
        this.graphic.circle(x, y, radius);
        this.graphic.fill(color);
        return this.graphic
    }

    drawLine(x1: number, y1: number, x2: number, y2: number, color: number = 0xFFFFFF, alpha: number = 1, thickness: number = 1) {
        this.graphic.moveTo(x1, y1);
        this.graphic.lineTo(x2, y2);
        this.graphic.stroke({ width: thickness, color, alpha });
        return this.graphic
    }

    destroy() {
        this.graphic.clear();
    }
}