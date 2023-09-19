import { Sprite } from 'pixi.js';
import { Component } from '../Component';
import { PixiEngine } from '../Engine';
import { RigidBodyComponent } from './rigidBody';
import { GameObject } from '../GameObject';

export class SpriteComponent extends Component {

    public sprite: Sprite;

    constructor(gameObject: GameObject, spriteName: string, x = 0, y = 0) {
        super(gameObject, 'Sprite');
        this.sprite = PixiEngine.getAsset(spriteName);
        // se ha uno sprite si mette nella scena
        if (this.sprite) {
            PixiEngine.scenes.currentScene.addChild(this.sprite);
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

    update(deltaTime: number) {
        if (this.entity && this.entity.getComponents('RigidBody')) {
            const { x, y } = this.entity?.getComponents<RigidBodyComponent>('RigidBody')[0].rigidBody.position;
            this.sprite.x = x
            this.sprite.y = y
        }
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

    setWidth(val: number) {
        this.sprite.width = val
    }

    setHeight(val: number) {
        this.sprite.height = val
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