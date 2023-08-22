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
            this.scenes[scene.name] = new scene()
        });
    }

    setupNewScene(sceneName: string) {
        this.currentScene = this.scenes[sceneName];
        this.app.stage.addChild(this.currentScene);
        this.currentScene.setup();
        this.currentScene.alpha = 0;
        gsap.to(this.currentScene, {
            alpha: 1, // Valore di opacità finale
            duration: 0.25
        })
    }

    changeScene(sceneName: string) {
        if (sceneName in this.scenes) {
            if (this.currentScene) {
                gsap.to(this.currentScene, {
                    alpha: 0, // Valore di opacità finale
                    duration: 0.5,         // in  secondi,
                    onComplete: () => {
                        this.currentScene.destroy();
                        this.app.stage.removeChild(this.currentScene);
                        this.setupNewScene(sceneName);
                    }
                })
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