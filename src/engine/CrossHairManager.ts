import { Graphics } from 'pixi.js';
import { PixiEngine as engine } from './Engine';
import { Scene } from './Scene';

export class CrossHairManager {

    crosshair!: Graphics;    // TODO: trasformare in Sprite:  https://pixijs.com/examples/events/custom-mouse-icon?_highlight=mouse

    constructor() { }

    activateOnCurrentScene(currentScene: Scene) {
        // Creazione del mirino
        this.crosshair = new Graphics();
        this.crosshair.lineStyle(2, 0xFFFFFF, 1);
        this.crosshair.moveTo(-15, 0);
        this.crosshair.lineTo(15, 0);
        this.crosshair.moveTo(0, -15);
        this.crosshair.lineTo(0, 15);
        this.crosshair.position.set(engine.app.screen.width / 2, engine.app.screen.height / 2);
        currentScene.addChild(this.crosshair);

        this.show();

        return this.crosshair
    }

    show() {
        if (engine.app.view.style) {
            engine.app.view.style.cursor = 'none';
            this.crosshair.visible = true
        }
    }

    hide() {
        // Nascondere l'icona del mouse usando CSS
        if (engine.app.view.style) {
            this.crosshair.visible = false;
            engine.app.view.style.cursor = 'default';

        }
    }
}