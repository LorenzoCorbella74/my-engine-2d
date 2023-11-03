import { Application } from 'pixi.js';
import * as particles from '@pixi/particle-emitter'; // https://github.com/pixijs/particle-emitter

export class ParticleManager {
    private app: Application;
    private emitters: particles.Emitter[] = [];

    constructor(app: Application) {
        this.app = app;
    }

    // Aggiungi un nuovo emitter di particelle
    addEmitter(config: particles.EmitterConfigV3): particles.Emitter {
        const emitter = new particles.Emitter(this.app.stage, config);
        this.emitters.push(emitter);
        return emitter;
    }

    // Rimuovi un emitter di particelle
    removeEmitter(emitter: particles.Emitter) {
        const index = this.emitters.indexOf(emitter);
        if (index !== -1) {
            this.emitters.splice(index, 1);
            emitter.destroy();
        }
    }

    activate(emitter: particles.Emitter) {
        emitter.emit = true;
    }

    deactivate(emitter: particles.Emitter) {
        emitter.emit = false;
    }

    update(delta: number) {
        for (const emitter of this.emitters) {
            emitter.update(delta);
        }
    }

    // Metodo per aggiornare la configurazione di un singolo emitter
    updateEmitterConfig(emitter: particles.Emitter, newConfig: particles.EmitterConfigV3) {
        // TODO: how to update the configuration?? 
        // Object.assign(emitter.u, newConfig);
    }
}
