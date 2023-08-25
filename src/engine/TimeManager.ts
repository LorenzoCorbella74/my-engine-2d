import { Application } from "pixi.js";
import { gsap } from "gsap";


type Timer = {
    duration: number;
    cacheDuration: number;
    callback: () => any;
    repeat?: number; // if 
}

export class TimeManager {
    private elapsed: number;        // il trempo totale [in secondi]
    private dt: number;             // il dt, this.app.ticker.deltaMS [in secondi]
    private _frame: number;         // il frame corrente


    private gameSpeed = 1;

    private timers: Timer[] = []     // timers

    constructor(public app: Application) {
        this.elapsed = 0;
        this._frame = 0;
        this.dt = this.app.ticker.elapsedMS / 1000;
    }

    update() {
        this.elapsed += this.dt;        // quanto è trascorso
        this._frame++;

        // conteggio frame
        if (this._frame > this.app.ticker.maxFPS) {
            this._frame = 1;
        }

        // timers
        for (var i = this.timers.length - 1; i >= 0; i--) {
            let timer = this.timers[i];
            timer.duration -= this.getDeltaTime();
            if (timer.duration < 0 && timer.repeat) {
                timer.repeat--;
                timer.duration = timer.cacheDuration;
                timer.callback();
            } else if (timer.duration < 0) {
                if (!timer.repeat || timer.repeat !== 0) {
                    timer.callback();
                }
                this.timers.splice(i, 1);
            }
        }
    }

    /**
     * Esegue una fn dopo un certo intervallo di tempo
     * @param sec 
     * @param callback 
     * @param repeat 
     */
    after(sec: number, callback: () => any, repeat?: number) {
        this.timers.push({ duration: sec, callback, cacheDuration: sec, repeat })
    }

    setGameSpeed(speed: number) {
        this.app.ticker.speed = speed;  // velocità in termini di pixel 30, 60 fps ...
        this.gameSpeed = speed;
    }

    getElapsedTime(): number {
        return this.elapsed;
    }

    getDeltaTime(): number {
        return this.dt * this.gameSpeed;
    }

    getFrame(): number {
        return this._frame;
    }

    getGameSpeed(): number {
        return this.gameSpeed;
    }


    aminateGameSpeed(amount: number) {
        gsap.to(this, {  // this è bunny
            gameSpeed: amount,
            duration: 1,
            easing: 'easeInOut',
            onComplete: () => {
                // Questa funzione verrà chiamata al termine dell'animazione
                console.log('aminate GameSpeed completed!', this);
            },
        });
    }

    /**
     * Esegue la fn al frame indicato
     * @param frameNumber 
     * @param fn 
     */
    runOnFrameNum(frameNumber: number, fn: (frameNumber: number, ...arg) => any) {
        if (frameNumber === this._frame) {
            fn(frameNumber, ...arguments)
        }
    }

}