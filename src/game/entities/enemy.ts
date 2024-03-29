
import { GameObject } from "../../engine/GameObject"
import { GROUP, RigidBodyComponent } from "../../engine/components/rigidBody";
import { SpriteComponent } from "../../engine/components/sprite";
import { Entity } from '../../engine/decorators';

@Entity({
    groupName: 'Enemy',
})
export class Enemy extends GameObject {

    constructor(name: string, spriteName: string) {
        super(name);
        this.addComponent(new SpriteComponent(this, spriteName));
        this.addComponent(new RigidBodyComponent(this, {
            shape: 'rectangle',
            isStatic: false,
            collisionFilter: {
                category: GROUP.ENEMY,
                mask: GROUP.PLAYER | GROUP.PROJECTILE | GROUP.WALL
            },
            // initial position
            position: {
                x: 500,
                y: 500
            }
        }))
        const enemySprite = this.getComponent<SpriteComponent>('SpriteComponent')!
        const enemyRigidBody = this.getComponent<RigidBodyComponent>('RigidBodyComponent')!
        // set sprite dimension (and update rigidbody...)
        enemySprite.setWidthAndHeight(32, 32);
        enemySprite.setInteractive(true)

        // test for applyforce
        enemySprite.sprite.on("mousedown", (e) => {
            // let power = this.engine.math.distance(this, { x: e.clientX, y: e.clientY }) * 10;
            let angle = this.engine.math.angle(this, { x: e.clientX, y: e.clientY });
            enemyRigidBody.applyForce(angle, /* power */10);
        })
    }
}