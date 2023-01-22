import * as PIXI from "pixi.js";
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { LoaderHelper } from "./LoaderHelper";
import { Texture } from "pixi.js";

class PixiEngine {
    app: PIXI.Application;
    config: any;
    scene: any;
    loader: any;
    
    run(config) {
        gsap.registerPlugin(PixiPlugin);
        PixiPlugin.registerPIXI(PIXI);

        this.config = config;

        this.app = new PIXI.Application({ resizeTo: window });
        document.body.appendChild(this.app.view as any); // TODO: Argument of type 'ICanvas' is not assignable to parameter of type 'Node'.

        this.loader = new LoaderHelper(this.config);
        this.loader.preload().then((result) => {
            console.log('Resources loaded: ', this.loader.resources);
            this.start();
        });
    }

    // recupera gli asset precaricati (sia JSON che IMG)
    loadAsset(key:string) {
        const what = this.loader.resources[key];
        // IMGs
        if(what instanceof Texture){
            return new PIXI.Sprite(this.loader.resources[key]);
        }
        // JSON
        return what
    }

    // 
    playSound(key:string){
        this.loader.sound.play(key);
    }

    start() {
        this.scene = new this.config["startScene"]();   // TODO
        this.app.stage.addChild(this.scene.container);
    }
}

export const App = new PixiEngine();
