
import { GameObject } from "../../engine/GameObject"
import { GameNode } from '../../engine/decorators';

@GameNode()
export class Game extends GameObject {

    debug: boolean = false
    paused: boolean = false

    constructor(name) {
        super(name);

    }

    update(dt) {

    }


}