import * as PIXI from "pixi.js";
import { GameConfig } from "../game/Config";

export class Scene extends PIXI.Container {
    constructor() {
        super();
    }

    setup() { }

    destroy() { }

    update(deltaTime) {
        // Utilizzare deltaTime per aggiornare gli elementi della scena
    }
}

export class SceneManager {

    currentScene: Scene;
    private scenes: { [key: string]: Scene } = {}

    constructor(public app: PIXI.Application, public config: GameConfig) {
        this.currentScene = null;
        this.config.scenes.forEach(scene => {
            this.scenes[scene.name] = new scene()
        });
    }

    changeScene(sceneName: string) {
        if(sceneName in this.scenes){
            if (this.currentScene) {
                this.currentScene.destroy();
                this.app.stage.removeChild(this.currentScene);
            }
            this.currentScene = this.scenes[sceneName];
            this.app.stage.addChild(this.currentScene);
            this.currentScene.setup();
        }else {
            // ERRORE
        }

    }

    startDefaultScene() {
        const startScene = this.config.scenes[0].name;   // si istanzia
        this.changeScene(startScene);
    }
}