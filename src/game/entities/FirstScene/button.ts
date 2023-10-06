import { GameObject } from "../../../engine/GameObject";
import { SpriteComponent } from "../../../engine/components/sprite";
import { GameNode } from "../../../engine/decorators";

@GameNode()
export class Button extends GameObject {

    constructor(name: string, spriteName: string, x: number, y: number, width: number, height: number, callback: () => void) {
        super(name);
        // global coordinates
        this.x = x;
        this.y = y;
        this.addComponent(new SpriteComponent(this, spriteName, 0, 0));

        const spriteComp = this.getComponents<SpriteComponent>('Sprite')[0]
        spriteComp.setInteractive(true)
        spriteComp.setWidthAndHeight(width, height);
        spriteComp.sprite.on("mousedown", (e) => {
            callback();
        });
    }
}
