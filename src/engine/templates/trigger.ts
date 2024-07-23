import { Graphics } from "pixi.js";
import { GameObject } from "../GameObject";
import { BoundingBoxComponent } from "../components/bounding-box";
import { GraphicsComponent } from "../components/graphic";
import { RigidBodyComponent, GROUP } from "../components/rigidBody";
import { Entity } from "../decorators";

@Entity({ groupName: 'trigger' })
export class Trigger extends GameObject {

    fired: boolean = false

    constructor(
        name: string,
        rectangle: { x: number, y: number, width: number, height: number },
        public callback: () => void
    ) {
        super('trigger:' + name);
        // set the position in global space
        this.setPosition(rectangle.x, rectangle.y)
        let triggerBox = new Graphics();
        triggerBox.rect(0, 0, rectangle.width, rectangle.height);
        triggerBox.fill(0xff0000);
        triggerBox.visible = false;  // TODO: check!!!

        this.addComponent(new GraphicsComponent(this, triggerBox))
        this.addComponent(
            new RigidBodyComponent(this, {
                shape: 'rectangle',
                isStatic: true,
                collisionFilter: {
                    category: GROUP.TRIGGER,
                    mask: GROUP.PLAYER
                },
                //  inizial position in local coordinates
                position: {
                    x: 0,
                    y: 0
                }
            }))
        this.addComponent(new BoundingBoxComponent(this));
    }

    reset() {
        this.fired = false
    }
}