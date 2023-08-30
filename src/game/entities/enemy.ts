
import { GameObject } from "../../engine/GameObject"
import { GameNode } from '../../engine/decorators';

@GameNode({
    groupName: 'Enemy',
})
export class Enemy extends GameObject {

    constructor(name, spriteName) {
        super(name, spriteName);

        // set sprite dimension
        this.sprite.width = 32; // il doppio del file...
        this.sprite.height = 32; // il doppio del file...
    }

    update(dt) {
        super.update(dt)
    }
}