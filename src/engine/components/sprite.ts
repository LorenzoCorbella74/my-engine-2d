import { Sprite } from 'pixi.js';
import { Component } from '../Component';
import { PixiEngine } from '../Engine';
import { RigidBodyComponent } from './rigidBody';
import { GameObject } from '../GameObject';
import { ComponentNames } from './component-names.enum';

export class SpriteComponent extends Component {

    public sprite: Sprite;

    constructor(gameObject: GameObject, spriteName: string, x = 0, y = 0) {
        super(gameObject, ComponentNames.Sprite);
        this.sprite = PixiEngine.getAsset(spriteName);
        // se ha uno sprite si mette nella scena
        if (this.sprite) {
            console.log(`Sprite name for ${spriteName}: width ${this.sprite.width}px and height ${this.sprite.height}px`);
            this.sprite.anchor.set(0.5);
            this.entity.addChild(this.sprite);
        } else {
            this.sprite = {
                x: x,
                y: y
            } as Sprite
        }
        if (x && y) {
            this.setPosition(x, y);
        }
    }

    /**
     * Si aggiona lo sprite in base al rigidBody
     * @param deltaTime 
     */
    update(deltaTime: number) {
        /* if (this.entity && this.entity.getComponents(ComponentNames.RigidBody)) {
            const rigidBody = this.entity?.getComponents<RigidBodyComponent>(ComponentNames.RigidBody)[0].rigidBody
            const { x, y } = rigidBody.position;
            this.sprite.x = x
            this.sprite.y = y
            this.setRotation(rigidBody.angle)
        } */
    }

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
        if (this.entity && this.entity.getComponents(ComponentNames.RigidBody)) {
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