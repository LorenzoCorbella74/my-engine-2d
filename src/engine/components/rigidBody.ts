import { Component } from './Component';

import { Body, Bodies, World } from 'matter-js';
import { MyEngine2D } from '../Engine';
import { SpriteComponent } from './sprite';
import { GameObject } from '../GameObject';

import { ComponentNames } from '../models/component-names.enum';
import { Graphics, Sprite } from 'pixi.js';
import { RigidBodyOptions } from '../models/rigid-body';
import { GraphicsComponent } from './graphic';
import { EngineError } from '../EngineError';

export const GROUP = {
    DEFAULT: 0x0001,
    PLAYER: 0x0002,
    ENEMY: 0x0004,
    PROJECTILE: 0x0008,
    WALL: 0x0010,
    ITEM: 0x0020,
    NPC: 0x0040,
    TRIGGER: 0x0080,
} as const

export class RigidBodyComponent extends Component {

    dependencies: string[] = [ComponentNames.Sprite, ComponentNames.Graphics];   // TODO: check required components (OR / AND)

    public rigidBody!: Body;

    constructor(gameObject: GameObject, public options: RigidBodyOptions) {
        super(gameObject, ComponentNames.RigidBody);

        this.createRigidBody(options);
    }

    private createRigidBody(options: RigidBodyOptions) {
        const { shape, isStatic } = options;
        let x, y, width, height;
        let component;
        if (this.entity.hasComponent(ComponentNames.Sprite)) {
            component = this.entity?.getComponents<SpriteComponent>(ComponentNames.Sprite)[0].sprite as Sprite
        } else if (this.entity.hasComponent(ComponentNames.Graphics)) {
            component = this.entity?.getComponents<GraphicsComponent>(ComponentNames.Graphics)[0].graphics as Graphics
        } else {
            throw new EngineError(`Required components not implemented for RigidBodyComponent in ${this.entity.name} gameObject.`);
        }
        x = this.entity.x + options.position?.x || 0;
        y = this.entity.y + options.position?.y || 0;
        width = component.width;
        height = component.height;

        const config = {
            isStatic,
            friction: options.friction || 0.5,  // https://www.medianic.co.uk/getting-started-with-matter-js-the-body-module/
            frictionAir: options.frictionAir || 0.10,
            /* restitution: options.restitution || 0.09,
            density: 0.001, */
            label: this.entity.name,
            collisionFilter: {
                category: options?.collisionFilter?.category || GROUP.DEFAULT,
                mask: options?.collisionFilter?.mask || GROUP.DEFAULT
            }
        };
        // Create the  Matter.js BODY according to passed options
        if (shape === 'rectangle' && width && height && x !== undefined && y !== undefined) {
            this.rigidBody = Bodies.rectangle(x + width / 2, y + height / 2, width, height, config) as Body;
        } else if (shape === 'circle' && width && height && x !== undefined && y !== undefined) {
            this.rigidBody = Bodies.circle(x + width / 2, y + height / 2, width, config) as Body; // TODO
        } else if (shape === 'polygon') {
            // TODO: poligon
        }
        // Aggiungi il corpo Matter.js al mondo
        World.add(MyEngine2D.physics.physicsEngine.world, this.rigidBody);
    }

    /**
     * Sync the entity position/rotation with the rigid body
     */
    update() {
        if (this.entity.hasComponent(ComponentNames.Sprite)) {
            this.entity.x = this.rigidBody.position.x
            this.entity.y = this.rigidBody.position.y
        } else if (this.entity.hasComponent(ComponentNames.Graphics)) {
            this.entity.x = this.rigidBody.position.x - this.entity.getComponents<GraphicsComponent>(ComponentNames.Graphics)[0].graphics.width / 2
            this.entity.y = this.rigidBody.position.y - this.entity.getComponents<GraphicsComponent>(ComponentNames.Graphics)[0].graphics.height / 2
        }
        this.entity.rotation = this.rigidBody.angle;
    }

    updateSize() {
        this.removeRigidBody()
        this.createRigidBody(this.options);
    }

    updatePosition(x: number, y: number) {
        Body.set(this.rigidBody, "position", { x, y })
        // Body.setPosition(this.rigidBody, {x, y})
    }

    removeRigidBody() {
        World.remove(MyEngine2D.physics.physicsEngine.world, this.rigidBody);
    }

    setRotation(angle: number) {
        this.rigidBody.angle = angle
    }
}




