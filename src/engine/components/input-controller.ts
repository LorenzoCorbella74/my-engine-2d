import { Body } from 'matter-js';
import { Component } from './Component';
import { GameObject } from '../GameObject';
import { DefaultComponentNames } from '../models/component-names.enum';
import { RigidBodyComponent } from './rigidBody';

export class InputControllerComponent extends Component {

    dependencies: string[] = [DefaultComponentNames.RigidBody];

    // px/sec
    private speed: number;
    // velocity
    private dx: number = 0;
    private dy: number = 0;

    constructor(gameObject: GameObject, speed: number) {
        super(gameObject, DefaultComponentNames.InputController);
        this.speed = speed;
    }

    update(dt: number) {
        this.dx = 0;
        this.dy = 0;
        if (this.entity && this.entity?.hasComponent(DefaultComponentNames.RigidBody)) {
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
            const rb = this.entity.getComponent<RigidBodyComponent>(DefaultComponentNames.RigidBody)?.rigidBody
            if (rb) {
                // set velocity
                Body.setVelocity(rb, { x: this.dx, y: this.dy })
            }
        }
    }
}