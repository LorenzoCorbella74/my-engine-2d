import { Component } from "../../engine/components/Component";
import { GameObject } from "../../engine/GameObject";
import { DefaultComponentNames } from "../../engine/models/component-names.enum";


/* example for a script component */
export class ScriptComponent extends Component {

    constructor(gameObject: GameObject,) {
        super(gameObject, DefaultComponentNames.Script);
    }


    methodOne() {
        console.log('method one')
    }
}