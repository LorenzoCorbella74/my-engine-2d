import { Component } from './Component';
import { GameObject } from '../GameObject';
import { ComponentNames } from '../models/component-names.enum';

export class HealthComponent extends Component {

    public health: number;

    constructor(gameObject: GameObject, health: number) {
        super(gameObject, ComponentNames.Health);
        this.health = health;
    }

    get alive() {
        return this.health > 0;
    }

    updateHealth(amount: number, mode: 'add' | 'subtract' = 'subtract') {
        this.health -= mode === 'subtract' ? amount : -amount;
        if (this.health <= 0) {
            // TODO: EVENT ?
        }
    }
}