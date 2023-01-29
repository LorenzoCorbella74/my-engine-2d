import { Application } from "pixi.js";

export class TimeManager {
    private elapsed: number = 0;
    private dt: number;
    private _frame: number;

    constructor(public app: Application) {
        this.elapsed += this.app.ticker.elapsedMS; // il dt, this.app.ticker.deltaMS
        this.dt = this.app.ticker.elapsedMS; // il dt, this.app.ticker.deltaMS
        this._frame = 0;
    }

    update(deltaTime: number) {
        this._frame++;
        if (this._frame > this.app.ticker.maxFPS) {
            this._frame = 0;
        }
        console.log(this.dt, this.getElapsedTime(), this._frame, this.app.ticker.FPS);
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

    runOnFrameNum(number: number, fn: () => any) {
        if (number === this._frame) {
            fn()
        }
    }

}