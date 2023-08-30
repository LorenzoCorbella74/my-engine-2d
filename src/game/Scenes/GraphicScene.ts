
import { Graphics } from "pixi.js";
import { PixiEngine } from "../../engine/Engine";
import { Scene } from "../../engine/Scene";
import { GameGraphics } from "../../engine/GameGraphics";

export class GraphicScene extends Scene {

    rectangle: Graphics;
    circle: Graphics;
    line: Graphics;

    constructor() {
        super(PixiEngine)
    }

    setup() {
        // test GameGraphics
        this.rectangle = new GameGraphics(this).drawRectangle(500, 0, 100, 100)
        this.rectangle.interactive = true

        let timer

        // test timer.every
        this.rectangle.on('pointerdown', () => {
            timer = this.engine.time.every(1, () => {
                this.engine.log('Recurrent Fn has been called after 1 seconds')
            }, 10)
        })
        this.line = new GameGraphics(this).drawLine(800, 0, 0, 600)

        this.circle = new GameGraphics(this).drawCircle(500, 500, 100)
        this.circle.interactive = true
        // test time.cancel
        this.circle.on('pointerdown', () => {
            this.engine.time.cancel(timer)
        })

    }


    update(delta: number) {
        // PixiEngine.log(PixiEngine.time.getFrame().toString())
        // const dt = this.engine.time.getDeltaTime()
    }

    destroy() {

    }

    onInputChange(inputs: any): void {
        // test time.after
        if (this.engine.input.isKeyDown('M')) {
            this.engine.time.after(1, () => {
                this.engine.log('Fn has been called after 1 seconds')
            })
        }
    }
}