import * as PIXI from "pixi.js";
import { gsap } from "gsap";
import { MyEngine2D } from "./Engine";

import { Scene } from './Scene';
import { GameConfig } from "./models/config";

/**
 * The SceneManager class manages the scenes in the game.
 */
export class SceneManager {

    currentScene!: Scene;
    private scenes: { [key: string]: Scene } = {}

    constructor(public app: PIXI.Application, public config: GameConfig<any>) {
        this.config.scenes.forEach((scene: new (...arg: any) => Scene) => {
            this.scenes[scene.name] = new scene(MyEngine2D)
        });
    }

    async setupNewScene(sceneName: string, animate: boolean = true, duration: number = 1) { // TODO: mettere constanti
        this.currentScene = this.scenes[sceneName];
        this.currentScene.zIndex = 1; // default for all scenes (Ui elements have a zIndex of 2)
        this.app.stage.addChild(this.currentScene);
        MyEngine2D.state = 'loading';
        await this.currentScene.init();
        // START LOOP
        MyEngine2D.startLoop()
        if (animate) {
            this.currentScene.alpha = 0;
            gsap.to(this.currentScene, {
                alpha: 1,
                duration
            })
        }
    }

    private removeOldScene(sceneName: string, destroyScene: boolean = true) {
        MyEngine2D.stopLoop()
        this.app.stage.removeChild(this.currentScene);
        if (this.currentScene.onExit) {
            this.currentScene.onExit();
        }
        if (destroyScene) {
            delete this.scenes[sceneName];
            this.currentScene.destroy({ children: true });
        }
    }

    /**
     * Changes the current scene to the specified scene.
     * 
     * @param sceneName - The name of the scene to change to.
     * @param destroyScene - Optional. Specifies whether to destroy the current scene before changing to the new scene. Default is true.
     * @param animate - Optional. Specifies whether to animate the scene transition. Default is true.
     * @param duration - Optional. The duration of the scene transition animation in seconds. Default is 0.5.
     */
    goToScene(sceneName: string, destroyScene: boolean = true, animate: boolean = true, duration: number = .5) {
        if (sceneName in this.scenes) {
            if (this.currentScene) {
                if (animate) {
                    gsap.to(this.currentScene, {
                        alpha: 0, // final value
                        duration,
                        onComplete: () => {
                            this.removeOldScene(this.currentScene.constructor.name, destroyScene);
                            this.setupNewScene(sceneName, animate, duration);
                        }
                    })
                } else {
                    this.removeOldScene(this.currentScene.constructor.name, destroyScene);
                    this.setupNewScene(sceneName, animate, duration);
                }
            } else {
                // first run
                this.setupNewScene(sceneName, animate, duration);
            }
        } else {
            MyEngine2D.log(`Scene "${sceneName}" not found`);
        }
    }

    /**
     * Starts the default scene of the game.
     */
    startDefaultScene() {
        const startScene = this.config.scenes[0].name;   // si istanzia
        if (startScene) {
            MyEngine2D.log(`Start default Scene ${startScene}`);
            this.goToScene(startScene);
        } else {
            MyEngine2D.log(`Default Scene not present!`);
        }
    }
}