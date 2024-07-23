import { Component } from '../components/Component';
import { GameObject } from '../GameObject';

import { DefaultComponentNames } from '../models/component-names.enum';
import { Graphics } from 'pixi.js';
import { Sound } from '@pixi/sound';

export class PositionalSoundEmitterComponent extends Component {

    dependencies: string[] = [];

    minVolume = 0;
    maxVolume = 1.0;

    sound: Sound | undefined;

    soundContainer: Graphics = new Graphics();   // for debug

    constructor(
        gameObject: GameObject,
        public soundKey: string,
        public minDistance = 750,
        public maxDistance = 350
    ) {
        const randomSuffix = Math.floor(Math.random() * 1000000).toString();
        super(gameObject, DefaultComponentNames.PositionalSoundEmitter + randomSuffix);
        this.createSound(soundKey);
    }

    private createSound(soundKey: string) {
        this.soundContainer.visible = false; // default hidden
        if (soundKey) {
            this.sound = this.engine.sounds.playSound(soundKey, this.calculateVolume(this.minDistance));
            if (this.sound) {
                const { x, y } = this.entity;
                this.soundContainer.stroke({width:2.5, color:0xFF0000});
                this.soundContainer.rect(x - 0.5 * 32, y - 0.5 * 32, 32, 32);
                this.soundContainer.visible = false; // default hidden
            } else {
                this.engine.error('Sound not found');
            }
        } else {
            this.engine.error('Position and Sound key are required!');
        }
    }

    calculateVolume(distance: number) {
        if (distance <= this.minDistance) {
            return this.maxVolume;
        } else if (distance >= this.maxDistance) {
            return this.minVolume;
        } else {
            // Scala lineare tra minVolume e maxVolume in base alla distanza
            const normalizedDistance = 1 - (distance - this.minDistance) / (this.maxDistance - this.minDistance);
            return this.minVolume + normalizedDistance * (this.maxVolume - this.minVolume);
        }
    }

    /**
     * Update sound volume and if far from player stop it!
     * Show the PositionalSoundEmitter if in DEBUG MODE
     */
    update() {
        // Calcola la distanza tra il player e il GameObject "Suono"
        const player = this.engine.getEntityByName('player');
        const distance = this.engine.math.distance(player?.position, this.entity.position);

        // Calcola il volume in base alla distanza
        const frame = this.engine.time.getCurrentFrame();
        if (frame % 10 === 0) { // TODO: 
            const volume = this.calculateVolume(distance);
            if (volume) {
                if (!this.engine.sounds.isPlaying(this.soundKey)) {
                    this.engine.sounds.playSound(this.soundKey, volume);
                } else {
                    this.engine.sounds.setSoundVolume(this.soundKey, volume);
                }
            } else {
                // if 0 stop
                this.engine.sounds.stopSound(this.soundKey);
            }
        }
        this.soundContainer.visible = this.engine.debug;
    }
}