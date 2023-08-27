
import { GameObject } from "../../engine/GameObject"
import { GameObjectEntity } from '../../engine/decorators';

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