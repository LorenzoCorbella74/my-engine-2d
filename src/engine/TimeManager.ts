import { Application } from "pixi.js";

export class TimeManager {
    private _elapsedTime: number;
    private _deltaTime: number;
    private _frame: number;

    constructor(public app: Application) {
        this._elapsedTime = 0;
        this._deltaTime = 0;
        this._frame = 0;
    }

    update(deltaTime: number) {
        this._deltaTime = deltaTime;
        this._elapsedTime += deltaTime;
        this._frame++;
        if(this._frame>this.app.ticker.FPS){
            this._frame=0;
        }
        console.log(/* this._deltaTime, this._elapsedTime, */ this._frame, /* this.app.ticker.FPS */);
    }

    setGameSpeed(speed: number) {
        this.app.ticker.speed=speed;
    }

    getElapsedTime(): number {
        return this._elapsedTime;
    }

    getDeltaTime(): number {
        return this._deltaTime;
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