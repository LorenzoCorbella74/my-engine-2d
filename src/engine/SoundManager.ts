import { sound } from '@pixi/sound';

export class SoundManager {
     
    sounds = new Map()  // sounds are loaded via the LoaderHelper

    constructor() {
    }

    addSound(name, soundObj) {
        this.sounds.set(name, soundObj);
    }

    playSound(name) {
        if (this.sounds.has(name)) {
            this.sounds.get(name).play();
        }
    }

    stopSound(name) {
        if (this.sounds.has(name)) {
            this.sounds.get(name).stop();
        }
    }

    toggleSound(name) {
        if (this.sounds.has(name)) {
            let sound = this.sounds.get(name);
            if (sound.isPlaying) {
                sound.stop();
            } else {
                sound.play();
            }
        }
    }

    setVolume(name, volume) {
        if (this.sounds.has(name)) {
            this.sounds.get(name).volume = volume;
        }
    }

    isPlaying(name) {
        if (this.sounds.has(name)) {
            return this.sounds.get(name).isPlaying;
        }
        return false;
    }

    playRandomSound(keys:string[]){
        let soundName = Math.ceil(Math.random()* keys.length)
        this.playSound(soundName);
    }
}