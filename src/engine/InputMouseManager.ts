import { Application } from "pixi.js";
import { MouseLimit } from "./models/mouse-limits";

/**
 * The InputMouseManager class handles mouse input and provides methods to track mouse button states and mouse position.
 */
export class InputMouseManager {

    private mousePosition = {
        x: 0,
        y: 0
    }
    private mouseLimits: MouseLimit = {};
    private mouseWheel = 0;

    private mouseButton1Down = false;
    private mouseButton1Pressed = false;
    private mouseButton1Released = false;

    private mouseButton2Down = false;
    private mouseButton2Pressed = false;
    private mouseButton2Released = false;

    app: Application;

    constructor(app: Application) {
        this.app = app;
        // from 7.0 no more "app.renderer.plugins.interaction.mouse"
        this.app.stage.eventMode = 'static';
        this.app.stage.hitArea = app.screen;
        this.app.stage.on('pointermove', this.mouseMoveHandler.bind(this)); // o pointermove o mousemove

        document.addEventListener('wheel', this.mouseWheelHandler.bind(this));
        document.addEventListener('contextmenu', this.contextMenuHandler.bind(this))
        document.addEventListener('pointerdown', e => {
            if (e.button === 0) {
                this.mouseButton1Down = true;
                this.mouseButton1Pressed = true;
            } else if (e.button === 1) {
                this.mouseButton2Down = true;
                this.mouseButton2Pressed = true;
            }
        });

        document.addEventListener('mouseup', e => {
            if (e.button === 0) {
                this.mouseButton1Down = false;
                this.mouseButton1Released = true;
            } else if (e.button === 1) {
                this.mouseButton2Down = false;
                this.mouseButton2Released = true;
            }
        });
    }


    mouseMoveHandler(event: any) {
        this.mousePosition = {
            x: event.global.x,
            y: event.global.y
        }

        if (this.mouseLimits.x) {
            this.mousePosition.x = Math.max(
                this.mouseLimits.x.min,
                Math.min(this.mouseLimits.x.max, this.mousePosition.x)
            );
        }

        if (this.mouseLimits.y) {
            this.mousePosition.y = Math.max(
                this.mouseLimits.y.min,
                Math.min(this.mouseLimits.y.max, this.mousePosition.y)
            );
        }
    }

    /**
     * Sets the mouse limits.
     *
     * @param {MouseLimit} limits - The mouse limits to be set.
     * @return {void} This function does not return a value.
     */
    setMouseLimits(limits: MouseLimit): void {
        this.mouseLimits = limits;
    }

    /**
    * Resets the mouse limits.
    *
    * @return {void} 
    */
    resetMouseLimits(): void {
        this.mouseLimits = {};
    }

    /**
     * Sets the vertical limits for the mouse movement and blocks it on x axis.
     *
     * @param {void} None
     * @return {void} This function does not return any value.
     */
    blockMouseVertically(): void {
        /* this.mouseLimits.y = {
            min: 0,
            max: this.app.screen.height
        }; */
        this.mouseLimits.x = {
            min: this.app.screen.width / 2,
            max: this.app.screen.width / 2
        }
    }

    /**
     * Sets the horizontal limits for mouse movement and block it on y axis.
     * 
     * @return {void} This function does not return anything.
     */
    blockMouseHorizontally(): void {
        /* this.mouseLimits.x = {
            min: 0,
            max: this.app.screen.width
        }; */
        this.mouseLimits.y = {
            min: this.app.screen.height / 2,
            max: this.app.screen.height / 2
        }
    }

    /**
     * Clears the state of the mouse button flags at the end of the frame.
     *
     * @param {type} paramName - description of parameter
     * @return {type} description of return value
     */
    clear() {
        this.mouseButton1Pressed = false;
        this.mouseButton2Pressed = false;
        this.mouseButton1Released = false;
        this.mouseButton2Released = false;
    }

    mouseWheelHandler(e: any) {
        let delta = null;
        let direction = null;
        if (e.wheelDelta) {
            delta = e.wheelDelta / 60;
        } else if (e.detail) { // fallback for Firefox
            delta = -e.detail / 2;
        }
        if (delta !== null) {
            direction = delta > 0 ? 'up' : 'down';
        }
        console.log('delta: ', delta, 'direction: ', direction);
    }

    contextMenuHandler(e: any) {
        e.preventDefault()
    }

    getMouse() {
        return this.mousePosition;
    }

    getMouseWheel() {
        return this.mouseWheel;
    }

    /**
     * Checks if mouse button 1 is currently being held down.
     *
     * @return {boolean} true if mouse button 1 is down, false otherwise
     */
    isMouseButton1Down() {
        return this.mouseButton1Down;
    }

    /**
     * Checks if mouse button 1 is pressed in the current frame.
     *
     * @return {boolean} Returns true if mouse button 1 is pressed, false otherwise.
     */
    isMouseButton1Pressed() {
        return this.mouseButton1Pressed;
    }

    /**
     * Checks if mouse button 1 is relased in the current frame.
     *
     * @return {boolean} Returns true if mouse button 1 is rekleased, false otherwise.
     */
    isMouseButton1Released() {
        return this.mouseButton1Released;
    }

    /**
    * Checks if mouse button 2 is currently being held down.
    *
    * @return {boolean} true if mouse button 2 is down, false otherwise
    */
    isMouseButton2Down() {
        return this.mouseButton2Down;
    }

    /**
     * Checks if mouse button 2 is pressed in the current frame.
     *
     * @return {boolean} Returns true if mouse button 2 is pressed, false otherwise.
     */
    isMouseButton2Pressed() {
        return this.mouseButton2Pressed;
    }

    /**
     * Checks if mouse button 2 is released in the current frame.
     *
     * @return {boolean} Returns true if mouse button 2 is released, false otherwise.
     */
    isMouseButton2Released() {
        return this.mouseButton2Released;
    }
}
