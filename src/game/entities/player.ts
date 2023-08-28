import { Body } from 'matter-js';

import { GameObject } from "../../engine/GameObject"
import { GameNode } from '../../engine/decorators';

@GameNode({ rigidBody: { shape: 'rectangle', isStatic: false } })
export class Player extends GameObject {

    private speed: number = 150; // px/sec

    // velocity
    dx: number = 0;
    dy: number = 0;

    rigidBody: Matter.Body

    constructor(name, spriteName) {
        super(name, spriteName);
    }

    update(dt) {
        this.dx = 0;
        this.dy = 0;
        // PLayer movement
        if (this.engine.input.isKeyDown('UP')) {
            this.dy -= this.speed * dt;
        }
        if (this.engine.input.isKeyDown('DOWN')) {
            this.dy += this.speed * dt;
        }
        if (this.engine.input.isKeyDown('RIGHT')) {
            this.dx += this.speed * dt;
        }
        if (this.engine.input.isKeyDown('LEFT')) {
            this.dx -= this.speed * dt;
        }

        // velocity
        Body.setVelocity(this.rigidBody, { x: this.dx, y: this.dy })
        // of translate
        // Body.translate(this.rigidBody, { x: this.dx, y: this.dy })

        this.sprite.x = this.rigidBody.position.x
        this.sprite.y = this.rigidBody.position.y
        // this.sprite.rotation = this.rigidBody.angle -> è in funzione del mouse!!!
    }
}