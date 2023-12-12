import { GameObject } from "../GameObject";

export class Action {
    private _finished: boolean = false;

    constructor(public entity: GameObject) { }

    get finished() {
        return this._finished;
    }

    set finished(value: boolean) {
        this._finished = value;
    }
    update(dt: number) { }
}

export class CompositeAction extends Action {

    actions: Action[] = [];

    get finished() {
        return this.actions.length === 0;
    }

    add(action: Action) {
        this.actions.push(action);
    }
}

export class Parallel extends CompositeAction {
    update(dt: number) {
        this.actions.forEach(a => a.update(dt));
        this.actions = this.actions.filter(a => a.finished);
    }
}

export class Sequence extends CompositeAction {
    update(dt: number) {
        if (this.actions.length > 0) {
            this.actions[0].update(dt);
            if (this.actions[0].finished) {
                this.actions.shift();
            }
        }
    }
}