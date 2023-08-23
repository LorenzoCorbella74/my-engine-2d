import * as PIXI from "pixi.js";
import { InputKeyboardManager } from "./InputKeyboardManager";

export class Scene extends PIXI.Container {
    constructor(public input: InputKeyboardManager) {
        super();
        this.input.registerScene(this)
    }

    setup() { }

    destroy() { }

    // Utilizzare dt per aggiornare gli elementi della scena
    update(dt: number, delta: number) {
    }

    onInputChange(inputs) {
        console.log(this.constructor.name, inputs)
    }
}