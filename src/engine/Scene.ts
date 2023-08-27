import * as PIXI from "pixi.js";
import { Engine } from "./Engine";

export class Scene extends PIXI.Container {
    constructor(public engine: Engine) {
        super();
    }

    setup() { }

    // destroy() { }

    // Utilizzare dt per aggiornare gli elementi della scena
    update(dt: number, delta: number) {
    }

    onInputChange(inputs) {
        console.log(this.constructor.name, inputs)
    }

    onResize(width: number, height: number) {
        console.log(this.constructor.name + '  resizing...', width, height)
        // ogni oggetto dovrebbe essere scalato in caso di ridimensionamento della finestra
    }
}