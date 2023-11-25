import { GameObject } from "../../../engine/GameObject";
import { SpriteComponent } from "../../../engine/components/sprite";
import { GameNode } from "../../../engine/decorators";

@GameNode()
export class Button extends GameObject {
    pressed: boolean;

    /**
 * Creates a new instance of the class.
 *
 * @param {string} name - The name of the instance.
 * @param {string} spriteName - The name of the sprite.
 * @param {number} x - The x-coordinate of the instance.
 * @param {number} y - The y-coordinate of the instance.
 * @param {number} width - The width of the sprite.
 * @param {number} height - The height of the sprite.
 * @param {() => void} callback - The callback function to be executed when the sprite is clicked.
 */
    constructor(name: string, spriteName: string, x: number, y: number, width: number, height: number, callback: () => void) {
        super(name);
        // global coordinates
        this.x = x;
        this.y = y;
        this.pressed = false;
        this.addComponent(new SpriteComponent(this, spriteName, 0, 0));

        const spriteComp = this.getComponents<SpriteComponent>('Sprite')[0]
        spriteComp.setInteractive(true)
        spriteComp.setWidthAndHeight(width, height);
        spriteComp.sprite.on("mousedown", (e) => {
            if (this.pressed) return;
            this.pressed = true;
            callback();
        });
    }
}
