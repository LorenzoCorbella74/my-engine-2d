import { Text } from 'pixi.js';
import { Component } from './Component';
import { GameObject } from '../GameObject';
import { DefaultComponentNames } from '../models/component-names.enum';

export class TextComponent extends Component {

    /**
     * Constructor for the Sprite component.
     *
     * @param {GameObject} gameObject - the parent game object
     * @param {string} spriteName - the name of the sprite
     * @param {number} localX - the local x coordinate (default: 0)
     * @param {number} localY - the local y coordinate (default: 0)
     */
    constructor(gameObject: GameObject, public text: Text, localX = 0, localY = 0) {
        super(gameObject, DefaultComponentNames.Text);
        this.entity.addChild(this.text); // add to the gameobject container
    }

    /**
     * Sets the width and height of the sprite in LOCAL coordinates.
     * @param x 
     * @param y 
     */
    setPosition(x: number, y: number) {
        this.text.x = x
        this.text.y = y
    }

    setAnchor(val: number) {
        this.text.anchor.set(val);
    }

    setRotation(angle: number) {
        this.text.rotation = angle
    }

    setInteractive(val: boolean) {
        this.text.interactive = val
    }

    hide() {
        this.text.visible = false;
    }

    show() {
        this.text.visible = true;
    }

    destroy() {
        this.text.destroy();
    }
}