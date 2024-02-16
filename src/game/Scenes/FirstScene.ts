import { BlurFilter } from "pixi.js";
import { MyEngine2D } from "../../engine/Engine";
import { Scene } from "../../engine/Scene";

import { createTimelineAnimation } from './animations/timeline';
import { Background } from "../entities/FirstScene/background";
import { GameObject } from "../../engine/GameObject";
import { Button } from "../entities/FirstScene/button";
import { DefaultComponentNames } from "../../engine/models/component-names.enum";
import { SpriteComponent } from "../../engine/components/sprite";
import { UITextExample } from "../entities/FirstScene/UItest";

export class FirstScene extends Scene {

    bg!: GameObject;
    bunny!: GameObject;
    bunny2!: GameObject;
    bunny3!: GameObject;
    bunny4!: GameObject;

    timeline!: GSAPTimeline

    constructor() {
        super(MyEngine2D)
    }

    async init() {

        await this.engine.loader.loadAssetsFolder('group1');


        // si applica il filtro a tutta la scena (tranne all'UI) ...
        const blurFilter = new BlurFilter();
        blurFilter.blur = 10;
        this.engine.filters.addFilter(this.engine.scenes.currentScene, blurFilter);

        this.bg = new Background('Background', 'bg');

        this.engine.camera.lockTo(null, this)

        this.bunny = new Button('Bunny', 'bunny', 100, 100, 64, 64, () => this.engine.scenes.goToScene('SecondScene'));

        // Timeline for complex animation
        this.bunny2 = new Button('Bunny2', 'bunny', 200, 200, 128, 128, () => { timeline.play(); });
        const bunny2Sprite = this.bunny2.getComponent<SpriteComponent>(DefaultComponentNames.Sprite)!.sprite
        const timeline = createTimelineAnimation(bunny2Sprite);
        this.timeline = timeline;
        timeline.pause()

        this.bunny3 = new Button('Bunny3', 'bunny', 300, 100, 64, 64, () => {
            this.engine.filters.animateFilter(this.engine.scenes.currentScene, blurFilter, 2, { blur: 0 })
            this.engine.time.after(3, () => {
                this.engine.scenes.goToScene('MatterScene')
            })
        });

        this.bunny4 = new Button('Bunny4', 'bunny', 500, 100, 64, 64, () => {
            this.engine.filters.animateFilter(this.engine.scenes.currentScene, blurFilter, 2, { blur: 0 })
            this.engine.time.after(2, () => {
                this.engine.scenes.goToScene('GraphicScene')
            })
        });

        // 3 Recover JSON from assets cache
        console.log(this.engine.getAsset("test"));

        // 4.Recover SOUNDS (mp3) from assets cache 
        // this.engine.sounds.playSound("mp3_test");

        // test Storage
        this.engine.storage.save('test-engine', { lore: 'is ok!' })


        // add UI element
        this.engine.ui.addUIElement(new UITextExample('UItest', 'Testo in UI: XxX'));
    }

    update(dt: number) {
        this.bunny.rotation += dt;

        // updates gameObjects
        super.update(dt)
    }

    onExit() {
        // stop sounds
        this.engine.sounds.stopSound("mp3_test");

        // NOTE:  GSAP ANIMATION MUST BE STOPPED
        this.timeline.kill()

        // Remove scene and its gameObjects and rigidbodies (if present)
        super.onExit()
    }

}

