import { Container } from "pixi.js";
import { Engine } from "./Engine";
import { GameObject } from "./GameObject";
import { DefaultComponentNames } from "./models/component-names.enum";
import { RigidBodyComponent } from "./components/rigidBody";
/* import { KeyMapping } from "./models/key-mapping"; */

export class Scene extends Container {
    constructor(public engine: Engine) {
        super();

        /*
            The width and height of a container is 0 
            if it has no children or empty.
        */
    }

    /**
     * Initialize objetct and load resources asyncronously
     */
    async init() { }


    // TODO: add beforeUpdate and afterUpdate
    beforeUpdate() { }

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

    afterUpdate() { }

    /**
     * Remove scene and its gameObjects and rigidbodies (if present)
     */
    onExit() {
        // remove rigidbody
        (this.children as GameObject[]).forEach(child => {
            if (child instanceof GameObject && child.hasComponent(DefaultComponentNames.RigidBody)) {
                child.getComponent<RigidBodyComponent>(DefaultComponentNames.RigidBody)?.removeRigidBody()
            }
        })
        // destroy scene and game object
        super.destroy({ children: true });
    }

    onResize(width: number, height: number) {
        console.log(this.constructor.name + '  resizing...', width, height);
        // resize each gameObject if window is resized
        (this.children as GameObject[]).forEach(child => {
            if (child instanceof GameObject) {
                child.resize(width, height);
            }
        })
    }
}