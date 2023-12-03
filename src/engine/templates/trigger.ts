import { Graphics } from "pixi.js";
import { GameObject } from "../GameObject";
import { BoundingBoxComponent } from "../components/bounding-box";
import { GraphicsComponent } from "../components/graphic";
import { RigidBodyComponent, GROUP } from "../components/rigidBody";
import { ComponentNames } from "../models/component-names.enum";
import { GameNode } from "../decorators";

@GameNode({ groupName: 'trigger' })
export class Trigger extends GameObject {

    fired: boolean = false

    constructor(
        name: string,
        rectangle: Graphics,
        public callback: () => void
    ) {
        super('trigger:'+name);
        this.addComponent(new GraphicsComponent(this, rectangle))
        this.addComponent(
            new RigidBodyComponent(this, {
                shape: 'rectangle',
                isStatic: true,
                collisionFilter: {
                    category: GROUP.TRIGGER,
                    mask: GROUP.PLAYER
                },
                //  inizial position in world coordinates
                position: {
                    x: rectangle.position.x,
                    y: rectangle.position.y
                }
            }))
        this.addComponent(new BoundingBoxComponent(this));

        // as default graphics are invisible (but via debug the BB will be visible)
        /* const graphics = this.getComponents<GraphicsComponent>(ComponentNames.Graphics)[0]
        graphics.hide(); */
    }
}