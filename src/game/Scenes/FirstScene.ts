import { Sprite } from "pixi.js";
import { PixiEngine } from "../../engine/Engine";
import { Scene } from "../../engine/SceneManager";

export class FirstScene extends Scene {

    bg: any;
    bunny: any;
    json: any;

    constructor() {
        super()
    }

    setup() {
        // 1 test 
        this.bg = PixiEngine.getAsset("bg");
        this.bg.width = window.innerWidth;
        this.bg.height = window.innerHeight;
        this.bg.interactive = true;

        this.bg.on("mousedown", function (e) {
            PixiEngine.toggle();
        });

        // 2
        this.bunny = PixiEngine.getAsset("bunny") as Sprite;
        this.bunny.width = 64;
        this.bunny.height = 64;
        this.bunny.x = 100
        this.bunny.y = 100
        this.bunny.anchor.set(0.5);
        this.bunny.interactive = true;

        // Test timer
        /* this.bunny.on("mousedown", function (e) {
            PixiEngine.time.after(5,()=> {
                PixiEngine.log('Testing timer with repeat')
            })
        }); */
        // test changeScene
        this.bunny.on("mousedown", function (e) {
            PixiEngine.time.after(5,()=> {
                PixiEngine.scenes.changeScene('SecondScene')
            })
        });


        // 3 JSON
        this.json = PixiEngine.getAsset("test");
        console.log(this.json);

        // 4. SOUNDS (mp3)
        PixiEngine.sounds.playSound("mp3_test");

        // aggiunge al container 
        this.addChild(this.bg);
        this.addChild(this.bunny);

        // test Stortage
        PixiEngine.storage.save('test-engine', { lore: 'is ok!' })
    }

    update(delta: number) {
        this.bunny.rotation += 0.01 * delta;
    }

    destroy() {
        PixiEngine.log(this.constructor.name + ' destroyed!')
    }

}