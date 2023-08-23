
import { GameObjectEntity, GameObject } from "../../engine/GameObject"


@GameObjectEntity
export class Game extends GameObject {

    debug: boolean = false
    paused: boolean = false

    constructor(name, spriteName) {
        super(name, spriteName);

    }

    update(dt) {

    }


}