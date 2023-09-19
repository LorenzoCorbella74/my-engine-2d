import { Body } from 'matter-js';

import { GameObject } from '../../engine/GameObject';
import { GameNode } from '../../engine/decorators';
import { SpriteComponent } from '../../engine/components/sprite';
import { HealthComponent } from '../../engine/components/health';
import { GROUP, RigidBodyComponent } from '../../engine/components/rigidBody';

@GameNode()
export class Player extends GameObject {

    private speed: number = 150; // px/sec

    // velocity
    dx: number = 0;
    dy: number = 0;

    constructor(name, spriteName) {
        super(name, spriteName);
        this.addComponent(new SpriteComponent(this, spriteName));
        this.addComponent(new HealthComponent(this, 100));
        this.addComponent(new RigidBodyComponent(this, {
            shape: 'rectangle',
            isStatic: false,
            collisionFilter: {
                category: GROUP.PLAYER,
                mask: GROUP.ENEMY | GROUP.PROJECTILE | GROUP.WALL | GROUP.ITEM
            },
            position: {
                x: this.getComponents<SpriteComponent>('Sprite')[0].sprite.x,
                y: this.getComponents<SpriteComponent>('Sprite')[0].sprite.y
            }
        }))
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
        Body.setVelocity(this.getComponents<RigidBodyComponent>('RigidBody')[0].rigidBody, { x: this.dx, y: this.dy })
        // of translate
        // Body.translate(this.rigidBody, { x: this.dx, y: this.dy })

        // TODO: si aggiornano i componenti
        super.update(dt)
    }
}