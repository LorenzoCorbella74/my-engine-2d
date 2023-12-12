import { Graphics } from 'pixi.js';
import { Component } from './Component';
import { RigidBodyComponent } from './rigidBody';
import { GameObject } from '../GameObject';
import { ComponentNames } from '../models/component-names.enum';

export class GraphicsComponent extends Component {


    /**
     * Constructs a new instance of the GraphicsComponent class.
     *
     * @param {GameObject} gameObject - The parent game object.
     * @param {Graphics} graphics - The graphics object to associate with this component.
     * @param {number} localX - The local x-coordinate of the component.
     * @param {number} localY - The local y-coordinate of the component.
     */
    constructor(gameObject: GameObject, public graphics: Graphics, localX = 0, localY = 0) {
        super(gameObject, ComponentNames.Graphics);
        // if we have a sprite we put in the scene
        console.log(`Graphics: width ${this.graphics.width}px and height ${this.graphics.height}px - x:${this.entity.x}px y:${this.entity.y}px`);
        this.entity.addChild(graphics);
        if (localX && localY) {
            this.setPosition(localX, localY);
        }
    }

    /**
     * Sets the width and height of the graphics in LOCAL coordinates.
     * @param x 
     * @param y 
     */
    setPosition(x: number, y: number) {
        this.graphics.x = x
        this.graphics.y = y
    }

    setRotation(angle: number) {
        this.graphics.rotation = angle
    }

    /**
     * Sets the width and height of the graphics.
     *
     * @param {number} width - The desired width of the graphics.
     * @param {number} height - The desired height of the graphics.
     */
    setWidthAndHeight(width: number, height: number) {
        this.graphics.width = width;
        this.graphics.height = height;
        if (this.entity.hasComponent(ComponentNames.RigidBody)) {
            this.entity?.getComponent<RigidBodyComponent>(ComponentNames.RigidBody)?.updateSize();
        }
    }

    setInteractive(val: boolean) {
        this.graphics.interactive = val
    }

    hide() {
        this.graphics.visible = false;
    }

    show() {
        this.graphics.visible = true;
    }

    destroy() {
        this.graphics.destroy();
    }

}