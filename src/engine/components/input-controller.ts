import { Body } from 'matter-js';
import { Component } from '../Component';
import { GameObject } from '../GameObject';
import { ComponentNames } from '../models/component-names.enum';
import { RigidBodyComponent } from './rigidBody';

export class InputController extends Component {

    dependencies: string[] = [ComponentNames.RigidBody];

    private speed: number; // px/sec

    // velocity
    dx: number = 0;
    dy: number = 0;

    constructor(gameObject: GameObject, speed: number) {
        super(gameObject, ComponentNames.InputController);
        this.speed = speed;
    }

    update(dt: number) {
        this.dx = 0;
        this.dy = 0;
        if (this.entity && this.entity?.hasComponent(ComponentNames.RigidBody)) {
            // PLayer movement
            if (this.entity.engine.input.isKeyDown('UP')) {
                this.dy -= this.speed * dt;
            }
            if (this.entity.engine.input.isKeyDown('DOWN')) {
                this.dy += this.speed * dt;
            }
            if (this.entity.engine.input.isKeyDown('RIGHT')) {
                this.dx += this.speed * dt;
            }
            if (this.entity.engine.input.isKeyDown('LEFT')) {
                this.dx -= this.speed * dt;
            }

            // set velocity
            Body.setVelocity(this.entity.getComponents<RigidBodyComponent>(ComponentNames.RigidBody)[0].rigidBody, { x: this.dx, y: this.dy })
        }

    }
}