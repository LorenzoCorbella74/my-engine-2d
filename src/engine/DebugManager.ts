import { Application, Text } from 'pixi.js';

export class Debug2UIManager {
    private debugText: Text;
    private messageQueue: string[] = [];
    private displayDuration: number;
    private displayTimer: number | undefined;

    constructor(app: Application, displayDuration: number = 750) {
        this.displayDuration = displayDuration;

        this.debugText = new Text('', {
            fontSize: 16,
            fill: 0xffffff,
        });
        this.debugText.position.set(150, 32);
        app.stage.addChild(this.debugText);
    }

    log2Screen(message: string) {
        this.messageQueue.push(message);

        if (!this.displayTimer) {
            this.getMsg();
        }
    }

    private getMsg() {
        if (this.messageQueue.length > 0) {
            const nextMessage = this.messageQueue.shift();
            this.debugText.text = nextMessage as string;
            this.displayTimer = setTimeout(() => {
                this.debugText.text = '';
                this.displayTimer = undefined;
                this.getMsg();
            }, this.displayDuration);
        }
    }
}