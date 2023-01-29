import { Assets } from 'pixi.js';
import { sound, SoundLibrary } from '@pixi/sound';
import { SoundManager } from './SoundManager';

export class LoaderHelper {
    loader: any;
    resources: {};
    sound: SoundLibrary;
    soundsManager: SoundManager;

    constructor(loader, soundsManager: SoundManager) {
        this.loader = loader;
        this.resources = {};
        this.sound = sound;
        this.soundsManager = soundsManager;
    }

    /**
    * Precarica gli asset grafici (jpg, png) i suoni ed i file .json di configurazione
    */
    async preload() {
        let assets:string[] = []
        let jsonData = {}
        for (const asset of this.loader) {
            let key = asset.key.substr(asset.key.lastIndexOf('/') + 1);
            key = key.substring(0, key.indexOf('.'));
            if (asset.key.indexOf(".png") !== -1 || asset.key.indexOf(".jpg") !== -1) {
                assets.push(key)
                Assets.add(key, asset.data?.default)
            }
            if (asset.key.indexOf(".mp3") !== -1) {
                this.soundsManager.addSound(key, this.sound.add(key, asset.data?.default))
            }
            if (asset.key.indexOf(".json") !== -1) {
                jsonData[key] = asset.data
            }
        }
        // Load IMGs, Sounds
        this.resources = await Assets.load(assets);
        // merge json data
        this.resources = { ...this.resources, ...jsonData };
        return 'done';
    }
}

/*
    Per prevenire il problema dell'audio senza interazione:
    "The AudioContext was not allowed to start. It must be resumed (or created) after a user gesture on the page."
    
    https://stackoverflow.com/questions/58683611/the-audiocontext-was-not-allowed-to-start-it-must-be-resumed-or-created-after 
*/