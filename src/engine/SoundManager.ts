import { Sound } from "@pixi/sound";  // https://pixijs.io/sound/examples/index.html
import gsap from "gsap";

export class SoundManager {

    private sounds = new Map<string, Sound>()
    private globalVolume: number;

    constructor(globalVolume: number = 1) {
        this.globalVolume = globalVolume;
    }

    setVolume(volume: number) {
        this.globalVolume = volume;
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
            this.sounds.get(name)!.play({ volume: this.globalVolume });
        }
    }

    stopSound(name: string) {
        if (this.sounds.has(name)) {
            this.sounds.get(name)!.stop();
        }
    }

    fadeInSound(name: string, duration: number = 1) {
        if (this.sounds.has(name)) {
            const sound = this.sounds.get(name)!
            sound.play({ volume: 0 });
            gsap.to(sound, { volume: this.globalVolume, duration });
        }
    }

    fadeOutSound(name: string, volume: number = 0, duration: number = 1) {
        if (this.sounds.has(name)) {
            // this.sounds.get(name).fade(volume, duration);
            gsap.to(this.sounds.get(name)!, { volume, duration });
        }
    }

    toggleSound(name: string) {
        if (this.sounds.has(name)) {
            let sound = this.sounds.get(name);
            if (sound!.isPlaying) {
                sound!.stop();
            } else {
                sound!.play();
            }
        }
    }

    setSoundVolume(name: string, volume: number) {
        if (this.sounds.has(name)) {
            this.sounds.get(name)!.volume = volume;
        }
    }

    isPlaying(name: string): boolean {
        if (this.sounds.has(name)) {
            return this.sounds.get(name)!.isPlaying;
        }
        return false;
    }

    playRandomSound(keys: string[]) {
        let soundIndex = Math.ceil(Math.random() * keys.length)
        this.playSound(keys[soundIndex]);
    }
}