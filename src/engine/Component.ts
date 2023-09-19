import { GameObject } from './GameObject';

// componente generico.
export class Component {

    public entity: GameObject | null = null;
    public dependencies: string[] = []; // componenti obbligatori
    public enabled: boolean = true;

    constructor(gameObject: GameObject, public name: string) {
        this.entity = gameObject;
    }

    // Abilita o disabilita il componente.
    setEnabled(enabled: boolean) {
        this.enabled = enabled;
    }

    update(delta: number) {

    }
}