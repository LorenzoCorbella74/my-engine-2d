import * as PIXI from "pixi.js";
import gsap from 'gsap';

import { GameObject } from './GameObject'
import { SceneManager } from "./SceneManager";
import { Scene } from "./Scene";


export class Camera {

    app: PIXI.Application<PIXI.ICanvas>;
    target: GameObject;
    container: PIXI.Container<PIXI.DisplayObject>;

    // ZOOM
    zoomLevel: number;

    // SHAKE EFFECT
    shakeDuration: number;
    shakeAmplitude: number;
    shakeStartTime: number;

    constructor(app: PIXI.Application, public sceneManager: SceneManager) {
        this.app = app;
        this.target = null; // The FOCUS of the camera

        this.zoomLevel = 1;

        this.shakeDuration = 0;
        this.shakeAmplitude = 0;
        this.shakeStartTime = 0;
    }

    focusOn(element: GameObject, currentScene: Scene) {
        this.app.stage.removeChild(this.container);
        // se non passato focus al centro dello schermo
        if (!element) {
            element = new GameObject('cameraDefault');
            element.x = this.app.screen.width / 2,
                element.y = this.app.screen.height / 2
        }
        this.container = currentScene;
        this.target = element;
        this.app.stage.addChild(this.container);
    }

    update() {
        if (!this.target) return

        if (this.shakeDuration > 0) {
            const currentTime = performance.now();
            const elapsedTime = currentTime - this.shakeStartTime;

            if (elapsedTime < this.shakeDuration) {
                // TODO: improve camera shaking
                const offsetX = (Math.random() - 0.85) < 0 ? 0 : this.shakeAmplitude;
                const offsetY = (Math.random() - 0.85) < 0 ? 0 : this.shakeAmplitude;

                // updating player coordinates
                this.target.x = this.target.x + offsetX;
                this.target.y = this.target.y + offsetY;
            }
        } else {
            this.shakeDuration = 0;
        }
        // Aggiorna la posizione della telecamera in base al target

        this.container.position.x = this.app.screen.width / 2 - (this.target.x * this.zoomLevel);
        this.container.position.y = this.app.screen.height / 2 - (this.target.y * this.zoomLevel);

        // Aggiorna il livello di zoom
        this.container.scale.set(this.zoomLevel);
    }

    startShake(duration: number, amplitude: number) {
        this.shakeDuration = duration;
        this.shakeAmplitude = amplitude;
        this.shakeStartTime = performance.now();
    }

    /**
     * 
     * @param targetZoom level of zoom (ddefault 1)
     * @param duration  duration in sec to reach the desired zoom
     */
    zoomTo(targetZoom, duration) {
        gsap.to(this, { zoomLevel: targetZoom, duration: duration })
    }

    // TODO
    /* isGameObjectVisibleInCamera(
        gameObjectX: number,
        gameObjectY: number,
        gameObjectWidth: number,
        gameObjectHeight: number
    ): boolean {
        // Calcola le coordinate del bordo destro e inferiore del GameObject
        const gameObjectRight = gameObjectX + gameObjectWidth;
        const gameObjectBottom = gameObjectY + gameObjectHeight;
        // Controlla se il GameObject è completamente fuori a sinistra, a destra, sopra o sotto la telecamera
        if (
            gameObjectX > cameraX + cameraWidth ||
            gameObjectRight < cameraX ||
            gameObjectY > cameraY + cameraHeight ||
            gameObjectBottom < cameraY
        ) {
            // Il GameObject non è visibile nella telecamera
            return false;
        }
        // Se non è completamente fuori dalla telecamera, allora è visibile
        return true;
    } */

}