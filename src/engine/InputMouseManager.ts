import { Application } from "pixi.js";

export class InputMouseManager {

    private mouse = {
        x: 0,
        y: 0
    }
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
        this.app.stage.on('pointermove', (event) => { // o pointermove o mousemove
            this.mouse = {
                x: event.global.x,
                y: event.global.y
            }
        });

        document.addEventListener('wheel', this.mouseWheelEvent.bind(this));
        document.addEventListener('contextmenu', this.contextMenuEvent.bind(this))
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

    mouseWheelEvent(e: any) {
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

    contextMenuEvent(e: any) {
        e.preventDefault()
    }

    getMouse() {
        return this.mouse;
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
