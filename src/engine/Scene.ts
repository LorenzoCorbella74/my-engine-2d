import { Container } from "pixi.js";
import { Engine } from "./Engine";
import { GameObject } from "./GameObject";
import { DefaultComponentNames } from "./models/component-names.enum";
import { RigidBodyComponent } from "./components/rigidBody";


/**
 * Represents a scene in the game engine.
 * Scenes are containers that hold game objects and manage their updates and rendering.
 * NOTE: The width and height of a container is 0 if it has no children or empty.
 */
export class Scene extends Container {
    constructor(public engine: Engine) {
        super();
    }

    /**
     * Initialize object and load resources asynchronously.
     */
    async init() { }

    /**
     * Called before updating the game objects in the scene.
     */
    beforeUpdate() { }

    /**
     * Update game objects in the scene.
     * @param dt - The time elapsed since the last update.
     */
    update(dt: number) {
        (this.children as GameObject[]).forEach(child => {
            if (child instanceof GameObject) {
                child.update(dt);
            }
        })
    }

    /**
     * Called after updating the game objects in the scene.
     */
    afterUpdate() { }

    /**
     * Remove the scene and its game objects and rigid bodies (if present).
     */
    onExit() {
        // remove rigid bodies
        (this.children as GameObject[]).forEach(child => {
            if (child instanceof GameObject && child.hasComponent(DefaultComponentNames.RigidBody)) {
                child.getComponent<RigidBodyComponent>(DefaultComponentNames.RigidBody)?.removeRigidBody()
            }
        })
        // destroy scene and game objects
        super.destroy({ children: true });
    }

    /**
     * Called when the window is resized.
     * @param width - The new width of the window.
     * @param height - The new height of the window.
   
    onResize(width: number, height: number) {
        console.log(this.constructor.name + '  resizing...', width, height);
        // resize each game object if window is resized
        (this.children as GameObject[]).forEach(child => {
            if (child instanceof GameObject) {
                child.resize(width, height);
            }
        })
    }
      */
}