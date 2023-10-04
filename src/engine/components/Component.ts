import { GameObject } from '../GameObject';
import { EngineError } from '../EngineError';
import { PixiEngine } from '../Engine';

export class Component {

    public entity!: GameObject;
    public dependencies: string[] = [];         // mandatory components
    public enabled: boolean = true;             // enabled by default
    engine: typeof PixiEngine;

    constructor(gameObject: GameObject, public name: string) {
        this.entity = gameObject;
        this.engine = PixiEngine
        if (!this.entity.hasRequiredComponents(this.dependencies)) {
            throw new EngineError(`Required components not implemented for ${name} in ${this.entity.name} gameObject.`);
        }
    }

    /**
     * Enable /Disable the component.
     * @param enabled 
     */
    setEnabled(enabled: boolean) {
        this.enabled = enabled;
    }

    /**
     * Update function to update the component functionality
     * @param delta 
     */
    update(delta: number) { }
}