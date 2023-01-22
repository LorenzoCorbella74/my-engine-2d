import { SoundManager } from './SoundManager';
import * as PIXI from "pixi.js";
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { LoaderHelper } from "./LoaderHelper";
import { Texture } from "pixi.js";
import { massiveRequire } from './utils';

class PixiEngine {
    app: PIXI.Application;
    config: any;
    scene: any;
    private loader: LoaderHelper;
    private soundsManager: SoundManager;

    constructor(){
        
    }

    run(config) {
        gsap.registerPlugin(PixiPlugin);
        PixiPlugin.registerPIXI(PIXI);

        // NOTE: https://webpack.js.org/guides/dependency-management/#requirecontext
        // NOTE: The arguments passed to require.context must be literals!
        const loaderData = require["context"]('./../assets/', true, /\.(mp3|png|jpe?g|json)$/);

        this.config = config;

        this.app = new PIXI.Application({ resizeTo: window });
        document.body.appendChild(this.app.view as any); // TODO: Argument of type 'ICanvas' is not assignable to parameter of type 'Node'.

        this.soundsManager = new SoundManager();
        this.loader = new LoaderHelper(massiveRequire(loaderData), this.soundsManager);
        this.loader.preload().then((result) => {
            console.log('Resources loaded: ', this.loader.resources);
           
            this.start();
        });
    }

    // recupera gli asset precaricati (sia JSON che IMG)
    loadAsset(key: string) {
        const what = this.loader.resources[key];
        // IMGs
        if (what instanceof Texture) {
            return new PIXI.Sprite(this.loader.resources[key]);
        }
        // JSON
        return what
    }

    // 
    playSound(key: string) {
        // this.loader.sound.play(key);
        this.soundsManager.playSound(key);
    }

    start() {
        this.scene = new this.config.scenes[0]();   // TODO
        this.app.stage.addChild(this.scene.container);
    }
}

export const Engine = new PixiEngine();
