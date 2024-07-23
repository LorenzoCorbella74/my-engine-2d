import { Component } from './Component';
import { SpriteComponent } from './sprite';
import { GameObject } from '../GameObject';

import { DefaultComponentNames } from '../models/component-names.enum';
import { Graphics, Sprite } from 'pixi.js';
import { GraphicsComponent } from './graphic';

export class BoundingBoxComponent extends Component {

    dependencies: string[] = [DefaultComponentNames.Sprite];
    source!: Sprite | Graphics;

    public bb: Graphics = new Graphics();

    constructor(gameObject: GameObject) {
        super(gameObject, DefaultComponentNames.BoundingBox);
        this.createBB();
    }

    private createBB() {
        const hasSprite = this.entity.hasComponent(DefaultComponentNames.Sprite)
        const hasGraphics = this.entity.hasComponent(DefaultComponentNames.Graphics)
        if (hasSprite || hasGraphics) {
            this.source = this.entity?.getComponent<SpriteComponent>(DefaultComponentNames.Sprite)?.sprite as Sprite || this.entity?.getComponent<GraphicsComponent>(DefaultComponentNames.Graphics)?.graphics as Graphics
            const { x, y, width, height, anchor } = this.source;
            this.bb.stroke({width:2.5, color: 0xFF0000});
            this.bb.rect(x - anchor?.x * width, y - anchor?.y * height, width, height);
            this.bb.visible = false; // default hidden
            // console.log(`Bounding Box: width ${this.bb.width}px and height ${this.bb.height}px - x:${this.bb.x}px y:${this.bb.y}px`);
            this.engine.scenes.currentScene.addChild(this.bb);
        } else {
            this.engine.error('For BoundingBoxComponent or Sprite Component or Graphics Component are required!');
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