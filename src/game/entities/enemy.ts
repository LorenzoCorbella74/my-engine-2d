
import { GameObject } from "../../engine/GameObject"
import { GROUP, RigidBodyComponent } from "../../engine/components/rigidBody";
import { SpriteComponent } from "../../engine/components/sprite";
import { GameNode } from '../../engine/decorators';

@GameNode({
    groupName: 'Enemy',
})
export class Enemy extends GameObject {

    constructor(name: string, spriteName: string) {
        super(name);
        this.addComponent(new SpriteComponent(this, spriteName));
        this.addComponent(new RigidBodyComponent(this, {
            shape: 'rectangle',
            isStatic: false,
            collisionFilter: {
                category: GROUP.ENEMY,
                mask: GROUP.PLAYER | GROUP.PROJECTILE | GROUP.WALL
            },
            // initial position
            position: {
                x: 500,
                y: 500
            }
        }))
        const enemySprite = this.getComponents<SpriteComponent>('Sprite')[0]
        // set sprite dimension
        enemySprite.setWidthAndHeight(32, 32);
        enemySprite.setAnchor(0.5)
    }
}