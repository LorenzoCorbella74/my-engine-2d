
import { GameEvent } from "../../engine/EventManager";
import { GameObject } from "../../engine/GameObject"
import { GameObjectEntity, GameObjectGroup } from '../../engine/decorators';

@GameObjectGroup('Enemy')
@GameObjectEntity
export class Enemy extends GameObject {

    constructor(name, spriteName) {
        super(name, spriteName);

        this.sprite.x = window.innerWidth / 2 + 200;
        this.sprite.y = window.innerHeight / 2;
    }

    update(dt) {

    }
}