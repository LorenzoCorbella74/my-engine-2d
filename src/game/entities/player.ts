import { GameObject } from '../../engine/GameObject';
import { Entity } from '../../engine/decorators';
import { SpriteComponent } from '../../engine/components/sprite';
import { HealthComponent } from '../../engine/components/health';
import { GROUP, RigidBodyComponent } from '../../engine/components/rigidBody';
import { InputControllerComponent } from '../../engine/components/input-controller';
import { BoundingBoxComponent } from '../../engine/components/bounding-box';

@Entity()
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
                mask: GROUP.ENEMY | GROUP.PROJECTILE | GROUP.WALL | GROUP.ITEM | GROUP.TRIGGER
            },
            //  inizial position in world coordinates
            position: {
                x: 0,
                y: 0
            }
        }))
        this.addComponent(new InputControllerComponent(this, 150));
        this.addComponent(new BoundingBoxComponent(this));
    }


    satisfyLoseGameCondition(): boolean {
        let healthC = this.getComponent<HealthComponent>('HealthComponent')
        if (healthC?.alive) {
            return healthC.health < 0;
        };
        return false
    }
}