import { GameObject } from '../GameObject';
import { EngineError } from '../EngineError';
import { MyEngine2D } from '../Engine';

export class Component {

    entity!: GameObject;
    dependencies: string[] = [];         // mandatory components
    enabled: boolean = true;             // enabled by default
    engine: typeof MyEngine2D;

    constructor(gameObject: GameObject, public name: string) {
        this.entity = gameObject;
        this.engine = MyEngine2D
    }

    checkRequiredComponents() {
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