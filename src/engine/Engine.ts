import * as PIXI from "pixi.js";
import { Texture } from "pixi.js";
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { Preloader } from "./LoaderHelper";

// Managers
import { massiveRequire } from './utils';
import { SoundManager } from './SoundManager';
import { TimeManager } from './TimeManager';
import { StorageDB } from './StorageManager';
import { SceneManager } from './SceneManager';
import { InputKeyboardManager } from './InputKeyboardManager';
import { InputMouseManager } from './InputMouseManager';
import { GameConfig } from "../game/Config";
import { Camera } from './Camera';
import { GameLogic } from './GameLogic';

import { GameObjectRepo } from "./GameObjectRepo";
import { EventManager } from "./EventManager";
import { PhysicManager } from './PhysicManager'
import { CrossHairManager } from './CrossHairManager'
import { FiltersManager } from './FiltersManager'

export const ENGINE_MSG_PREFIX = "[PIXI-ENGINE]: "

export class Engine {
    app: PIXI.Application<PIXI.ICanvas>;
    config: GameConfig;

    private loader: Preloader;
    public sounds: SoundManager;
    public storage: StorageDB;
    public time: TimeManager;
    public scenes: SceneManager;
    public input: InputKeyboardManager;
    public mouse: InputMouseManager;
    public camera: Camera
    public logic: GameLogic;
    public repo: GameObjectRepo = new GameObjectRepo();
    public events: EventManager;
    public physics: PhysicManager
    public crosshair: CrossHairManager
    public filters: FiltersManager;

    paused: boolean = false;
    debug: boolean = false;

    constructor() { }


    // Funzione per gestire il ridimensionamento della finestra
    handleResize() {
        // Aggiorna le dimensioni dell'applicazione in base alle nuove dimensioni della finestra
        this.app.renderer.resize(window.innerWidth, window.innerHeight);
    }

    run(config: GameConfig) {
        gsap.registerPlugin(PixiPlugin);
        PixiPlugin.registerPIXI(PIXI);

        // NOTE: https://webpack.js.org/guides/dependency-management/#requirecontext
        // NOTE: The arguments passed to require.context must be literals!
        const loaderData = require["context"]('./../assets/', true, /\.(mp3|png|jpe?g|json)$/);

        this.config = config;

        document.title = config.name || 'PIXI-ENGINE';  // name of the game

        this.app = new PIXI.Application({
            // backgroundAlpha: 0, // transparente
            resizeTo: window,
            autoStart: false,
            // antialias: true, riduce la performance
            autoDensity: true,
            powerPreference: "high-performance",
            backgroundColor: /* 0x0 */0x31383E,
            resolution: devicePixelRatio
        });

        document.body.appendChild(this.app.view as HTMLCanvasElement);

        globalThis.__PIXI_APP__ = this.app;

        // debug
        window.$PE = PixiEngine

        this.storage = new StorageDB(config.storagePrefix);
        this.sounds = new SoundManager();
        this.time = new TimeManager(this.app);
        this.logic = new GameLogic()
        this.events = new EventManager(this);
        this.mouse = new InputMouseManager(this.app);
        this.scenes = new SceneManager(this.app, this.config);
        this.camera = new Camera(this.app, this.scenes);
        this.loader = new Preloader(massiveRequire(loaderData), this.sounds);
        this.physics = new PhysicManager(this.app)
        this.crosshair = new CrossHairManager();
        this.filters = new FiltersManager();

        this.app.view.addEventListener('resize', (ev: UIEvent) => {
            const target = ev.target as Window;

            this.scenes.currentScene?.onResize?.(target.innerWidth, target.innerHeight);
        });


        // loader .... ON
        this.loader.getAssets().then((result) => {
            // loader .... OFF
            this.log(ENGINE_MSG_PREFIX + 'Resources loaded, starting loop!!');
            this.scenes.startDefaultScene();
            this.input = new InputKeyboardManager({
                // DEFAULTS
                ...{
                    'UP': 'w',
                    'DOWN': 's',
                    'RIGHT': 'd',
                    'LEFT': 'a',
                    'SPACE': ' ',
                }, ...config.input
            }, this.app);
            this.start();
            this.handleResize();
        });

        this.app.ticker.maxFPS = 60;
        this.app.ticker.minFPS = 30;
        this.app.ticker.add((delta) => {

            this.time.update()
            this.physics.update() // updating Matter-js 

            this.scenes.currentScene.update(this.time.getDeltaTime(), delta);     // NOTE: delta è intorno a 1 !!!!!
            this.events.processEvents()
            this.camera.update();

            this.time.runOnFrameNum([1], (frame) => {
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

    getTexture(key: string) {
        return this.loader.resources[key]
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
