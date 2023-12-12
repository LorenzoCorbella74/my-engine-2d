import { GameObject } from "../../../engine/GameObject";
import { SpriteComponent } from "../../../engine/components/sprite";
import { Entity } from "../../../engine/decorators";

@Entity()
export class Background extends GameObject {

    constructor(name: string, spriteName: string) {
        super(name);
        this.addComponent(new SpriteComponent(this, spriteName, 0, 0));
        const spriteComp = this.getComponent<SpriteComponent>('Sprite')!
        spriteComp.setInteractive(true)
        spriteComp.setAnchor(0);
        spriteComp.setWidthAndHeight(window.innerWidth, window.innerHeight);
        spriteComp.sprite.on("mousedown", (e) => {
            this.engine.toggleLoop();
        });
    }
}