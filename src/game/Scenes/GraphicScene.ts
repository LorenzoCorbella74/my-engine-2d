
import { Graphics } from "pixi.js";
import { MyEngine2D } from "../../engine/Engine";
import { Scene } from "../../engine/Scene";
import { GameGraphics } from "../../engine/GameGraphics";
import { KeyMapping } from "../../engine/models/key-mapping";

export class GraphicScene extends Scene {

    rectangle!: Graphics;
    circle!: Graphics;
    line!: Graphics;

    constructor() {
        super(MyEngine2D)
    }

    async init() {
        // center on the middle of the screen
        this.engine.camera.focusOn(null, this)

        let timer: any;
        // test GameGraphics
        this.rectangle = new GameGraphics(this).drawRectangle(500, 0, 100, 100)
        this.rectangle.interactive = true
        // test timer.every
        this.rectangle.on('pointerdown', () => {
            timer = this.engine.time.every(1, (remaining) => {
                this.engine.log(`Recurrent Fn has been called after 1 seconds: ${remaining}`)
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

    update(dt: number): void {
        // test time.after
        if (this.engine.input.iskeyDownOnce('M')) {
            this.engine.time.after(1, () => {
                this.engine.log('Fn has been called after 1 seconds')
            })
        }

        // test time.script
        if (this.engine.input.iskeyDownOnce('E')) {
            this.engine.time.script(async (wait) => {
                this.engine.log('Fn has been called after 0 seconds')
                await wait(1)
                this.engine.log('Fn has been called after 1 seconds')
                await wait(2)
                this.engine.log('Fn has been called after 2 seconds')
                await wait(3)
                this.engine.log('Fn has been called after 3 seconds')
            })
        }

        // test time.during
        if (this.engine.input.iskeyDownOnce('R')) {
            this.engine.time.during(1, () => {
                this.engine.log('Fn has been called for 1 seconds')
            }, () => {
                this.engine.log('Test time.during completes succesfully')
            })
        }
    }   
}