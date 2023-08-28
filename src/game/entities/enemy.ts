
import { GameObject } from "../../engine/GameObject"
import { GROUP, GameNode } from '../../engine/decorators';


@GameNode({
    groupName: 'Enemy',
    rigidBody: {
        shape: 'rectangle',
        isStatic: false,
        collisionFilter: {
            category: GROUP.ENEMY,
            mask: GROUP.PLAYER | GROUP.PROJECTILE | GROUP.WALL
        }
    }
})
export class Enemy extends GameObject {

    constructor(name, spriteName) {
        super(name, spriteName);
        this.sprite.width = 32
        this.sprite.height = 32
        this.sprite.x = window.innerWidth / 2 + 200;
        this.sprite.y = window.innerHeight / 2;
    }

    update(dt) {
        this.sprite.x = this.rigidBody.position.x
        this.sprite.y = this.rigidBody.position.y
    }
}