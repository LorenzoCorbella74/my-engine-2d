import { Application } from "pixi.js";

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

    private timers: Timer[] = []     // timers

    constructor(public app: Application) {
        this.elapsed = 0;
        this._frame = 0;
        this.dt = this.app.ticker.elapsedMS / 1000;
    }

    update(deltaTime: number) {
        this.elapsed += this.app.ticker.elapsedMS / 1000;
        this._frame++;
        if (this._frame > this.app.ticker.maxFPS) {
            this._frame = 1;
        }
        // console.log(this.dt, this.getElapsedTime(), this._frame, this.app.ticker.FPS);

        // timers
        for (var i = this.timers.length - 1; i >= 0; i--) {
            let timer = this.timers[i];
            timer.duration -= this.getDeltaTime();
            if (timer.duration < 0 && timer.repeat) {
                timer.repeat--;
                timer.duration = timer.cacheDuration;
                timer.callback();
            } else if (timer.duration < 0) {
                if(timer.repeat!==0){
                    timer.callback();
                }
                this.timers.splice(i, 1);
            }
        }

    }

    after(sec: number, callback: () => any, repeat?: number) {
        this.timers.push({ duration: sec, callback, cacheDuration: sec, repeat })
    }

    setGameSpeed(speed: number) {
        this.app.ticker.speed = speed;
    }

    getElapsedTime(): number {
        return this.elapsed;
    }

    getDeltaTime(): number {
        return this.dt;
    }

    getFrame(): number {
        return this._frame;
    }

    /**
     * Esegue la fn al frame indicato
     * @param frameNumber 
     * @param fn 
     */
    runOnFrameNum(frameNumber: number, fn: () => any) {
        if (frameNumber === this._frame) {
            fn()
        }
    }

}