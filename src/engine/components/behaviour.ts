import { Component } from './Component';
import { GameObject } from '../GameObject';
import { DefaultComponentNames } from '../models/component-names.enum';
import { Action } from '../actions/model';

/**
 * Provide a base class for basic AI behaviours.
 */
export class BehaviourComponent extends Component {

    constructor(
        gameObject: GameObject,
        public rootAction: Action
    ) {
        super(gameObject, DefaultComponentNames.Behaviour);
    }

    update(delta: number): void {
        this.rootAction.update(delta);
    }
}