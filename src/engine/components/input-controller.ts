import { Body } from 'matter-js';
import { Component } from './Component';
import { GameObject } from '../GameObject';
import { ComponentNames } from '../models/component-names.enum';
import { RigidBodyComponent } from './rigidBody';

export class InputController extends Component {

    dependencies: string[] = [ComponentNames.RigidBody];

    // px/sec
    private speed: number;
    // velocity
    private dx: number = 0;
    private dy: number = 0;

    constructor(gameObject: GameObject, speed: number) {
        super(gameObject, ComponentNames.InputController);
        this.speed = speed;
    }

    update(dt: number) {
        this.dx = 0;
        this.dy = 0;
        if (this.entity && this.entity?.hasComponent(ComponentNames.RigidBody)) {
            // PLayer movement
            if (this.entity.engine.keyboard.isKeyDown('UP')) {
                this.dy -= this.speed * dt;
            }
            if (this.entity.engine.keyboard.isKeyDown('DOWN')) {
                this.dy += this.speed * dt;
            }
            if (this.entity.engine.keyboard.isKeyDown('RIGHT')) {
                this.dx += this.speed * dt;
            }
            if (this.entity.engine.keyboard.isKeyDown('LEFT')) {
                this.dx -= this.speed * dt;
            }

            // set velocity
            Body.setVelocity(this.entity.getComponents<RigidBodyComponent>(ComponentNames.RigidBody)[0].rigidBody, { x: this.dx, y: this.dy })
        }

    }
}