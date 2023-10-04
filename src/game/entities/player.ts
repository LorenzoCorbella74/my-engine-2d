import { GameObject } from '../../engine/GameObject';
import { GameNode } from '../../engine/decorators';
import { SpriteComponent } from '../../engine/components/sprite';
import { HealthComponent } from '../../engine/components/health';
import { GROUP, RigidBodyComponent } from '../../engine/components/rigidBody';
import { InputController } from '../../engine/components/input-controller';

@GameNode()
export class Player extends GameObject {

    constructor(name: string, spriteName: string) {
        super(name);
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
        this.addComponent(new InputController(this, 150));
    }
}