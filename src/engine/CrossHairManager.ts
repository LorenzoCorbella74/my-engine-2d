import { Application, Graphics, Sprite } from 'pixi.js';
import { MyEngine2D } from './Engine';
import { Scene } from './Scene';

export class CrossHairManager {

    crosshair!: Graphics | Sprite;
    app:Application

    constructor(public engine: typeof MyEngine2D) { 
        this.app= engine.app;
    }

    activateOnCurrentScene(currentScene: Scene, crosshair: Graphics | Sprite) {
        this.crosshair = crosshair
        currentScene.addChild(this.crosshair);

        this.show();

        const onTick = () => {
        const { x, y } = this.engine.mouse.getMouse();
        this.crosshair.position.set(x, y);
        }

        this.app.ticker.add(onTick)

        return this.crosshair
    }

    removeCrossHair() {
        if (this.crosshair) {
            this.crosshair.destroy();
        }
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

    toggle() {
        if (this.crosshair.visible) {
            this.hide();
        } else {
            this.show();
        }
    }
}