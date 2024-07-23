import { GameObject } from "../../../../engine/GameObject";

import { Text, TextStyle } from "pixi.js";
import { TextComponent } from "../../../../engine/components/text";
export class UITextExample extends GameObject {

    constructor(name: string, text: string) {
        super(name);
        // global coordinates
        this.x = window.innerWidth / 2;
        this.y = window.innerHeight - 100;

        // for text see https://codesandbox.io/s/8q7hs?file=/src/Scene.js:218-312
        const skewStyle = new TextStyle({
            fontFamily: 'Arial',
            dropShadow: {
                alpha: 0.8,
                angle: 2.1,
                blur: 4,
                color: '0x111111',
                distance: 10,
            },
            fill: '#ffffff',
            stroke: { color: '#004620', width: 12, join: 'round' },
            fontSize: 60,
            fontWeight: 'lighter',
        });
        const textE = new Text({
            text: text,
            style: skewStyle,
        });;
        textE.anchor.set(0.5);
        textE.resolution = 8;
        this.addComponent(new TextComponent(this, textE, 0, 0));
    }
}