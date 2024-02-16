import { Sound } from "@pixi/sound";  // https://pixijs.io/sound/examples/index.html
import gsap from "gsap";

/**
 * Manages the sounds in the game.
 */
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

    /**
     * Plays a sound with the given name.
     * @param name - The name of the sound to play.
     * @param volume - The volume of the sound (optional).
     * @param loop - Indicates whether the sound should loop (default: false).
     * @returns The sound object that is being played.
     */
    playSound(name: string, volume?: number, loop: boolean = false) {
        if (this.sounds.has(name)) {
            const sound = this.sounds.get(name)!;
            sound.play({ volume: this.globalVolume || volume, loop });
            return sound;
        }
    }

    /**
     * Stops the sound with the specified name.
     * 
     * @param name - The name of the sound to stop.
     * @returns The stopped sound, or undefined if the sound does not exist.
     */
    stopSound(name: string) {
        if (this.sounds.has(name)) {
            const sound = this.sounds.get(name)!;
            sound.stop();
            return sound;
        }
    }

    /**
     * Fades in a sound with the specified name.
     * @param name - The name of the sound to fade in.
     * @param duration - The duration of the fade-in effect in seconds. Default is 1 second.
     */
    fadeInSound(name: string, duration: number = 1) {
        if (this.sounds.has(name)) {
            const sound = this.sounds.get(name)!
            sound.play({ volume: 0 });
            gsap.to(sound, { volume: this.globalVolume, duration });
        }
    }

    /**
     * Fades out a sound by adjusting its volume over a specified duration.
     * @param name - The name of the sound to fade out.
     * @param volume - The target volume to fade to (default: 0).
     * @param duration - The duration of the fade in seconds (default: 1).
     */
    fadeOutSound(name: string, volume: number = 0, duration: number = 1) {
        if (this.sounds.has(name)) {
            // this.sounds.get(name).fade(volume, duration);
            gsap.to(this.sounds.get(name)!, { volume, duration });
        }
    }

    /**
     * Toggles the sound with the specified name.
     * If the sound is currently playing, it will be stopped.
     * If the sound is currently stopped, it will be played.
     * @param name - The name of the sound to toggle.
     */
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

    /**
     * Sets the volume of a sound.
     * @param name - The name of the sound.
     * @param volume - The volume level to set.
     */
    setSoundVolume(name: string, volume: number) {
        if (this.sounds.has(name)) {
            this.sounds.get(name)!.volume = volume;
        }
    }

    /**
     * Checks if a sound with the specified name is currently playing.
     * 
     * @param name - The name of the sound.
     * @returns True if the sound is playing, false otherwise.
     */
    isPlaying(name: string): boolean {
        if (this.sounds.has(name)) {
            return this.sounds.get(name)!.isPlaying;
        }
        return false;
    }

    /**
     * Plays a random sound from the given array of sound keys.
     * 
     * @param keys - An array of sound keys.
     */
    playRandomSound(keys: string[]) {
        let soundIndex = Math.ceil(Math.random() * keys.length)
        this.playSound(keys[soundIndex]);
    }
}