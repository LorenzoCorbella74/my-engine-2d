import { Component } from './Component';
import { GameObject } from '../GameObject';
import { ComponentNames } from '../models/component-names.enum';
import { Action } from '../actions/model';


export class BehaviourComponent extends Component {

    constructor(
        gameObject: GameObject,
        public rootAction: Action
    ) {
        super(gameObject, ComponentNames.Behaviour);
    }

    update(delta: number): void {
        this.rootAction.update(delta);
    }
}