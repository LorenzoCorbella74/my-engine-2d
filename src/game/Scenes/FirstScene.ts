import { Sprite } from "pixi.js";
import { PixiEngine as $PE } from "../../engine/Engine";
import { Scene } from "../../engine/Scene";

export class FirstScene extends Scene {

    bg: any;
    bunny: any;
    json: any;

    constructor() {
        super()
    }

    setup() {
        // 1 test 
        this.bg = $PE.getAsset("bg");
        this.bg.width = window.innerWidth;
        this.bg.height = window.innerHeight;
        this.bg.interactive = true;
        this.addChild(this.bg);

        $PE.camera.focusOn(null, this)

        this.bg.on("mousedown", function (e) {
            $PE.toggle();
        });

        // 2
        this.bunny = $PE.getAsset("bunny") as Sprite;
        this.bunny.width = 64;
        this.bunny.height = 64;
        this.bunny.x = 100
        this.bunny.y = 100
        this.bunny.anchor.set(0.5);
        this.bunny.interactive = true;
        this.addChild(this.bunny);
        // Test timer
        /* this.bunny.on("mousedown", function (e) {
            $PE.time.after(5,()=> {
                $PE.log('Testing timer with repeat')
            })
        }); */
        // test changeScene
        this.bunny.on("mousedown", function (e) {
            $PE.time.after(1, () => {
                $PE.scenes.changeScene('SecondScene')
            })
        });

        // 3 JSON
        this.json = $PE.getAsset("test");
        console.log(this.json);

        // 4. SOUNDS (mp3)
        $PE.sounds.playSound("mp3_test");

        // test Stortage
        $PE.storage.save('test-engine', { lore: 'is ok!' })
    }

    update(delta: number) {
        this.bunny.rotation += 0.01 * delta;
    }

    destroy() {
        $PE.log(this.constructor.name + ' destroyed!')
    }

}