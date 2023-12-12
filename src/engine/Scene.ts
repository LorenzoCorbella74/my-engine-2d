import { Container } from "pixi.js";
import { Engine } from "./Engine";
import { GameObject } from "./GameObject";
import { ComponentNames } from "./models/component-names.enum";
import { RigidBodyComponent } from "./components/rigidBody";
/* import { KeyMapping } from "./models/key-mapping"; */

export class Scene extends Container {
    constructor(public engine: Engine) {
        super();
    }

    /**
     * Initialize objetct and load resources asyncronously
     */
    async init() { }

    /**
     * Update gameObjects (which internally update their components)
     * @param dt 
     */
    update(dt: number) {
        (this.children as GameObject[]).forEach(child => {
            if (child instanceof GameObject) {
                child.update(dt);
            }
        })
    }

    /**
     * Remove scene and its gameObjects and rigidbodies (if present)
     */
    onExit() {
        // remove rigidbody
        (this.children as GameObject[]).forEach(child => {
            if (child instanceof GameObject && child.hasComponent(ComponentNames.RigidBody)) {
                child.getComponent<RigidBodyComponent>(ComponentNames.RigidBody)?.removeRigidBody()
            }
        })
        // destroy scene and game object
        super.destroy({ children: true });
    }

    onResize(width: number, height: number) {
        console.log(this.constructor.name + '  resizing...', width, height)
        // resize each gameObject if window is resized
    }
}