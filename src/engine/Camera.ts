import * as PIXI from "pixi.js";

import { GameObject } from './GameObject'
import { SceneManager } from "./SceneManager";
import { Scene } from "./Scene";
import { MyEngine2D } from "./Engine";
import { Point } from "./models/vectors";

import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { ComponentNames } from "./models/component-names.enum";

export type CameraLock = 'both' | 'horizontal' | 'vertical';

export class Camera {

    app: PIXI.Application<PIXI.ICanvas>;
    target: GameObject | null;
    lockMode: CameraLock;
    container!: PIXI.Container<PIXI.DisplayObject>;

    zoomLevel: number;

    // SHAKE EFFECT
    shakeDuration: number;
    shakeAmplitude: number;
    shakeStartTime: number;

    defaultCamera = new GameObject('camera-default')

    constructor(
        public engine: typeof MyEngine2D,
        public sceneManager: SceneManager,
        private ease: number = 1 // .965
    ) {
        this.app = engine.app;

        this.target = null; // The FOCUS of the camera
        this.lockMode = 'both';
        this.zoomLevel = 1;

        this.shakeDuration = 0;
        this.shakeAmplitude = 0;
        this.shakeStartTime = 0;

        gsap.registerPlugin(PixiPlugin);
        PixiPlugin.registerPIXI(PIXI);
    }

    setEase(ease: number) {
        this.ease = ease;
    }

    lockTo(element: GameObject | null, currentScene: Scene, mode: CameraLock = 'both') {
        this.app.stage.removeChild(this.container);
        // se non passato focus al centro dello schermo
        if (!element) {
            element = this.defaultCamera;
            element.x = this.app.screen.width / 2,
                element.y = this.app.screen.height / 2
        }
        this.container = currentScene;
        this.target = element;
        this.lockMode = mode;
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

        const screenWidth = this.app.screen.width;
        const screenHeight = this.app.screen.height;

        // Calcolare la posizione desiderata della camera in modo che il target sia centrato, considerando il livello di zoom
        const cameraX = this.target.x * this.zoomLevel - screenWidth / 2;
        const cameraY = this.target.y * this.zoomLevel - screenHeight / 2;

        // Limitare la posizione della camera per evitare di visualizzare 
        // aree vuote oltre i bordi della scena -> TODO: mettere dimenbsioni mappa di giuoco ????
        const maxX = (this.container.width - screenWidth / 4);
        const maxY = (this.container.height - screenHeight / 4);

        // console.log(`maxX: ${maxX}', 'maxY: ${maxY}`)

        // la scena si muove in direzione opposta al target
        if (this.lockMode === 'horizontal' || this.lockMode === 'both') {
            let futureX = Math.max(0, Math.min(cameraX, maxX));
            this.container.x = - this.engine.math.mix(this.container.x, futureX, this.ease);
        }
        if (this.lockMode === 'vertical' || this.lockMode === 'both') {
            let futureY = Math.max(0, Math.min(cameraY, maxY));
            this.container.y = - this.engine.math.mix(this.container.y, futureY, this.ease);
        }

        // Applicare il livello di zoomLevel al contenitore
        this.container.scale.set(this.zoomLevel);
    }

    shake(duration: number, amplitude: number) {
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
        this.engine.animation.aminateOneObjectProperty(
            'camera-zoom',
            this,
            { "zoomLevel": targetZoom },
            duration,
            ease,
            callback
        );
    }

    /**
 * Moves the camera to the specified point (moving over a line).
 *
 * @param {Point} point - The point to move to.
 * @param {number} [duration=1] - The duration of the animation in seconds.
 * @param {string | gsap.EaseFunction} [ease="none"] - The easing function for the animation.
 * @param {() => void} [callback=() => {}] - The callback function to be called after the animation completes.
 */
    moveTo(destination: Point, duration: number = 1, ease: string | gsap.EaseFunction = "none", callback: () => void = () => { }) {
        this.resetToDefaultCamera()
        this.engine.animation.aminateOneObjectProperty('camera-move', this.target, destination, duration, ease, callback);
    }

