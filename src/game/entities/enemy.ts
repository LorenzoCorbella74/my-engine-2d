
import { GameObject } from "../../engine/GameObject"
import { GROUP, RigidBodyComponent } from "../../engine/components/rigidBody";
import { SpriteComponent } from "../../engine/components/sprite";
import { GameNode } from '../../engine/decorators';

@GameNode({
    groupName: 'Enemy',
})
export class Enemy extends GameObject {

    constructor(name, spriteName) {
        super(name, spriteName);

        this.addComponent(new SpriteComponent(this, spriteName));
        this.addComponent(new RigidBodyComponent(this, {
            shape: 'rectangle',
            isStatic: false,
            collisionFilter: {
                category: GROUP.ENEMY,
                mask: GROUP.PLAYER | GROUP.PROJECTILE | GROUP.WALL
            },
            position: {
                x: 500,
                y: 500
            }
        }))

        const sprite = this.getComponents<SpriteComponent>('Sprite')[0]
        // set sprite dimension
        sprite.setWidth(32); // il doppio del file...
        sprite.setHeight(32); // il doppio del file...

    }

    update(dt) {
        super.update(dt)
    }
}