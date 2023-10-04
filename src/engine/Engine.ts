import * as PIXI from "pixi.js";
import { Texture } from "pixi.js";
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";

// Managers
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
import AssetManager from "./AssetManager";
import { GameObject } from "./GameObject";

export const ENGINE_MSG_PREFIX = "[PIXI-ENGINE]: "

export class Engine {
    app!: PIXI.Application<PIXI.ICanvas>;
    config!: GameConfig;

    public loader!: AssetManager;
    public sounds!: SoundManager;
    public storage!: StorageDB;
    public time!: TimeManager;
    public scenes!: SceneManager;
    public input!: InputKeyboardManager;
    public mouse!: InputMouseManager;
    public camera!: Camera
    public logic!: GameLogic;
    public repo: GameObjectRepo = new GameObjectRepo();
    public events!: EventManager;
    public physics!: PhysicManager
    public crosshair!: CrossHairManager
    public filters!: FiltersManager;

    private _paused: boolean = false;
    private _debug: boolean = false;

    constructor() { }

    // Funzione per gestire il ridimensionamento della finestra
    handleResize() {
        // Aggiorna le dimensioni dell'applicazione in base alle nuove dimensioni della finestra
        this.app.renderer.resize(window.innerWidth, window.innerHeight);
        if (this.app.view) {
            // TODO
            /* this.app.view.addEventListener('resize', (ev: Event) => {
               const { innerWidth, innerHeight } = ev.target as Window;
               this.scenes.currentScene?.onResize?.(innerWidth, innerHeight);
           }); */
        }

    }

    async run(config: GameConfig) {
        gsap.registerPlugin(PixiPlugin);
        PixiPlugin.registerPIXI(PIXI);

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

        // @ts-expect-error Set PIXI app to global window object for the PIXI Inspector
        globalThis.__PIXI_APP__ = this.app; // PIXI DEVTOOLS
        window.$PE = PixiEngine             // debug

        this.storage = new StorageDB(config.storagePrefix);
        this.sounds = new SoundManager();
        this.time = new TimeManager(this.app);
        this.logic = new GameLogic()
        this.events = new EventManager(this);
        this.mouse = new InputMouseManager(this.app);
        this.scenes = new SceneManager(this.app, this.config);
        this.camera = new Camera(this.app, this.scenes);
        this.loader = new AssetManager(this.sounds) /* new Preloader(this.sounds) */;
        this.physics = new PhysicManager(this.app)
        this.crosshair = new CrossHairManager();
        this.filters = new FiltersManager();
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

        this.handleResize();

        /* this.log(ENGINE_MSG_PREFIX + 'Resources loaded, starting loop!!'); */
        this.scenes.startDefaultScene();

        // the loop starts when startLoop is called
        this.app.ticker.maxFPS = 60;
        this.app.ticker.minFPS = 30;
        this.app.ticker.add((delta) => {

            this.time.update()     // updating timers
            this.physics.update()  // updating Matter-js 

            this.scenes.currentScene.update(this.time.getDeltaTime(), delta);     // NOTE: delta è intorno a 1 !!!!!
            this.events.processEvents()
            this.camera.update();

            this.time.runOnFrameNum([1], (frame: number) => {
                this.logic.update()
            })
        });
    }

    startLoop() {
        this.app.ticker.start();
        this._paused = false;
    }


    stopLoop() {
        this._paused = true;
        this.app.ticker.stop();
    }

    toggle() {
        if (!this._paused) {
            this.stopLoop();
            this._paused = true;
        } else {
            this.startLoop();
            this._paused = false;
        }
    }

    togleDebug() {
        this._debug = !this._debug
    }

    get debug() {
        return this._debug
    }

    log(message: string, ...other: any) {
        if (!import.meta.env.DEV) return;
        console.log(ENGINE_MSG_PREFIX + message, ...other)
    }

    warn(message: string, ...other: any) {
        if (!import.meta.env.DEV) return;
        console.warn(ENGINE_MSG_PREFIX + message, ...other)
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
    getObjectByName(name: string): GameObject | null | undefined {
        return this.repo.getObjectByName(name)
    }

    /**
     * Take the object from the gameObjects store
     * @param id the id of the object
     * @returns the object
     */
    getObjectById(id: string): GameObject | null | undefined {
        return this.repo.getObjectById(id)
    }

    getGroup(name: string) {
        return this.repo.getGroup(name)
    }
}

export const PixiEngine = new Engine();

// come salvare uno screen : https://codesandbox.io/s/pixitests-forked-1gm13?file=/src/index.js:1164-1548
