import { Application } from "pixi.js";
import { Timer, FunctionToBeCalledContinuously } from "./models/timers";
import { MyEngine2D } from "./Engine";

/*
    TAKEN from https://hump.readthedocs.io/en/latest/timer.html
*/

export class TimeManager {
    private elapsed: number;        // il trempo totale [in secondi]
    private dt: number;             // il dt, this.app.ticker.deltaMS [in secondi]
    private _frame: number;         // il frame corrente

    private gameSpeed = 1;

    private timers: Timer[] = []                                // timers
    private functions: FunctionToBeCalledContinuously[] = []    // Function To Be Called Continuously
    app: Application;

    constructor(public engine: typeof MyEngine2D) {
        this.app = engine.app;
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
            timer.delay -= this.getDeltaTime();
            if (timer.delay < 0 && timer.repeat) {
                timer.repeat--;
                timer.delay = timer.cacheDelay;
                timer.callback(timer.repeat ? timer.repeat : null);
            } else if (timer.delay < 0) {
                if (!timer.repeat || timer.repeat !== 0) {
                    timer.callback(null);
                }
                this.timers.splice(i, 1);
            }
        }
        // Function To Be Called Continuously
        for (var i = this.functions.length - 1; i >= 0; i--) {
            let fn = this.functions[i];
            fn.duration -= this.getDeltaTime();
            if (fn.duration < 0) {
                fn.callBackEnd && fn.callBackEnd();
                this.functions.splice(i, 1);
            } else {
                fn.callback(this.dt);
            }
        }
    }

    /**
     * Run a fn after a certain delay
     * @param sec 
     * @param callback 
     * @param repeat 
     */
    after(delay: number, callback: () => any) {
        let newTimer = { delay, callback, cacheDelay: delay }
        this.timers.push(newTimer)
        return newTimer;
    }

    /**
     * Get the time passed and the remaining time (for Countdown with after())
     * @param timer 
     * @returns 
     */
    getCountDown(timer: Timer) {
        return { passed: timer.cacheDelay - timer.delay, remaining: timer.delay }
    }

    /**
     * Add a function that will be called count times every delay seconds
     * @param sec 
     * @param callback 
     * @param repeat 
     */
    every(delay: number, callback: (remaining: any) => void, repeat: number = Infinity) {
        let newTimer = { delay, callback, cacheDelay: delay, repeat }
        this.timers.push(newTimer)
        return newTimer
    }

    /**
     * Execute a function that can be paused without causing the rest of the program to be suspended
     * @param fn 
     * @returns 
     */
    script(fn: (wait: any) => any) {
        return this.timers.push({ delay: -1, callback: () => fn(this.wait), cacheDelay: 0 })
    }

    /**
     * Run func(dt) for the next delay seconds. The function is called every time 
     * update(dt) is called. Optionally run after() once delay seconds have passed
     * @param duration 
     * @param callback 
     * @param callBackEnd 
     * @returns 
     */
    during(duration: number, callback: () => any, callBackEnd: () => any) {
        return this.functions.push({ duration, callback, callBackEnd })
    }

    /**
     * Prevent a timer from being executed in the future.
     * @param timer 
     */
    cancel(istance: Timer | FunctionToBeCalledContinuously) {
        if ('delay' in istance) {
            this.timers.splice(this.timers.indexOf(istance), 1);
        }
        if ('duration' in istance) {
            this.timers.splice(this.functions.indexOf(istance), 1);
        }
    }

    /**
     * Remove all timed and periodic functions. 
     * Functions that have not yet been executed will be discarded
     */
    clear() {
        this.timers = [];
        this.functions = [];
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

    getCurrentFrame(): number {
        return this._frame;
    }

    getGameSpeed(): number {
        return this.gameSpeed;
    }

    private wait(delayInSec: number) {
        return new Promise(resolve => setTimeout(resolve, delayInSec * 1000));
    }

    aminateGameSpeed(amount: number, duration: number = 1, ease: string = "easeInOut", completeCallback: () => void = () => { }) {
        this.engine.animation.aminateOneObjectProperty(this, 'gameSpeed', amount, duration, ease, completeCallback);
    }

    /**
     * Run the function for the passed frames
     * @param frameNumber 
     * @param fn 
     */
    runOnFrameNum(frameNumbers: number[], fn: (frameNumber: number, ...arg: any) => any) {
        frameNumbers.forEach(frame => {
            if (frame === this._frame) {
                fn(frame, ...arguments)
            }
        });
    }

}