    resetToDefaultCamera(origin?: Point) {
        if (this.target && !origin) {
            origin = {
                x: this.target.x,
                y: this.target.y
            }
        } else if (!origin) {
            origin = {
                x: 0,
                y: 0
            }
        }
        this.defaultCamera?.position.set(origin.x, origin.y);
        this.lockTo(this.defaultCamera, this.engine.scenes.currentScene);
    }

    /**
 * Animate the camera on a bezier curve.
 *
 * @param {Point} start - The starting point of the curve.
 * @param {Point} controlOne - The first control point of the curve.
 * @param {Point} controlTwo - The second control point of the curve.
 * @param {Point} end - The ending point of the curve.
 * @param {() => void} callback - An optional callback function to be called when the animation is complete.
 */
    animateOnBezierCurve(startPoint: Point, controlOne: Point, controlTwo: Point, endPoint: Point, duration: number = 1, callback: () => void = () => { }) {
        this.resetToDefaultCamera(startPoint)

        // calcola la posizione del punto tra 0 e 1
        function getBezierPoint(t: number) {
            const invT = 1 - t;
            const x = invT * invT * invT * startPoint.x +
                3 * invT * invT * t * controlOne.x +
                3 * invT * t * t * controlTwo.x +
                t * t * t * endPoint.x;
            const y = invT * invT * invT * startPoint.y +
                3 * invT * invT * t * controlOne.y +
                3 * invT * t * t * controlTwo.y +
                t * t * t * endPoint.y;
            return { x, y };
        }
        let point = new PIXI.Graphics();
        point.lineStyle(0); // draw a circle, set the lineStyle to zero so the circle doesn't have an outline
        point.beginFill(0xDE3249, 1);
        point.drawCircle(startPoint.x, startPoint.y, 5);
        point.endFill();
        point.visible = false;
        const bezier = new PIXI.Graphics();
        bezier.lineStyle(1, 0xAA0000, 1);
        // punto iniziale
        bezier.x = startPoint.x;
        bezier.y = startPoint.y;
        bezier.bezierCurveTo(
            controlOne.x,
            controlOne.y,
            controlTwo.x,
            controlTwo.y,
            endPoint.x,
            endPoint.y
        );
        bezier.visible = false;
        this.engine.scenes.currentScene.addChild(bezier);
        this.engine.scenes.currentScene.addChild(point);
        let elapsed = 0
        const delta = this.engine.time.getDeltaTime();

        const onTick = () => {
            bezier.visible = this.engine.debug;     // debug
            point.visible = this.engine.debug;     // debug
            elapsed += delta / duration
            let { x, y } = getBezierPoint(elapsed);
            this.target?.position.set(x, y)
            point?.position.set(x, y)
            if (elapsed >= 1) {
                callback && callback()
                this.app.ticker.remove(onTick);
            }
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


    // TODO: animate on a path https://codepen.io/GreenSock/pen/JjWqMQG
    followPath(
        graphics: PIXI.Graphics,
        duration: number = 1,
        callback: () => void = () => { }
    ) {
        this.engine.scenes.currentScene.addChild(graphics);
        graphics.visible = true

        let points = (graphics.geometry.graphicsData[0].shape as PIXI.Polygon).points;
        let values = [];

        for (let i = 0; i < points.length; i += 2) {
            values.push({ x: points[i], y: points[i + 1] });
        }
        console.log(values);
        this.resetToDefaultCamera(values[0]);

        gsap.to(this.target, {
            duration,
            motionPath: {
                path: values,
                curviness: 0,
                fromCurrent: false
            },
            onUpdate: () => {
                // graphics.visible = this.engine.debug;
            },
            onComplete: () => {
                callback();
            }
        });
    }

}