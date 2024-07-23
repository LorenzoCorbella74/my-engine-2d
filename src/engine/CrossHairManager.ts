import { Application, Graphics, Sprite } from 'pixi.js';
import { MyEngine2D } from './Engine';
import { Scene } from './Scene';

/**
 * Manages the crosshair in the game engine.
 */
export class CrossHairManager {
    crosshair!: Graphics | Sprite;
    app: Application;

    /**
     * Creates an instance of CrossHairManager.
     * @param engine - The game engine.
     */
    constructor(public engine: typeof MyEngine2D) {
        this.app = engine.app;
    }

    /**
     * Activates the crosshair on the current scene.
     * @param currentScene - The current scene.
     * @param crosshair - The crosshair to be activated.
     * @returns The activated crosshair.
     */
    activateOnCurrentScene(currentScene: Scene, crosshair: Graphics | Sprite) {
        this.crosshair = crosshair;
        currentScene.addChild(this.crosshair);

        this.show();

        const onTick = () => {
            const { x, y } = this.engine.mouse.getMouse();
            this.crosshair.position.set(x, y);
        };

        this.app.ticker.add(onTick);

        return this.crosshair;
    }

    /**
     * Removes the crosshair.
     */
    removeCrossHair() {
        if (this.crosshair) {
            this.crosshair.destroy();
        }
    }

    /**
     * Shows the crosshair.
     */
    show() {
        if (MyEngine2D.app.canvas.style) {
            MyEngine2D.app.canvas.style.cursor = 'none';
            this.crosshair.visible = true;
        }
    }

    /**
     * Hides the crosshair.
     */
    hide() {
        if (MyEngine2D.app.canvas.style) {
            this.crosshair.visible = false;
            MyEngine2D.app.canvas.style.cursor = 'default';
        }
    }

    /**
     * Toggles the visibility of the crosshair.
     */
    toggle() {
        if (this.crosshair.visible) {
            this.hide();
        } else {
            this.show();
        }
    }
}