import { sound } from '@pixi/sound';

export class SoundManager {
     
    sounds = new Map()

    constructor() {
    }

    addSound(name, soundObj) {
        this.sounds.set(name, soundObj);
    }

    playSound(name) {
        if (this.sounds.has(name)) {
            this.sounds.get(name).play();
        }
        // console.log(this.sounds);
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

    randomSound(keys:string[]){
        // TODO
    }
}