
import { GameObject } from "../../engine/GameObject"
import { Entity } from '../../engine/decorators';
import { ScriptComponent } from "../custom-component/script-one";

@Entity()
export class Game extends GameObject {

    constructor(name: string) {
        super(name);
        this.addComponent(new ScriptComponent(this));
    }
}