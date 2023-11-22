import * as PIXI from "pixi.js";

import { GameObject } from './GameObject'
import { SceneManager } from "./SceneManager";
import { Scene } from "./Scene";
import { MyEngine2D } from "./Engine";
import { Point } from "./models/vectors";

export class Camera {

    app: PIXI.Application<PIXI.ICanvas>;
    target: GameObject | null;
    container!: PIXI.Container<PIXI.DisplayObject>;

    // ZOOM
    zoomLevel: number;

    // SHAKE EFFECT
    shakeDuration: number;
    shakeAmplitude: number;
    shakeStartTime: number;

    // BEZIER CURVE POINTS
    startPoint: Point = { x: 0, y: 0 };
    controlPoint1: Point = { x: 0, y: 0 };
    controlPoint2: Point = { x: 0, y: 0 };
    endPoint: Point = { x: 0, y: 0 };

    constructor(public engine: typeof MyEngine2D, public sceneManager: SceneManager) {
        this.app = engine.app;
        this.target = null; // The FOCUS of the camera

        this.zoomLevel = 1;

        this.shakeDuration = 0;
        this.shakeAmplitude = 0;
        this.shakeStartTime = 0;
    }

    focusOn(element: GameObject | null, currentScene: Scene) {
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
     * Zooms to the target zoom level with optional duration, ease, and callback.
     *
     * @param {number} targetZoom - The target zoom level to zoom to.
     * @param {number} duration - The duration of the zoom animation in seconds. Defaults to 1.
     * @param {string | gsap.EaseFunction} ease - The easing function to use for the zoom animation. Defaults to "none".
     * @param {() => void} callback - The callback function to be called after the zoom animation is complete. Defaults to an empty function.
     */
    zoomTo(targetZoom: number, duration: number = 1, ease: string | gsap.EaseFunction = "none", callback: () => void = () => { }) {
        this.engine.animation.aminateOneObjectProperty('camera-zoom', this, { "zoomLevel": targetZoom }, duration, ease, callback);
    }

    /**
 * Moves the camera to the specified point. TODO: testare!!
 *
 * @param {Point} point - The point to move to.
 * @param {number} [duration=1] - The duration of the animation in seconds.
 * @param {string | gsap.EaseFunction} [ease="none"] - The easing function for the animation.
 * @param {() => void} [callback=() => {}] - The callback function to be called after the animation completes.
 */
    moveTo(point: Point, duration: number = 1, ease: string | gsap.EaseFunction = "none", callback: () => void = () => { }) {
        this.engine.animation.aminateOneObjectProperty('camera-move', this, point, duration, ease, callback);
    }


    // calcola la posizione del punto tra 0 e 1
    private getBezierPoint(t: number) {
        const invT = 1 - t;
        const x = invT * invT * invT * this.startPoint.x +
            3 * invT * invT * t * this.controlPoint1.x +
            3 * invT * t * t * this.controlPoint2.x +
            t * t * t * this.endPoint.x;
        const y = invT * invT * invT * this.startPoint.y +
            3 * invT * invT * t * this.controlPoint1.y +
            3 * invT * t * t * this.controlPoint2.y +
            t * t * t * this.endPoint.y;
        return { x, y };
    }

    /**
 * Animate the camera on a bezier curve. TODO: testare!!
 *
 * @param {Point} start - The starting point of the curve.
 * @param {Point} controlOne - The first control point of the curve.
 * @param {Point} controlTwo - The second control point of the curve.
 * @param {Point} end - The ending point of the curve.
 * @param {() => void} callback - An optional callback function to be called when the animation is complete.
 */
    animateOnBezierCurve(start: Point, controlOne: Point, controlTwo: Point, end: Point, callback: () => void = () => { }) {
        this.startPoint = start;
        this.controlPoint1 = controlOne;
        this.controlPoint2 = controlTwo;
        this.endPoint = end;
        // POINT
        const point = new PIXI.Graphics();
        point.lineStyle(0); // draw a circle, set the lineStyle to zero so the circle doesn't have an outline
        point.beginFill(0xDE3249, 1);
        point.drawCircle(0, 0, 5);
        point.endFill();
        point.visible = false;
        this.app.stage.addChild(point);

        /* BEZIER CURVE */
        const realPath = new PIXI.Graphics();
        realPath.lineStyle(2, 0xFFFFFF, 1);
        realPath.moveTo(this.startPoint.x, this.startPoint.y);
        realPath.lineTo(this.controlPoint1.x, this.controlPoint1.y);
        realPath.lineTo(this.controlPoint2.x, this.controlPoint2.y);
        realPath.lineTo(this.endPoint.x, this.endPoint.y);
        realPath.position.x = this.startPoint.x;
        realPath.position.y = this.startPoint.y;
        realPath.visible = false;
        this.app.stage.addChild(realPath);

        const bezier = new PIXI.Graphics();
        bezier.lineStyle(1, 0xAA0000, 1);
        bezier.bezierCurveTo(
            this.controlPoint1.x,
            this.controlPoint1.y,
            this.controlPoint2.x,
            this.controlPoint2.y,
            this.endPoint.x,
            this.endPoint.y
        );
        // punto iniziale
        bezier.position.x = this.startPoint.x;
        bezier.position.y = this.startPoint.y;
        bezier.visible = false;
        this.app.stage.addChild(bezier);
        let elapsed = 0
        const delta = this.engine.time.getDeltaTime();

        const onTick = () => {
            if (this.engine.debug) {
                bezier.visible = true;
                realPath.visible = true;
                point.visible = true;
            } else {
                bezier.visible = false;
                realPath.visible = false;
                point.visible = false;
            }
            if (elapsed > 1) {
                callback()
                this.app.ticker.remove(onTick);
            }
            elapsed += delta
            let { x, y } = this.getBezierPoint(elapsed);
            this.target?.position.set(x, y)
        }

        this.app.ticker.add(onTick)
    }

    /**
  * Determines if a game object is visible within the camera view.      TODO: testare!!
  *
  * @param {T} gameObject - The game object to check for visibility.
  *                        It must have properties x, y, width, and height.
  * @return {boolean} - True if the game object is visible in the camera, false otherwise.
  */
    isGameObjectVisibleInCamera<T extends { x: number, y: number, width: number, height: number }>(gameObject: T): boolean {
        const { x, y, width, height } = gameObject;
        // Calcola le coordinate del bordo destro e inferiore del GameObject
        const gameObjectRight = x + width;
        const gameObjectBottom = y + height;
        // Controlla se il GameObject è completamente fuori a sinistra, a destra, sopra o sotto la telecamera
        if (this.target &&
            (x > this.target.x + this.target?.width ||
                gameObjectRight < this.target.x ||
                y > this.target.y + this.target.height ||
                gameObjectBottom < this.target.y)
        ) {
            return false;
        }
        return true;
    }

}