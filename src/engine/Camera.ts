import * as PIXI from "pixi.js";

import { GameObject } from './GameObject'
import { SceneManager } from "./SceneManager";
import { Scene } from "./Scene";

import { SpriteComponent } from "./components/sprite";
import { Component } from "./Component";

export class Camera {

    app: PIXI.Application<PIXI.ICanvas>;
    target: GameObject;
    container: PIXI.Container<PIXI.DisplayObject>;

    // ZOOM
    zoomLevel: number;
    zoomSpeed: number;
    targetZoom: number;
    isZooming: boolean;
    zoomStartTime: number;
    zoomDuration: number;

    // SHAKE EFFECT
    shakeDuration: number;
    shakeAmplitude: number;
    shakeStartTime: number;

    constructor(app: PIXI.Application, public sceneManager: SceneManager) {
        this.app = app;
        this.target = null; // L'elemento su cui la telecamera dovrebbe essere centrata

        this.zoomLevel = 1;
        this.targetZoom = 1;
        this.zoomSpeed = 0.05;
        this.isZooming = false;

        this.shakeDuration = 0;
        this.shakeAmplitude = 0;
        this.shakeStartTime = 0;
    }

    focusOn(element: GameObject, currentScene: Scene) {
        this.app.stage.removeChild(this.container);
        // se non passato focus al centro dello schermo
        if (!element) {
            element = new GameObject('camera');
            element.addComponent(new SpriteComponent(element, null, this.app.screen.width / 2, this.app.screen.height / 2))
        }
        this.container = currentScene;
        this.target = element;
        this.app.stage.addChild(this.container);
    }

    update() {
        if (!this.target) return

        if (this.isZooming) {
            const currentTime = performance.now();
            const elapsedTime = currentTime - this.zoomStartTime;

            if (elapsedTime < this.zoomDuration) {
                const progress = elapsedTime / this.zoomDuration;
                const zoomDiff = this.targetZoom - this.zoomLevel;
                this.zoomLevel = this.zoomLevel + zoomDiff * progress;
            } else {
                this.zoomLevel = this.targetZoom;
                this.isZooming = false;
            }
        }

        if (this.shakeDuration > 0) {
            const currentTime = performance.now();
            const elapsedTime = currentTime - this.shakeStartTime;

            if (elapsedTime < this.shakeDuration) {
                // TODO: improve camera shaking
                const offsetX = (Math.random() - 0.85) < 0 ? 0 : this.shakeAmplitude;
                const offsetY = (Math.random() - 0.85) < 0 ? 0 : this.shakeAmplitude;

                // updating player coordinates
                // TODO
                const target = (this.target?.getComponents('Sprite')[0] as SpriteComponent)
                target.setPosition(target.sprite.x + offsetX, target.sprite.y + offsetY)
            }
        } else {
            this.shakeDuration = 0;
        }
        // Aggiorna la posizione della telecamera in base al target
        const target = this.target.getComponents<SpriteComponent>('Sprite')[0]
        this.container.position.x = this.app.screen.width / 2 - (target.sprite.x * this.zoomLevel);
        this.container.position.y = this.app.screen.height / 2 - (target.sprite.y * this.zoomLevel);

        // Aggiorna il livello di zoom
        this.container.scale.set(this.zoomLevel);
    }

    startShake(duration: number, amplitude: number) {
        this.shakeDuration = duration;
        this.shakeAmplitude = amplitude;
        this.shakeStartTime = performance.now();
    }

    zoomIn() {
        this.zoomLevel += this.zoomSpeed;
        if (this.zoomLevel > 2) {
            this.zoomLevel = 2;
        }
        console.log('Zoom Level: ', this.zoomLevel)
    }

    zoomOut() {
        this.zoomLevel -= this.zoomSpeed;
        if (this.zoomLevel < 0.5) {
            this.zoomLevel = 0.5;
        }
        console.log('Zoom Level: ', this.zoomLevel)
    }

    zoomTo(targetZoom, duration) {
        this.targetZoom = targetZoom;
        this.zoomDuration = duration;
        this.zoomStartTime = performance.now();
        this.isZooming = true;
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