import { GameObject } from './GameObject';
import { EngineError } from './EngineError';

export class Component {

    public entity: GameObject | null = null;
    public dependencies: string[] = []; // nomi dei componenti obbligatori
    public enabled: boolean = true;

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

    update(delta: number) {

    }
}