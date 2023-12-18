import * as PIXI from "pixi.js";
import { Texture, Application, ICanvas } from "pixi.js";
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import Stats from 'stats.js';

// Managers
import AssetManager from "./AssetManager";
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
import { Debug2UIManager } from "./Debug2UIManager";
import { ParticleManager } from "./ParticleManager";
import { math } from "./utils/math";

import { GameObject } from "./GameObject";
import { State } from "./models/engine-state";
import { GameConfig } from "./models/config";
import { AnimationManager } from "./AnimationManager";
import { LocalizationManager } from "./LocalizationManager";

const stats = new Stats();

export class Engine {
    app!: Application<ICanvas>;
    config!: GameConfig;

    public loader!: AssetManager;
    public sounds!: SoundManager;
    public storage!: StorageDB;
    public time!: TimeManager;
    public scenes!: SceneManager;
    public keyboard!: InputKeyboardManager;
    public mouse!: InputMouseManager;
    public camera!: Camera
    public logic!: GameLogic;
    private repo: GameObjectRepo = new GameObjectRepo();
    public events!: EventManager;
    public physics!: PhysicManager
    public crosshair!: CrossHairManager
    public filters!: FiltersManager;
    private debug2UI!: Debug2UIManager;
    public emitter!: ParticleManager;
    public animation!: AnimationManager;
    public locale!: LocalizationManager;
    public math!: typeof math;

    private _state: State = 'idle';
    private _debug: boolean = false;

    private engineLogPrefix: string = '';

    constructor() { }

    // Funzione per gestire il ridimensionamento della finestra
    handleResize() {
        // Aggiorna le dimensioni dell'applicazione in base alle nuove dimensioni della finestra
        this.app.renderer.resize(window.innerWidth, window.innerHeight);
        if (this.app.view) {
            // TODO: resize event listener
             /* this.app.view */document.addEventListener('resize', (ev: Event) => {
            const { innerWidth, innerHeight } = ev.target as Window;
            this.scenes.currentScene?.onResize?.(innerWidth, innerHeight);
        });
        }
    }

    /* -------------------------- GAME STATE -------------------------- */

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

    getRepos() {
        return this.repo;
    }

    async run(config: GameConfig) {
        console.clear();

        gsap.registerPlugin(MotionPathPlugin,PixiPlugin);
        PixiPlugin.registerPIXI(PIXI);

        document.title = config.name || 'MY-ENGINE-2D';                         // name of the game
        this.engineLogPrefix = "[MY-ENGINE-2D]: " || config.engineLogPrefix;    // log prefix

        this.config = config;

        this.app = new PIXI.Application({
            // backgroundAlpha: 0, // transparent
            resizeTo: window, // FUNZIONA ?????
            autoStart: false,
            // antialias: true, performance !!!
            autoDensity: true,
            powerPreference: "high-performance",
            backgroundColor: 0x31383E,
            resolution: devicePixelRatio
        });

        document.body.appendChild(this.app.view as HTMLCanvasElement);

        if (import.meta.env.DEV) {
            stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
            stats.dom.style.position = 'absolute';
            stats.dom.style.left = '48px';
            stats.dom.style.top = '32px';
            document.body.appendChild(stats.dom);
        }

        // @ts-expect-error Set PIXI app to global window object for the PIXI Inspector
        globalThis.__PIXI_APP__ = this.app; // PIXI DEVTOOLS
        window.$PE = MyEngine2D             // debug

        this.math = math;
        this.storage = new StorageDB(config.storagePrefix);
        this.sounds = new SoundManager();
        this.animation = new AnimationManager();
        this.time = new TimeManager(this);
        this.logic = new GameLogic()
        this.events = new EventManager(this);
        this.locale = new LocalizationManager(this);
        this.mouse = new InputMouseManager(this.app);
        this.scenes = new SceneManager(this.app, this.config);
        this.camera = new Camera(this, this.scenes);
        this.loader = new AssetManager(this);
        this.physics = new PhysicManager(this);
        this.debug2UI = new Debug2UIManager(this.app);
        this.emitter = new ParticleManager(this.app);
        this.crosshair = new CrossHairManager(this);
        this.filters = new FiltersManager();
        this.keyboard = new InputKeyboardManager({
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

        const locales = await this.loader.loadAssetsFolder(this.config?.localeFolder || 'i18n')
        if (locales) {
            this.locale.setLanguage(this.config?.defaultLocale || navigator.language)
        }

        this.scenes.startDefaultScene();

        // the loop starts when startLoop is called
        this.app.ticker.maxFPS = 60;
        this.app.ticker.minFPS = 30;
        this.app.ticker.add((delta) => {                    // delta is close to 1
            stats.begin();
            this.time.update()                              // updating timers
            this.emitter.update(this.time.getDeltaTime())   // updating particles
            this.physics.update()                           // updating Matter-js 

            this.scenes.currentScene.update(this.time.getDeltaTime());
            this.events.processEvents()                     // dispatching events
            this.camera.update();                           // updating camera

            this.time.runOnFrameNum([1, 30], (frame: number) => {
                this.logic.update()                         // check game logic
            })
            // clear mouse state
            this.mouse.clear();
            stats.end();
        });

    }

    /* -------------------------- LOOP -------------------------- */

    startLoop() {
        this.app.ticker.start();
        this.state = 'running';
    }


    stopLoop() {
        this.app.ticker.stop();
        this.state = 'paused';
    }

    toggleLoop() {
        if (this.state === 'running') {
            this.stopLoop();
            this.state = 'paused';
        } else {
            this.startLoop();
            this.state = 'running';
        }
    }
    /* -------------------------- DEBUG -------------------------- */

    get debug() {
        return this._debug
    }
    togleDebug() {
        this._debug = !this._debug
    }

    /* -------------------------- LOGS -------------------------- */

    log(message: string, ...other: any) {
        if (!import.meta.env.DEV) return;
        console.log(this.engineLogPrefix + message, ...other)
    }

    warn(message: string, ...other: any) {
        if (!import.meta.env.DEV) return;
        console.warn(this.engineLogPrefix + message, ...other)
    }

    error(message: string, ...other: any) {
        if (!import.meta.env.DEV) return;
        console.error(this.engineLogPrefix + message, ...other)
    }

    /* -------------------------- LOGS TO UI -------------------------- */

    log2UI(message: string) {
        if (!import.meta.env.DEV) return;
        this.debug2UI.log2Screen(message)
    }

    /* -------------------------- PROXIED METHODS -------------------------- */

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
     * Retrieves the pre-loaded texture associated with the specified key.
     *
     * @param {string} key - The key of the texture to retrieve.
     * @return {*} The texture associated with the specified key.
     */
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

    /**
    * Retrieves a group by name.
    *
    * @param {string} name - The name of the group to retrieve.
    * @return {any} The group object.
    */
    getGroup(name: string): GameObject[] | null {
        return this.repo.getGroup(name)
    }

    /**
    * Retrieves objects from the game repository based on tags.
    *
    * @param {string | string[]} tags - The tags to filter the objects by.
    * @return {GameObject[]} An array of game objects that match the specified tags.
    */
    getObjectsByTags(tags: string | string[]): GameObject[] {
        return this.repo.getObjectByTags(tags)
    }
}

export const MyEngine2D = new Engine();
