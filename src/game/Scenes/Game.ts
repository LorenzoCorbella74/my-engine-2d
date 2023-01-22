import * as PIXI from "pixi.js";
import { Container } from "pixi.js";
import { Engine } from "../../engine/App";
    
export class Game {
    container: Container;

    bg: any;
    bunny: any;
    json: any;
    
    constructor() {
        this.container = new PIXI.Container();
        this.createBackground();
    }

    createBackground() {
        // 1 test 
        this.bg = Engine.loadAsset("bg");
        this.bg.width = window.innerWidth;
        this.bg.height = window.innerHeight;

        // 2
        this.bunny = Engine.loadAsset("bunny");
        this.bunny.width = 64;
        this.bunny.height = 64;

        // 3 JSON
        this.json = Engine.loadAsset("test");
        console.log(this.json);
        
        // 4. SOUNDS (mp3)
        Engine.playSound("mp3_test");

        //
        this.container.addChild(this.bg);
        this.container.addChild(this.bunny);
    }

}