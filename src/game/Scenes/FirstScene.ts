import { Sprite } from "pixi.js";
import { PixiEngine as $PE } from "../../engine/Engine";
import { Scene } from "../../engine/Scene";
import { gsap } from "gsap";
import { InputKeyboardManager } from "../../engine/InputKeyboardManager";
import { Game } from '../entities/game';

export class FirstScene extends Scene {

    bg: any;
    bunny: any;
    bunny2: any;
    bunny3: any;
    json: any;

    timeline: any // TODO
    game: Game;

    constructor(inputMgr: InputKeyboardManager) {
        super(inputMgr)
    }

    setup() {

        this.game = new Game('Game', null)


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

        // 2 Go to the second Scene
        this.bunny = $PE.getAsset("bunny") as Sprite;
        this.bunny.width = 64;
        this.bunny.height = 64;
        this.bunny.x = 100
        this.bunny.y = 100
        this.bunny.anchor.set(0.5);
        this.bunny.interactive = true;
        this.addChild(this.bunny);
        this.bunny.on("mousedown", function (e) {
            $PE.time.after(1, () => {
                $PE.scenes.changeScene('SecondScene')
            })
        });

        //  Go to the Matter Scene
        this.bunny3 = $PE.getAsset("bunny") as Sprite;
        this.bunny3.width = 64;
        this.bunny3.height = 64;
        this.bunny3.x = 300
        this.bunny3.y = 100
        this.bunny3.anchor.set(0.5);
        this.bunny3.interactive = true;
        this.addChild(this.bunny3);
        this.bunny3.on("mousedown", function (e) {
            $PE.time.after(1, () => {
                $PE.scenes.changeScene('MatterScene')
            })
        });

        this.bunny2 = $PE.getAsset("bunny") as Sprite;
        this.bunny2.width = 128;
        this.bunny2.height = 128;
        this.bunny2.x = 200
        this.bunny2.y = 200
        this.bunny2.anchor.set(0.5);
        this.bunny2.interactive = true;
        this.addChild(this.bunny2);


        // Creazione di una timeline per l'animazione complessa
        this.timeline = gsap.timeline({ repeat: -1, });
        this.timeline.pause()

        // Animazione di scaling, posizione e rotazione usando GSAP
        this.timeline.to(this.bunny2, {
            x: $PE.app.view.width / 2,
            y: $PE.app.view.height / 2,
            rotation: Math.PI * 2,
            // scaleX: 4,
            // scaleY: 4,
            pixi: { scaleX: 1.25, scaleY: 1.25 },
            duration: 2,
            ease: 'power1.inOut',
            onUpdate: () => {
                console.log('Updating!');
            },
            onComplete: () => {
                // Questa funzione verrà chiamata al termine dell'animazione
                console.log('Animazione UNO completata!', this.bunny2);
            },
        });

        // Animazione di fade-in e fade-out
        this.timeline.to(this.bunny2, {
            alpha: 0,
            duration: 0.5,
            delay: 0.5,
            pixi: { scale: 1 },
            onComplete: () => {
                this.alpha = 1; // Reset dell'opacità
                // this.scale.set(1); // Reset del scaling
                this.rotation = 0; // Reset della rotazione
                this.position.set($PE.app.view.width / 2, $PE.app.view.height / 2); // Reset della posizione 
                console.log('Animazione DUE completata!', this);
            },
        });

        const timeline = this.timeline

        // esempio GSAP
        this.bunny2.on("mousedown", function (e) {
            /* gsap.to(this, {  // this è bunny
                x: $PE.app.view.width / 2,   // Posizione finale x
                y: this.y,   // Posizione finale y
                alpha: 0, // Valore di opacità finale
                duration: 2,         // in  secondi
                rotation: Math.PI * 2,
                // scale: 2, FA SCOPPIARE TUTTO !!!!
                // repeat: -1, yoyo: true,
                // ease: 'power1.inOut',
                onComplete: () => {
                    // Questa funzione verrà chiamata al termine dell'animazione
                    console.log('Animazione completata!', this);
                },
            }); */


            // Esegui l'animazione
            timeline.play();
        })




        // Test timer
        /* this.bunny.on("mousedown", function (e) {
            $PE.time.after(5,()=> {
                $PE.log('Testing timer with repeat')
            })
        }); */
        // test changeScene


        // 3 JSON
        this.json = $PE.getAsset("test");
        console.log(this.json);

        // 4. SOUNDS (mp3)
        $PE.sounds.playSound("mp3_test");

        // test Stortage
        $PE.storage.save('test-engine', { lore: 'is ok!' })
    }

    update(dt, delta: number) {
        this.bunny.rotation += dt;


    }

    destroy() {
        // NOTE:  GSAP ANIMATION MUST BE STOPPED
        this.timeline.kill()

        // si rimovono tutti i figli
        const removedChild = this.removeChildren()
        $PE.log(this.constructor.name + ' destroyed!: ', removedChild)
    }

}