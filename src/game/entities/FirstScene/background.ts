import { GameObject } from "../../../engine/GameObject";
import { SpriteComponent } from "../../../engine/components/sprite";
import { GameNode } from "../../../engine/decorators";

@GameNode()
export class Background extends GameObject {

    constructor(name: string, spriteName: string) {
        super(name);
        this.addComponent(new SpriteComponent(this, spriteName, 0, 0));
        const spriteComp = this.getComponents<SpriteComponent>('Sprite')[0]
        spriteComp.setInteractive(true)
        spriteComp.setAnchor(0);
        spriteComp.setWidthAndHeight(window.innerWidth, window.innerHeight);
        spriteComp.sprite.on("mousedown", (e) => {
            this.engine.toggle();
        });
    }
}