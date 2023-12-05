import { Graphics } from "pixi.js";
import { GameObject } from "../../../engine/GameObject";
import { GraphicsComponent } from "../../../engine/components/graphic";
import { GROUP, RigidBodyComponent } from "../../../engine/components/rigidBody";
import { GameNode } from "../../../engine/decorators";

@GameNode()
export class Obstacle extends GameObject {

    constructor(name: string, x: number, y: number, width: number, height: number) {
        super(name);
        // setting the position of the GameObject container
        this.setPosition(x, y)

        let obstacle = new Graphics();
        obstacle.beginFill(0xff0000);
        obstacle.drawRect(0, 0, width, height);

        this.addComponent(new GraphicsComponent(this, obstacle));
        this.addComponent(new RigidBodyComponent(this, {
            shape: 'rectangle',
            isStatic: true,
            collisionFilter: {
                category: GROUP.WALL,
                mask: GROUP.PLAYER | GROUP.PROJECTILE | GROUP.ENEMY
            },
            position: {
                x: 0,
                y: 0
            }
        }))
    }
}