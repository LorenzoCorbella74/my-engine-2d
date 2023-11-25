import { Component } from './Component';
import { SpriteComponent } from './sprite';
import { GameObject } from '../GameObject';

import { ComponentNames } from '../models/component-names.enum';
import { Graphics, Sprite } from 'pixi.js';

export class BoundingBoxComponent extends Component {

    dependencies: string[] = [ComponentNames.Sprite];
    sprite!: Sprite;

    public bb: Graphics = new Graphics();

    constructor(gameObject: GameObject) {
        super(gameObject, ComponentNames.BoundingBox);
        this.createBB();
    }

    private createBB() {
        if (this.entity.hasComponent(ComponentNames.Sprite)) {
            this.sprite = this.entity?.getComponents<SpriteComponent>(ComponentNames.Sprite)[0].sprite as Sprite
            const { x, y, width, height, anchor } = this.sprite;
            this.bb.lineStyle(2.5, 0xFF0000);
            this.bb.drawRect(x - anchor.x * width, y - anchor.y * height, width, height);
            this.bb.visible = false; // default hidden
            // console.log(`Bounding Box: width ${this.bb.width}px and height ${this.bb.height}px - x:${this.bb.x}px y:${this.bb.y}px`);
            this.engine.scenes.currentScene.addChild(this.bb);
        } else {
            this.engine.error('Sprite Component is required for BoundingBoxComponent');
            throw new Error("Sprite Component is required for BoundingBoxComponent");
        }
    }

    /**
     * Show the Bounding box if in DEBUG MODE
     */
    update() {
        if (this.engine.debug) {
            this.bb.visible = true;
            this.bb.position.x = this.entity.x;
            this.bb.position.y = this.entity.y;
            this.bb.rotation = this.entity.rotation;
        } else {
            this.bb.visible = false;
        }
    }
}