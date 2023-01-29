import * as PIXI from "pixi.js";
import { Texture } from "pixi.js";
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { LoaderHelper } from "./LoaderHelper";

// Managers
import { SoundManager } from './SoundManager';
import { massiveRequire } from './utils';
import { TimeManager } from './TimeManager';
import { StorageDB } from './StorageManager';
import { SceneManager } from './SceneManager';

export const engineMessage = "[PIXI-ENGINE]: "

export class Engine {
    app: PIXI.Application;
    config: any;

    private loader: LoaderHelper;
    public sounds: SoundManager;
    public storage: StorageDB;
    public time: TimeManager;
    public scenes: SceneManager;

    paused: boolean = false

    constructor() { }

    run(config) {
        gsap.registerPlugin(PixiPlugin);
        PixiPlugin.registerPIXI(PIXI);

        // NOTE: https://webpack.js.org/guides/dependency-management/#requirecontext
        // NOTE: The arguments passed to require.context must be literals!
        const loaderData = require["context"]('./../assets/', true, /\.(mp3|png|jpe?g|json)$/);

        this.config = config;

        document.title = config.name || 'PIXI-ENGINE';

        this.app = new PIXI.Application({
            resizeTo: window,
            autoStart: false,
            antialias: true,
            autoDensity: true,
            backgroundColor: 0x0,
            resolution: devicePixelRatio
        });
        this.storage = new StorageDB(config.storagePrefix);
        this.time = new TimeManager(this.app);
        this.scenes = new SceneManager(this.app, this.config);

        document.body.appendChild(this.app.view as any); // TODO: Argument of type 'ICanvas' is not assignable to parameter of type 'Node'.

        this.sounds = new SoundManager();
        this.loader = new LoaderHelper(massiveRequire(loaderData), this.sounds);
        // loader .... ON
        this.loader.preload().then((result) => {
            // loader .... OFF
            this.log(engineMessage + 'Resources loaded, starting loop!!');
            this.scenes.startDefaultScene();
            this.start();
        });

        this.app.ticker.maxFPS = 60;
        this.app.ticker.minFPS = 30;
        this.app.ticker.add((delta) => {
            /*             
            time += delta;
            if (time > 200 && !image) {
                image = app.renderer.plugins.extract.image(sprite).src;
                console.log(image);
                downloadImage(image, "img.png");
            } */
            this.time.update(delta)
            this.scenes.currentScene.update(delta);
        });
    }

    start() {
        this.app.ticker.start();
    }

    stop() {
        this.app.ticker.stop();
    }

    toggle() {
        if (!this.paused) {
            this.stop();
            this.paused = true;
        } else {
            this.start();
            this.paused = false;
        }
    }

    log(message: string, ...other) {
        console.log(engineMessage + message, ...other)
    }

    /**
     * Get the pre-loaded assets (both img and .json)
     */
    getAsset(key: string) {
        const what = this.loader.resources[key];
        // IMGs
        if (what instanceof Texture) {
            return new PIXI.Sprite(this.loader.resources[key]);
        }
        // JSON
        return what
    }
}

export const PixiEngine = new Engine();

// come salvare uno screen : https://codesandbox.io/s/pixitests-forked-1gm13?file=/src/index.js:1164-1548
