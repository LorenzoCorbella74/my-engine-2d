
import { GameEvent } from "../../engine/EventManager";
import { GameObjectEntity, GameObject, GameObjectGroup } from "../../engine/GameObject"

@GameObjectGroup('Enemy')
@GameObjectEntity
export class Enemy extends GameObject {

    constructor(name, spriteName) {
        super(name, spriteName);

        this.entity.x = window.innerWidth / 2 + 200;
        this.entity.y = window.innerHeight / 2;
    }

    update(dt) {

    }
}