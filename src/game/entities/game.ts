
import { GameObject } from "../../engine/GameObject"
import { GameNode } from '../../engine/decorators';
import { ScriptComponent } from "../custom-component/script-one";

@GameNode()
export class Game extends GameObject {

    constructor(name: string) {
        super(name);
        this.addComponent(new ScriptComponent(this));
    }
}