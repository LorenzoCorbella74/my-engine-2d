import { Graphics, Sprite } from 'pixi.js';
import { MyEngine2D } from './Engine';
import { Scene } from './Scene';

export class CrossHairManager {

    crosshair!: Graphics | Sprite;

    constructor() { }

    activateOnCurrentScene(currentScene: Scene, crosshair: Graphics | Sprite) {
        this.crosshair = crosshair
        currentScene.addChild(this.crosshair);

        this.show();

        return this.crosshair
    }

    show() {
        if (MyEngine2D.app.view.style) {
            MyEngine2D.app.view.style.cursor = 'none';
            this.crosshair.visible = true
        }
    }

    hide() {
        // Nascondere l'icona del mouse usando CSS
        if (MyEngine2D.app.view.style) {
            this.crosshair.visible = false;
            MyEngine2D.app.view.style.cursor = 'default';
        }
    }
}