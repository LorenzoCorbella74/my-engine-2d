import { GameObject } from "../../../engine/GameObject";

import { Text } from "pixi.js";
import { TextComponent } from "../../../engine/components/text";
export class UITextExample extends GameObject {

    constructor(name: string, text: string) {
        super(name);
        // global coordinates
        this.x = window.innerWidth / 2;
        this.y = window.innerHeight - 100;

        // for text see https://codesandbox.io/s/8q7hs?file=/src/Scene.js:218-312
        const textFormat = this.engine.getAsset('text-format');
        const textE = new Text(text, textFormat);
        textE.anchor.set(0.5);
        textE.resolution = 8;
        this.addComponent(new TextComponent(this, textE, 0, 0));
    }
}