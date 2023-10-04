import { GameObject } from '../GameObject';
import { EngineError } from '../EngineError';

export class Component {

    public entity!: GameObject;
    public dependencies: string[] = [];         // mandatory components
    public enabled: boolean = true;             // enabled by default

    constructor(gameObject: GameObject, public name: string) {
        this.entity = gameObject;
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

    update(delta: number) { }
}