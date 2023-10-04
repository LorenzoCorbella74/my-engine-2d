import { Component } from '../Component';
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

    decreaseHealth(amount: number) {
        this.health -= amount;
        if (this.health <= 0) {
            // TODO:
        }
    }
}