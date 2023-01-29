import { Text } from "pixi.js";
import { PixiEngine } from "../../engine/Engine";
import { Scene } from "../../engine/SceneManager";

export class SecondScene extends Scene {

    text: Text

    constructor() {
        super()
    }

    setup() {
        // for text see https://codesandbox.io/s/8q7hs?file=/src/Scene.js:218-312
        this.text = new Text("Hello, I'm ready\n😀", {
            fontSize: 24,
            lineHeight: 28,
            letterSpacing: 0,
            fill: 0xffffff,
            align: "center"
        });
        this.text.anchor.set(0.5);
        this.text.resolution = 8;
        this.text.x = window.innerWidth / 2;
        this.text.y = window.innerHeight / 2;
        this.addChild(this.text)
    }

    update(delta: number) {
        // PixiEngine.log(PixiEngine.time.getFrame().toString())
        this.text.x = Math.sin(PixiEngine.time.getElapsedTime()) * window.innerWidth / 2;
    }

    destroy() {
        
    }

}