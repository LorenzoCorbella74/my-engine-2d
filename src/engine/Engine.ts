import * as PIXI from "pixi.js";
import { Texture } from "pixi.js";
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { LoaderHelper } from "./LoaderHelper";

// Managers
import { massiveRequire } from './utils';
import { SoundManager } from './SoundManager';
import { TimeManager } from './TimeManager';
import { StorageDB } from './StorageManager';
import { SceneManager } from './SceneManager';
import { InputManager } from './InputManager';
import { GameConfig } from "../game/Config";
import { Camera } from './Camera';
import { GameLogic } from './GameLogic';

import { GameObjectRepo } from "./GameObjectRepo";
import { EventManager } from "./EventManager";

export const ENGINE_MSG_PREFIX = "[PIXI-ENGINE]: "

export class Engine {
    app: PIXI.Application<PIXI.ICanvas>;
    config: GameConfig;

    private loader: LoaderHelper;
    public sounds: SoundManager;
    public storage: StorageDB;
    public time: TimeManager;
    public scenes: SceneManager;
    public input: InputManager;
    public camera: Camera
    public logic: GameLogic;
    public repo: GameObjectRepo = new GameObjectRepo();
    public events: EventManager;

    paused: boolean = false

    constructor() { }

    run(config: GameConfig) {
        gsap.registerPlugin(PixiPlugin);
        PixiPlugin.registerPIXI(PIXI);

        // NOTE: https://webpack.js.org/guides/dependency-management/#requirecontext
        // NOTE: The arguments passed to require.context must be literals!
        const loaderData = require["context"]('./../assets/', true, /\.(mp3|png|jpe?g|json)$/);

        this.config = config;

        document.title = config.name || 'PIXI-ENGINE';  // name of the game

        this.app = new PIXI.Application({
            resizeTo: window,
            autoStart: false,
            /* antialias: true, */
            autoDensity: true,
            backgroundColor: 0x0,
            resolution: devicePixelRatio
        });

        document.body.appendChild(this.app.view as any); // TODO: Argument of type 'ICanvas' is not assignable to parameter of type 'Node'.

        this.storage = new StorageDB(config.storagePrefix);
        this.time = new TimeManager(this.app);
        this.scenes = new SceneManager(this.app, this.config);
        this.camera = new Camera(this.app, this.scenes);
        this.logic = new GameLogic()
        this.events = new EventManager(this);
        this.input = new InputManager({
            // DEFAULTS
            ...{
                'UP': 'w',
                'DOWN': 's',
                'RIGHT': 'd',
                'LEFT': 'a',
                'SPACE': ' ',
            }, ...config.input
        }, this.app);
        this.sounds = new SoundManager();
        this.loader = new LoaderHelper(massiveRequire(loaderData), this.sounds);

        // loader .... ON
        this.loader.preload().then((result) => {
            // loader .... OFF
            this.log(ENGINE_MSG_PREFIX + 'Resources loaded, starting loop!!');
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
            this.time.update()

            this.scenes.currentScene.update(this.time.getDeltaTime(), delta);     // NOTE: delta è intorno a 1 !!!!!
            this.events.processEvents()
            this.camera.update();

            this.time.runOnFrameNum(1, (frame) => {
                // console.log('frame', frame, this)   // this è l'engine
                this.logic.update()
            })
        });


    }

    // TODO: spostare nel time
    start() {
        this.app.ticker.start();
        this.paused = false;
    }

    // TODO: spostare nel time
    stop() {
        this.paused = true;
        this.app.ticker.stop();
    }

    // TODO: spostare nel time, vedere se utile
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
        console.log(ENGINE_MSG_PREFIX + message, ...other)
    }

    /**
     * Get the pre-loaded assets (both img and .json)
     */
    getAsset(key: string) {
        const resource = this.loader.resources[key];
        // IMGs
        if (resource instanceof Texture) {
            return new PIXI.Sprite(this.loader.resources[key]);
        }
        // JSON
        return resource
    }

    /**
     * Take the object from the gameObjects store
     * @param name the name of the object
     * @returns the object
     */
    getObjectByName(name: string) {
        return this.repo.getObjectByName(name)
    }

    /**
     * Take the object from the gameObjects store
     * @param id the id of the object
     * @returns the object
     */
    getObjectById(id: string) {
        return this.repo.getObjectById(id)
    }

    getGroup(name: string) {
        return this.repo.getGroup(name)
    }
}

export const PixiEngine = new Engine();

// come salvare uno screen : https://codesandbox.io/s/pixitests-forked-1gm13?file=/src/index.js:1164-1548
