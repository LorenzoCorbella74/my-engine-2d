import { Application, Text } from 'pixi.js';

/**
 * Represents a debug UI manager that displays log messages on the screen.
 */
export class Debug2UIManager {
    private debugText: Text;
    private messageQueue: string[] = [];
    private displayDuration: number;
    private displayTimer: number | undefined;

    constructor(app: Application, displayDuration: number = 750) {
        this.displayDuration = displayDuration;

        this.debugText = new Text('', {
            fontSize: 14,
            fill: 0xffffff,
        });
        this.debugText.position.set(150, 32);
        app.stage.addChild(this.debugText);
    }

    /**
     * Sets the position of the debug text.
     * 
     * @param x - The x-coordinate of the position.
     * @param y - The y-coordinate of the position.
     * @returns The Debug2UIManager instance.
     */
    setPosition(x: number, y: number) {
        this.debugText.position.set(x, y);
        return this;
    }

    /**
     * Sets the display duration for the Debug2UIManager.
     * 
     * @param duration The duration in milliseconds.
     * @returns The Debug2UIManager instance.
     */
    setDisplayDuration(duration: number) {
        this.displayDuration = duration;
        return this;
    }

    /**
     * Logs a message to the screen.
     * @param message - The message to be logged.
     */
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