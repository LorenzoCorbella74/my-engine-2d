
import { GameObject } from "../../engine/GameObject"
import { GameNode } from '../../engine/decorators';

@GameNode({
    groupName: 'Enemy',
})
export class Enemy extends GameObject {

    constructor(name, spriteName) {
        super(name, spriteName);

        // set sprite dimension
        this.sprite.width = 32
        this.sprite.height = 32
    }

    update(dt) {
        super.update(dt)
    }
}