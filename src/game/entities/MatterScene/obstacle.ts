import { Graphics } from "pixi.js";
import { GameObject } from "../../../engine/GameObject";
import { GraphicsComponent } from "../../../engine/components/graphic";
import { GROUP, RigidBodyComponent } from "../../../engine/components/rigidBody";

export class Obstacle extends GameObject {

    constructor(name: string, x: number, y: number, width: number, height: number) {
        super(name);

        let obstacle = new Graphics();
        obstacle.beginFill(0xff0000);
        obstacle.drawRect(x, y, width, height);

        this.addComponent(new GraphicsComponent(this, obstacle));
        this.addComponent(new RigidBodyComponent(this, {
            shape: 'rectangle',
            isStatic: true,
            collisionFilter: {
                category: GROUP.WALL,
                mask: GROUP.PLAYER | GROUP.PROJECTILE | GROUP.ENEMY
            },
            position: {
                x: x,
                y: y
            }
        }))
    }
}