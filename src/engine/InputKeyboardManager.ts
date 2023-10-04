import { Application } from "pixi.js";
import { PixiEngine as $PE } from "./Engine";
import { KeyMapping } from "./models/key-mapping";

export class InputKeyboardManager {

    app: Application;
    private keys: KeyMapping = {};
    private ctrlKey = false;
    private shiftKey = false;

    constructor(private keyMapping: { [key: string]: string }, app: Application) {
        this.app = app;

        document.addEventListener('keydown', e => {
            this.keys[e.key] = true;
            if (e.code === 'ControlLeft' || e.code === 'ControlRight') {
                this.ctrlKey = true;
            } else if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
                this.shiftKey = true;
            }
            $PE.scenes.currentScene.onInputChange(this.keys);
        });

        document.addEventListener('keyup', e => {
            this.keys[e.key] = false;
            if (e.code === 'ControlLeft' || e.code === 'ControlRight') {
                this.ctrlKey = false;
            } else if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
                this.shiftKey = false;
            }
        });
    }

    isKeyDown(keyName: string) {
        return this.keys[this.keyMapping[keyName]] === true;
    }

    isKeyDownWithShift(keyName: string) {
        return this.keys[this.keyMapping[keyName]] === true && this.shiftKey;
    }

    isKeyDownWithCtrl(keyName: string) {
        return this.keys[this.keyMapping[keyName]] === true && this.ctrlKey;
    }

    /**
     * Define the association between the action name and the relative key
     * TODO: implement UI to set the keyMapping
     * @param keyName Set 
     * @param keyCode 
     */
    setKeyMapping(keyName: string, keyCode: string) {
        this.keyMapping[keyName] = keyCode;
    }
}
