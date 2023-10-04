import { Component } from './Component';

import { Body, Bodies, World } from 'matter-js';
import { PixiEngine } from '../Engine';
import { SpriteComponent } from './sprite';
import { GameObject } from '../GameObject';

import { ComponentNames } from '../models/component-names.enum';
import { Sprite } from 'pixi.js';

export const GROUP = {
    DEFAULT: 0x0001,
    PLAYER: 0x0002,
    ENEMY: 0x0004,
    PROJECTILE: 0x0008,
    WALL: 0x0010,
    ITEM: 0x0020,
    NPC: 0x0040
} as const

type GroupsType = keyof typeof GROUP;
type GroupsValue = typeof GROUP[keyof typeof GROUP];

// Opzioni per il corpo Matter
type RigidBodyOptions = {
    shape: 'rectangle' | 'circle' | 'polygon';
    isStatic: boolean;
    friction?: number;
    frictionAir?: number;
    restitution?: number;
    collisionFilter: {
        category?: GroupsValue,
        mask?: number  // Esempio maschera di collisione
    }
    position?: { x: number, y: number }
}

export class RigidBodyComponent extends Component {

    dependencies: string[] = [ComponentNames.Sprite];

    public rigidBody!: Body;

    constructor(gameObject: GameObject, public options: RigidBodyOptions) {
        super(gameObject, ComponentNames.RigidBody);

        this.createRigidBody(options);
    }

    private createRigidBody(options: RigidBodyOptions) {
        const { shape, isStatic } = options;
        const { x, y } = options.position || this.entity?.getComponents<SpriteComponent>(ComponentNames.Sprite)[0].sprite as Sprite;
        const { width, height } = this.entity?.getComponents<SpriteComponent>(ComponentNames.Sprite)[0].sprite as Sprite;
        const config = {
            isStatic,
            friction: options.friction || 0.5,  // https://www.medianic.co.uk/getting-started-with-matter-js-the-body-module/
            frictionAir: options.frictionAir || 0.10,
            /* restitution: options.restitution || 0.09,
            density: 0.001, */
            label: this.name,
            collisionFilter: {
                category: options?.collisionFilter?.category || GROUP.DEFAULT,
                mask: options?.collisionFilter?.mask || GROUP.DEFAULT
            }
        };
        // Crea il corpo Matter.js in base alle opzioni
        if (shape === 'rectangle') {
            this.rigidBody = Bodies.rectangle(x + width / 2, y + height / 2, width, height, config) as Body;
        } else if (shape === 'circle') {
            this.rigidBody = Bodies.circle(x + width / 2, y + height / 2, width, config) as Body; // TODO
        } else if (shape === 'polygon') {
            // TODO: poligono personalizzato
        }
        // Aggiungi il corpo Matter.js al mondo
        World.add(PixiEngine.physics.physicsEngine.world, this.rigidBody);
    }

    /**
     * Sync the entity position with the rigid body
     */
    update() {
        if (this.entity) {
            this.entity.x = this.rigidBody.position.x
            this.entity.y = this.rigidBody.position.y
            this.entity.rotation = this.rigidBody.angle;
        }
    }

    updateSize() {
        this.removeRigidBody()
        this.createRigidBody(this.options);
    }

    removeRigidBody() {
        World.remove(PixiEngine.physics.physicsEngine.world, this.rigidBody);
    }

    setRotation(angle: number) {
        this.rigidBody.angle = angle
    }

}




