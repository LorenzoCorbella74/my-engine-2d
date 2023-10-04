import { Sprite } from 'pixi.js';
import { Component } from './Component';
import { PixiEngine } from '../Engine';
import { RigidBodyComponent } from './rigidBody';
import { GameObject } from '../GameObject';
import { ComponentNames } from '../models/component-names.enum';

export class SpriteComponent extends Component {

    public sprite: Sprite;

    constructor(gameObject: GameObject, spriteName: string, localX = 0, localY = 0) {
        super(gameObject, ComponentNames.Sprite);
        this.sprite = PixiEngine.getAsset(spriteName);
        // if we have a sprite we put in the scene
        if (this.sprite) {
            console.log(`Sprite name for ${spriteName}: width ${this.sprite.width}px and height ${this.sprite.height}px`);
            this.sprite.anchor.set(0.5);
            this.entity.addChild(this.sprite);
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
     * Set local coordinates inside container
     * @param x 
     * @param y 
     */
    setPosition(x: number, y: number) {
        this.sprite.x = x
        this.sprite.y = y
    }

    setAnchor(val: number) {
        this.sprite.anchor.set(val);
    }

    setRotation(angle: number) {
        this.sprite.rotation = angle
    }

    setWidthAndHeight(width: number, height: number) {
        this.sprite.width = width;
        this.sprite.height = height;
        if (this.entity.getComponents(ComponentNames.RigidBody)) {
            this.entity?.getComponents<RigidBodyComponent>(ComponentNames.RigidBody)[0].updateSize();
        }
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

}