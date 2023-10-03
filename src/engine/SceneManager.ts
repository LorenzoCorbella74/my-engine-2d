import * as PIXI from "pixi.js";
import { GameConfig } from "../game/Config";
import { PixiEngine as $PE } from "./Engine";

import { Scene } from './Scene';
import { gsap } from "gsap";

export class SceneManager {

    currentScene: Scene;
    private scenes: { [key: string]: Scene } = {}

    constructor(public app: PIXI.Application, public config: GameConfig) {
        this.currentScene = null;
        this.config.scenes.forEach(scene => {
            this.scenes[scene.name] = new scene($PE)
        });
    }

    setupNewScene(sceneName: string, animate: boolean = true) {
        this.currentScene = this.scenes[sceneName];
        this.app.stage.addChild(this.currentScene);
        this.currentScene.init();

        if (animate) {
            this.currentScene.alpha = 0;
            gsap.to(this.currentScene, {
                alpha: 1,
                duration: 1 // TODO: CONSTANT
            })
        }
    }

    private removeOldScene(sceneName: string, destroyScene: boolean = true) {
        this.app.stage.removeChild(this.currentScene);
        if (this.currentScene.onExit) {
            this.currentScene.onExit();
        }
        if (destroyScene) {
            delete this.scenes[sceneName];
            this.currentScene.destroy({ children: true });
        }
    }

    changeScene(sceneName: string, destroyScene: boolean = true, animate: boolean = true) {
        if (sceneName in this.scenes) {
            if (this.currentScene) {
                if (animate) {
                    gsap.to(this.currentScene, {
                        alpha: 0, // Valore di opacità finale
                        duration: 0.5,         // in  secondi, ODO: CONSTANT
                        onComplete: () => {
                            this.removeOldScene(this.currentScene.constructor.name, destroyScene);
                            this.setupNewScene(sceneName);
                        }
                    })
                } else {
                    this.removeOldScene(this.currentScene.constructor.name, destroyScene);
                    this.setupNewScene(sceneName);
                }
            } else {
                this.setupNewScene(sceneName);
            }
        } else {
            $PE.log(`Scene "${sceneName}" not found`);
        }
    }

    startDefaultScene() {
        const startScene = this.config.scenes[0].name;   // si istanzia
        if (startScene) {
            $PE.log(`Start default Scene ${startScene}`);
            this.changeScene(startScene);
        } else {
            $PE.log(`Default Scene not present!`);
        }
    }
}