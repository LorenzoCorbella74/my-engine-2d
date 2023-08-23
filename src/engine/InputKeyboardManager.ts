import { Application } from "pixi.js";
import { Scene } from "./Scene";

export class InputKeyboardManager {
    private keys: { [key: string]: boolean } = {};
    private wasPressed: { [key: string]: boolean } = {};
    // private keyMapping: { [key: string]: string };

    private ctrlKey = false;
    private shiftKey = false;
    app: Application;

    currentScene: Scene;

    constructor(private keyMapping: { [key: string]: string }, app: Application) {
        this.app = app;

        document.addEventListener('keydown', e => {
            this.keys[e.key] = true;
            if (this.keys[e.key] && !this.wasPressed[e.key]) {
                this.wasPressed[e.key] = true;
            }
            if (e.code === 'ControlLeft' || e.code === 'ControlRight') {
                this.ctrlKey = true;
            } else if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
                this.shiftKey = true;
            }
            this.currentScene.onInputChange(this.keys);
        });

        document.addEventListener('keyup', e => {
            this.keys[e.key] = false;
            this.wasPressed[e.key] = false;
            if (e.code === 'ControlLeft' || e.code === 'ControlRight') {
                this.ctrlKey = false;
            } else if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
                this.shiftKey = false;
            }
        });
    }

    registerScene(scene: Scene) {
        this.currentScene = scene;
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
    isKeyDownForOneShot(keyName: string) {
        if (this.keys[this.keyMapping[keyName]] === true && this.wasPressed[this.keyMapping[keyName]]) {
            this.wasPressed[this.keyMapping[keyName]] = false
            return true
        } else {
            return false
        }
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