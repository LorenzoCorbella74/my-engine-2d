import { Sprite } from 'pixi.js';
import { Component } from './Component';
import { MyEngine2D } from '../Engine';
import { RigidBodyComponent } from './rigidBody';
import { GameObject } from '../GameObject';
import { ComponentNames } from '../models/component-names.enum';

export class SpriteComponent extends Component {

    public sprite: Sprite;

    /**
     * Constructor for the Sprite component.
     *
     * @param {GameObject} gameObject - the parent game object
     * @param {string} spriteName - the name of the sprite
     * @param {number} localX - the local x coordinate (default: 0)
     * @param {number} localY - the local y coordinate (default: 0)
     */
    constructor(gameObject: GameObject, spriteName: string, localX = 0, localY = 0) {
        super(gameObject, ComponentNames.Sprite);
        this.sprite = MyEngine2D.getAsset(spriteName);
        // if we have a sprite we put in the scene
        if (this.sprite) {
            console.log(`Sprite name for ${spriteName}: width ${this.sprite.width}px and height ${this.sprite.height}px`);
            this.sprite.anchor.set(0.5);
            this.entity.addChild(this.sprite); // add to the gameobject container
        } else {
            this.sprite = {
                x: localX,
                y: localY
            } as Sprite
        }
        if (localX && localY) {
            this.setPosition(localX, localY);
        }
    }

    /**
     * Sets the width and height of the sprite in LOCAL coordinates.
     * @param x 
     * @param y 
     */
    setPosition(x: number, y: number) {
        this.sprite.x = x
        this.sprite.y = y
        // TODO: update rigidbody....
        if (this.entity.hasComponent(ComponentNames.RigidBody)) {
            this.entity?.getComponent<RigidBodyComponent>(ComponentNames.RigidBody)?.updatePosition(this.entity.x + x, this.entity.y + y); // TESTARE !!
        }
    }

    setAnchor(val: number) {
        this.sprite.anchor.set(val);
    }

    setRotation(angle: number) {
        this.sprite.rotation = angle
    }

    /**
     * Sets the width and height of the sprite.
     *
     * @param {number} width - The desired width of the sprite.
     * @param {number} height - The desired height of the sprite.
     */
    setWidthAndHeight(width: number, height: number) {
        this.sprite.width = width;
        this.sprite.height = height;
        if (this.entity.hasComponent(ComponentNames.RigidBody)) {
            this.entity?.getComponent<RigidBodyComponent>(ComponentNames.RigidBody)?.updateSize();
        }
    }

    setInteractive(val: boolean) {
        this.sprite.interactive = val
    }

    hide() {
        this.sprite.visible = false;
    }

    show() {
        this.sprite.visible = true;
    }

    destroy() {
        this.sprite.destroy();
    }

    resize(width: number, height: number): void {
        /* 
        
        TODO: si aggiorna in base alle dimensioni di gioco
        this.sprite.width = width;
        this.sprite.height = height; 
        */
        if (this.entity.hasComponent(ComponentNames.RigidBody)) {
            this.entity?.getComponent<RigidBodyComponent>(ComponentNames.RigidBody)?.updateSize();
        }
    }

}