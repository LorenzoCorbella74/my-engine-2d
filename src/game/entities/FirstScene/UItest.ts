import { GameObject } from "../../../engine/GameObject";

import { Text, TextStyle } from "pixi.js";
import { TextComponent } from "../../../engine/components/text";
export class UITextExample extends GameObject {

    constructor(name: string, text: string) {
        super(name);
        // global coordinates
        this.x = window.innerWidth / 2;
        this.y = window.innerHeight - 100;

        // for text see https://codesandbox.io/s/8q7hs?file=/src/Scene.js:218-312
        const textFormat = {
            "fontFamily": "Arial",
            "dropShadow": true,
            "dropShadowAlpha": 0.8,
            "dropShadowAngle": 2.1,
            "dropShadowBlur": 4,
            "dropShadowColor": "0x111111",
            "dropShadowDistance": 5,
            "fill": [
                "#ffffff"
            ],
            "stroke": "#004620",
            "fontSize": 32,
            "fontWeight": "lighter",
            "lineJoin": "round",
            "strokeThickness": 12,
            "align": "center"
        };
        const textE = new Text(text, textFormat as TextStyle);
        textE.anchor.set(0.5);
        textE.resolution = 8;
        this.addComponent(new TextComponent(this, textE, 0, 0));
    }
}