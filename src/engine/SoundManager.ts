import { Sound } from "@pixi/sound";

export class SoundManager {

    private sounds = new Map()

    constructor() {
    }

    /**
     * Add a sound 
     * @param name name of the asset file
     * @param soundObj  sound coming from AssetManager
     */
    addSound(name: string, soundObj: Sound) {
        this.sounds.set(name, soundObj);
    }

    playSound(name: string) {
        if (this.sounds.has(name)) {
            this.sounds.get(name).play();
        }
    }

    stopSound(name: string) {
        if (this.sounds.has(name)) {
            this.sounds.get(name).stop();
        }
    }

    toggleSound(name: string) {
        if (this.sounds.has(name)) {
            let sound = this.sounds.get(name);
            if (sound.isPlaying) {
                sound.stop();
            } else {
                sound.play();
            }
        }
    }

    setVolume(name: string, volume: number) {
        if (this.sounds.has(name)) {
            this.sounds.get(name).volume = volume;
        }
    }

    isPlaying(name: string): boolean {
        if (this.sounds.has(name)) {
            return this.sounds.get(name).isPlaying;
        }
        return false;
    }

    playRandomSound(keys: string[]) {
        let soundIndex = Math.ceil(Math.random() * keys.length)
        this.playSound(keys[soundIndex]);
    }
}