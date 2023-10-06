import * as PIXI from "pixi.js";
import { Texture, Application, ICanvas } from "pixi.js";
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";

// Managers
import { SoundManager } from './SoundManager';
import { TimeManager } from './TimeManager';
import { StorageDB } from './StorageManager';
import { SceneManager } from './SceneManager';
import { InputKeyboardManager } from './InputKeyboardManager';
import { InputMouseManager } from './InputMouseManager';
import { Camera } from './Camera';
import { GameLogic } from './GameLogic';
import { GameObjectRepo } from "./GameObjectRepo";
import { EventManager } from "./EventManager";
import { PhysicManager } from './PhysicManager'
import { CrossHairManager } from './CrossHairManager'
import { FiltersManager } from './FiltersManager'
import AssetManager from "./AssetManager";

import { GameObject } from "./GameObject";
import { State } from "./models/engine-state";
import { GameConfig } from "./models/config";

export class Engine {
    app!: Application<ICanvas>;
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

    private _state: State = 'idle';
    private _debug: boolean = false;

    private engineLogPrefix: string = '';

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

    get state(): State {
        return this._state;
    }

    set state(state: State) {
        this._state = state;
        if (this._state === 'loading') {
            document.getElementById('loader')!.style.display = 'block';
        } else {
            document.getElementById('loader')!.style.display = 'none';
        }
    }

    async run(config: GameConfig) {
        gsap.registerPlugin(PixiPlugin);
        PixiPlugin.registerPIXI(PIXI);

        document.title = config.name || 'MY-ENGINE-2D';  // name of the game
        this.engineLogPrefix = "[MY-ENGINE-2D]: " || config.engineLogPrefix;

        this.config = config;

        this.app = new PIXI.Application({
            // backgroundAlpha: 0, // transparent
            resizeTo: window,
            autoStart: false,
            // antialias: true, performance !!!
            autoDensity: true,
            powerPreference: "high-performance",
            backgroundColor: 0x31383E,
            resolution: devicePixelRatio
        });

        document.body.appendChild(this.app.view as HTMLCanvasElement);

        // @ts-expect-error Set PIXI app to global window object for the PIXI Inspector
        globalThis.__PIXI_APP__ = this.app; // PIXI DEVTOOLS
        window.$PE = MyEngine2D             // debug

        this.storage = new StorageDB(config.storagePrefix);
        this.sounds = new SoundManager();
        this.time = new TimeManager(this.app);
        this.logic = new GameLogic()
        this.events = new EventManager(this);
        this.mouse = new InputMouseManager(this.app);
        this.scenes = new SceneManager(this.app, this.config);
        this.camera = new Camera(this.app, this.scenes);
        this.loader = new AssetManager(this.sounds);
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

        this.scenes.startDefaultScene();

        // the loop starts when startLoop is called
        this.app.ticker.maxFPS = 60;
        this.app.ticker.minFPS = 30;
        this.app.ticker.add((delta) => {        // delta is close to 1

            this.time.update()     // updating timers
            this.physics.update()  // updating Matter-js 

            this.scenes.currentScene.update(this.time.getDeltaTime());
            this.events.processEvents()
            this.camera.update();

            this.time.runOnFrameNum([1, 30], (frame: number) => {
                this.logic.update()
            })
        });
    }

    startLoop() {
        this.app.ticker.start();
        this.state = 'running';
    }


    stopLoop() {
        this.state = 'paused';
        this.app.ticker.stop();
    }

    toggle() {
        if (this.state === 'running') {
            this.stopLoop();
            this.state = 'paused';
        } else {
            this.startLoop();
            this.state = 'running';
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
        console.log(this.engineLogPrefix + message, ...other)
    }

    warn(message: string, ...other: any) {
        if (!import.meta.env.DEV) return;
        console.warn(this.engineLogPrefix + message, ...other)
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

export const MyEngine2D = new Engine();
