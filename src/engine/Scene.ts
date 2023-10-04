import { Container } from "pixi.js";
import { Engine } from "./Engine";

export class Scene extends Container {
    constructor(public engine: Engine) {
        super();
    }

    /**
     * Initialize objetct and load resources asyncronously
     */
    async init() { }


    // Utilizzare dt per aggiornare gli elementi della scena
    update(dt: number, delta: number) { }

    onInputChange(inputs: any) {
        console.log(this.constructor.name, inputs)
    }

    /**
     * Clean up and load resources for next scene
     */
    onExit() {
        super.destroy()
        console.log(this.constructor.name, ' exit')
    }

    onResize(width: number, height: number) {
        console.log(this.constructor.name + '  resizing...', width, height)
        // ogni oggetto dovrebbe essere scalato in caso di ridimensionamento della finestra
    }
}