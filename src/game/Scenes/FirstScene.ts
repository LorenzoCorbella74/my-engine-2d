import { BlurFilter, Sprite } from "pixi.js";
import { PixiEngine } from "../../engine/Engine";
import { Scene } from "../../engine/Scene";
import { Game } from '../entities/game';

import { createTimelineAnimation } from './animations/timeline'

export class FirstScene extends Scene {

    bg: any;
    bunny: any;
    bunny2: any;
    bunny3: any;

    timeline: GSAPTimeline
    game: Game;

    constructor() {
        super(PixiEngine)
    }

    init() {

        this.game = new Game('Game', null)

        const blurFilter = new BlurFilter();
        blurFilter.blur = 10;

        this.engine.filters.addFilter(this.engine.scenes.currentScene, blurFilter);


        // 1 test 
        this.bg = this.engine.getAsset("bg");
        this.bg.width = window.innerWidth;
        this.bg.height = window.innerHeight;
        this.bg.interactive = true;
        this.addChild(this.bg);

        this.engine.camera.focusOn(null, this)

        this.bg.on("mousedown", (e) => {
            this.engine.toggle();
        });

        // 2 Go to the second Scene
        this.bunny = this.engine.getAsset("bunny") as Sprite;
        this.bunny.width = 64;
        this.bunny.height = 64;
        this.bunny.x = 100
        this.bunny.y = 100
        this.bunny.anchor.set(0.5);
        this.bunny.interactive = true;
        this.addChild(this.bunny);
        this.bunny.on("mousedown", (e) => {
            this.engine.scenes.changeScene('SecondScene')
        });

        //  Go to the Matter Scene
        this.bunny3 = this.engine.getAsset("bunny") as Sprite;
        this.bunny3.width = 64;
        this.bunny3.height = 64;
        this.bunny3.x = 300
        this.bunny3.y = 100
        this.bunny3.anchor.set(0.5);
        this.bunny3.interactive = true;
        this.addChild(this.bunny3);
        this.bunny3.on("mousedown", (e) => {
            this.engine.filters.animateFilter(this.engine.scenes.currentScene, blurFilter, 2)
            this.engine.time.after(5, () => {
                this.engine.scenes.changeScene('MatterScene')
            })
        });

        this.bunny2 = this.engine.getAsset("bunny") as Sprite;
        this.bunny2.width = 128;
        this.bunny2.height = 128;
        this.bunny2.x = 200
        this.bunny2.y = 200
        this.bunny2.anchor.set(0.5);
        this.bunny2.interactive = true;
        this.addChild(this.bunny2);


        // Creazione di una timeline per l'animazione complessa
        const timeline = createTimelineAnimation(this.bunny2);
        this.timeline = timeline;
        timeline.pause()




        this.bunny2.on("mousedown", (e) => {

            // Esegui l'animazione
            timeline.play();
        })



        // 3 JSON
        console.log(this.engine.getAsset("test"));

        // 4. SOUNDS (mp3)
        this.engine.sounds.playSound("mp3_test");

        // test Stortage
        this.engine.storage.save('test-engine', { lore: 'is ok!' })
    }

    update(dt, delta: number) {
        this.bunny.rotation += dt;
    }

    onExit(): void {

        this.engine.sounds.stopSound("mp3_test");
    }

    destroy() {
        // NOTE:  GSAP ANIMATION MUST BE STOPPED
        this.timeline.kill()

        // si rimovono tutti i figli
        const removedChild = this.removeChildren()
        this.engine.log(this.constructor.name + ' destroyed!: ', removedChild)

        // super.destroy() // si rimuove gli elementi della scena
    }

}

