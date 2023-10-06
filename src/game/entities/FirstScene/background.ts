import { GameObject } from "../../../engine/GameObject";
import { SpriteComponent } from "../../../engine/components/sprite";
import { GameNode } from "../../../engine/decorators";

@GameNode()
export class Background extends GameObject {

    constructor(name: string, spriteName: string) {
        super(name);
        this.addComponent(new SpriteComponent(this, spriteName));

        const sprite = this.getComponents<SpriteComponent>('Sprite')[0]
        // set sprite dimension
        sprite.setWidthAndHeight(window.innerWidth, window.innerHeight);
        sprite.setAnchor(0.5)
        sprite.setInteractive(true)
        sprite.on("mousedown", (e) => {
            this.engine.toggle();
        });
    }
}