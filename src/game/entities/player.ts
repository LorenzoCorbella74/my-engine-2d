import { Body, Bodies, World } from 'matter-js';

import { GameObject } from "../../engine/GameObject"
import { GameObjectEntity } from '../../engine/decorators';

@GameObjectEntity
export class Player extends GameObject {

    private speed: number;

    // velocity
    dx: number = 0;
    dy: number = 0;

    rigidBody: Matter.Body

    constructor(name, spriteName) {
        super(name, spriteName);

        this.buildRigidBody();

        this.speed = 150; // px/sec
    }

    private buildRigidBody() {
        const playerOptions: Matter.IBodyDefinition = {
            /*  density: 100, 
            frictionAir: 0,*/
            friction: 0,
            /*  inverseInertia: 0,
             inertia: 0,
             frictionStatic: 0,
             restitution: 0, */
            label: this.name
        };
        const { x, y, width, height } = this.sprite
        this.rigidBody = Bodies.rectangle(x + width / 2, y + height / 2, width, height, playerOptions);
        World.add(this.engine.physics.physicsEngine.world, this.rigidBody);
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
        // this.sprite.rotation = this.rigidBody.angle
    }

    destroy(): void {
        this.sprite.destroy()
        World.remove(this.engine.physics.physicsEngine.world, this.rigidBody);
    }
}