import { Application } from "pixi.js";
import { MyEngine2D } from "./Engine";
import { KeyMapping } from "./models/key-mapping";

export class InputKeyboardManager {

    app: Application;
    private keys: KeyMapping = {};
    private previousFrameKeys: KeyMapping = {};
    private currentFrameKeys: KeyMapping = {};

    private ctrlKey = false;
    private shiftKey = false;

    constructor(private keyMapping: { [key: string]: string }, app: Application) {
        this.app = app;

        this.app.ticker.add(this.updateKeyListener.bind(this));

        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        document.addEventListener('keypress', this.handleKeyDown.bind(this));
        document.addEventListener('keyup', this.handleKeyUp.bind(this));
    }

    handleKeyDown(e: KeyboardEvent) {
        this.keys[e.key] = true;
        if (e.code === 'ControlLeft' || e.code === 'ControlRight') {
            this.ctrlKey = true;
        } else if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
            this.shiftKey = true;
        }
        // MyEngine2D.scenes.currentScene?.onInputChange(this.keys);
    }

    handleKeyUp(e: KeyboardEvent) {
        this.keys[e.key] = false;
        if (e.code === 'ControlLeft' || e.code === 'ControlRight') {
            this.ctrlKey = false;
        } else if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
            this.shiftKey = false;
        }
    }

    updateKeyListener() {
        this.previousFrameKeys = this.currentFrameKeys;
        this.currentFrameKeys = Object.assign({}, this.keys);
    }

    private previouslyDown(keyName: string) {
        return this.keyMapping[keyName] in this.previousFrameKeys && this.previousFrameKeys[this.keyMapping[keyName]];
    }

    /**
       * Check if a key has been pressed in the current frame (and was not pressed on the previous frame)
     * @param keyName the mapped key
     * @returns boolean
     */
    iskeyDownOnce(keyName: string) {
        return !this.previouslyDown(keyName) && this.isKeyDown(keyName);
    }

    /**
     * Check CONTINUOSLY if a key has been pressed
     * @param keyName the mapped key
     * @returns boolean
     */
    isKeyDown(keyName: string) {
        return this.keys[this.keyMapping[keyName]];
    }

    isShiftDown() {
        return this.shiftKey;
    }

    isCtrlDown() {
        return this.ctrlKey;
    }

    /**
     * Define the association between the action name and the relative key
     * TODO: implement UI to make the user choose the keyMapping
     * @param keyName Set 
     * @param keyCode 
     */
    setKeyMapping(keyName: string, keyCode: string) {
        this.keyMapping[keyName] = keyCode;
    }
}
