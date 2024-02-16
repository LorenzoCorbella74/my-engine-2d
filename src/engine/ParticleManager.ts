import { Application } from 'pixi.js';
import * as particles from '@pixi/particle-emitter'; // https://github.com/pixijs/particle-emitter

/**
 * Manages the creation, removal, activation, deactivation, and updating of particle emitters.
 */
export class ParticleManager {
    private app: Application;
    private emitters: particles.Emitter[] = [];

    constructor(app: Application) {
        this.app = app;
    }

    /**
     * Adds a new emitter to the particle manager.
     * @param config The configuration object for the emitter.
     * @returns The newly created emitter.
     */
    addEmitter(config: particles.EmitterConfigV3): particles.Emitter {
        const emitter = new particles.Emitter(this.app.stage, config);
        this.emitters.push(emitter);
        return emitter;
    }

    /**
     * Removes an emitter from the ParticleManager.
     * @param emitter - The emitter to be removed.
     */
    removeEmitter(emitter: particles.Emitter) {
        const index = this.emitters.indexOf(emitter);
        if (index !== -1) {
            this.emitters.splice(index, 1);
            emitter.destroy();
        }
    }

    /**
     * Activates the specified emitter by enabling emission of particles.
     * @param emitter The emitter to activate.
     */
    activate(emitter: particles.Emitter) {
        emitter.emit = true;
    }

    /**
     * Deactivates the specified emitter by setting its emit property to false.
     * @param emitter The emitter to deactivate.
     */
    deactivate(emitter: particles.Emitter) {
        emitter.emit = false;
    }

    update(delta: number) {
        for (const emitter of this.emitters) {
            emitter.update(delta);
        }
    }

    /**
     * Updates the configuration of a particle emitter.
     * @param emitter The particle emitter to update.
     * @param newConfig The new configuration to apply to the emitter.
     */
    updateEmitterConfig(emitter: particles.Emitter, newConfig: particles.EmitterConfigV3) {
        // TODO: how to update the configuration?? 
        // Object.assign(emitter.u, newConfig);
    }
}
