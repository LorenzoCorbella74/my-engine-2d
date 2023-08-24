import { PixiEngine as $PE } from "../../engine/Engine";
import * as Matter from 'matter-js';


import { GameObjectEntity, GameObject } from "../../engine/GameObject"

@GameObjectEntity
export class Player extends GameObject {

    private speed: number;

    dx: number = 0;
    dy: number = 0;

    rigidBody: Matter.Body

    constructor(name, spriteName) {
        // sprite
        super(name, spriteName);
        this.sprite.x = window.innerWidth / 2;
        this.sprite.y = window.innerHeight / 2 - 100;
        this.sprite.anchor.set(0.5);

        this.buildRigidBody();

        this.speed = 150; // px/sec
    }

    private buildRigidBody() {
        const playerOptions: Matter.IBodyDefinition = {
            /*  density: 100, */
            frictionAir: 0,
            friction: 0,
            inverseInertia: 0,
            inertia: 0,
            frictionStatic: 0,
            restitution: 0,
            label: "Player"
            /* frictionStatic: 0,
            restitution: 0.5,
            inertia: Infinity,
            label: "Player" */
        };
        const { x, y, width, height } = this.sprite
        this.rigidBody = Matter.Bodies.rectangle(x + width / 2, y + height / 2, width, height, playerOptions);
        Matter.Composite.add($PE.physics.physicsEngine.world, this.rigidBody);
    }

    update(dt) {
        this.dx = 0;
        this.dy = 0;
        // PLayer movement
        if ($PE.input.isKeyDown('UP')) {
            this.dy -= this.speed * dt;
        }
        if ($PE.input.isKeyDown('DOWN')) {
            this.dy += this.speed * dt;
        }
        if ($PE.input.isKeyDown('RIGHT')) {
            this.dx += this.speed * dt;
        }
        if ($PE.input.isKeyDown('LEFT')) {
            this.dx -= this.speed * dt;
        }

        // velocity
        Matter.Body.setVelocity(this.rigidBody, { x: this.dx, y: this.dy })
        // of translate
        // Matter.Body.translate(this.rigidBody, { x: this.dx, y: this.dy })

        this.sprite.x = this.rigidBody.position.x
        this.sprite.y = this.rigidBody.position.y
        // this.sprite.rotation = this.rigidBody.angle
    }

    destroy(): void {
        this.sprite.destroy()
        Matter.World.remove($PE.physics.physicsEngine.world, this.rigidBody);
    }
}