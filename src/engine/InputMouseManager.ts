import { Application } from "pixi.js";

export class InputMouseManager {

    private mouse = {
        x: 0,
        y: 0
    }
    private mouseWheel = 0;
    private mouseButton1 = false;
    private mouseButton2 = false;
    private mouseButton3 = false;
    private mouseButton4 = false;

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
                this.mouseButton1 = true;
            } else if (e.button === 1) {
                this.mouseButton2 = true;
            } else if (e.button === 2) {
                e.preventDefault();  // TODO: apre il menu ...
                this.mouseButton3 = true;
            } else if (e.button === 3) {
                this.mouseButton4 = true;
            }
        });

        document.addEventListener('mouseup', e => {
            if (e.button === 0) {
                this.mouseButton1 = false;
            } else if (e.button === 1) {
                this.mouseButton2 = false;
            } else if (e.button === 2) {
                this.mouseButton3 = false;
            } else if (e.button === 3) {
                this.mouseButton4 = false;
            }
        });
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

    isMouseButton1Down() {
        return this.mouseButton1;
    }

    isMouseButton2Down() {
        return this.mouseButton2;
    }

    isMouseButton3Down() {
        return this.mouseButton3;
    }

    isMouseButton4Down() {
        return this.mouseButton4;
    }
}
