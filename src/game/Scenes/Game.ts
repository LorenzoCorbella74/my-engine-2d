import * as PIXI from "pixi.js";
import { Container } from "pixi.js";
import { App } from "../../engine/App";
    
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
        this.bg = App.loadAsset("bg");
        this.bg.width = window.innerWidth;
        this.bg.height = window.innerHeight;

        // 2
        this.bunny = App.loadAsset("bunny");
        this.bunny.width = 64;
        this.bunny.height = 64;

        // 3 JSON
        this.json = App.loadAsset("test");
        console.log(this.json);
        
        // 4. SOUNDS (mp3)
        App.playSound("mp3_test");

        //
        this.container.addChild(this.bg);
        this.container.addChild(this.bunny);
    }

}