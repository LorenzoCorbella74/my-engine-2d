import * as PIXI from "pixi.js";

import { GameObject } from './GameObject'
import { SceneManager } from "./SceneManager";
import { Scene } from "./Scene";

export class Camera {

    zoomLevel: number;
    zoomSpeed: number;

    app: PIXI.Application<PIXI.ICanvas>;
    target: GameObject;
    container: PIXI.Container<PIXI.DisplayObject>;


    constructor(app: PIXI.Application, sceneManager: SceneManager) {
        this.app = app;
        this.target = null; // L'elemento su cui la telecamera dovrebbe essere centrata


        this.zoomLevel = 1;
        this.zoomSpeed = 0.01;
    }

    focusOn(element: GameObject, currentScene: Scene) {
        // se non passato focus al centro dello schermo
        if (!element) {
            element = {
                entity: {
                    x: this.app.screen.width / 2,
                    y: this.app.screen.height / 2
                }
            } as GameObject
        }
        this.container = currentScene;
        this.target = element;
        this.app.stage.addChild(this.container);
    }

    update() {
        // Aggiorna la posizione della telecamera in base al target
        this.container.position.x = this.app.screen.width / 2 - this.target.entity.x;
        this.container.position.y = this.app.screen.height / 2 - this.target.entity.y;

        // Aggiorna il livello di zoom
        this.container.scale.set(this.zoomLevel);
    }

    zoomIn() {
        this.zoomLevel += this.zoomSpeed;
        if (this.zoomLevel > 10) {
            this.zoomLevel = 10;
        }
    }

    zoomOut() {
        this.zoomLevel -= this.zoomSpeed;
        if (this.zoomLevel < 0.1) {
            this.zoomLevel = 0.1;
        }
    }

}