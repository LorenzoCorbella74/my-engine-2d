import { Player } from '../entities/player';
import { Graphics, Sprite, TilingSprite } from "pixi.js";
import { MyEngine2D } from "../../engine/Engine";
import { Scene } from "../../engine/Scene";
import { GameObject } from '../../engine/GameObject';

import { GROUP, RigidBodyComponent } from '../../engine/components/rigidBody';
import { Obstacle } from '../entities/MatterScene/obstacle';
import { KeyMapping } from '../../engine/models/key-mapping';

export class MatterScene extends Scene {

    player!: GameObject;
    obstacle!: GameObject;
    obstacle2!: GameObject;
    crosshair!: Graphics | Sprite;

    tilingSprite!: TilingSprite;

    constructor() {
        super(MyEngine2D)
    }

    async init() {
        // background tile
        const texture = MyEngine2D.getTexture('tile')
        this.tilingSprite = new TilingSprite(
            texture,
            MyEngine2D.app.screen.width,
            MyEngine2D.app.screen.height,
        );
        this.tilingSprite.tileScale.x = 0.05 /* texture.width / MyEngine2D.app.screen.width */
        this.tilingSprite.tileScale.y = 0.05 /* texture.height / MyEngine2D.app.screen.width */
        this.addChild(this.tilingSprite);

        // test MATTER-JS
        this.obstacle = new Obstacle('Obstacle', 100, 50, 200, 100);
        this.obstacle2 = new Obstacle('Obstacle2', 300, 450, 200, 100);

        // si definisce il player
        this.player = new Player('Player', 'player')
        this.player.position.set(window.innerWidth / 2, window.innerHeight / 2 - 100)
        // focus della camera sul player
        this.engine.camera.focusOn(this.player, this)

        // crosshair
        this.crosshair = new Graphics();
        this.crosshair.lineStyle(2, 0xFFFFFF, 1);
        this.crosshair.moveTo(-15, 0);
        this.crosshair.lineTo(15, 0);
        this.crosshair.moveTo(0, -15);
        this.crosshair.lineTo(0, 15);
        this.crosshair.position.set(this.engine.app.screen.width / 2, this.engine.app.screen.height / 2);

        this.crosshair = this.engine.crosshair.activateOnCurrentScene(this, this.crosshair);
    }



    update(delta: number) {

        // update gameObjects
        super.update(delta)

        // rotate player to target
        const { x, y } = this.engine.mouse.getMouse();
        this.crosshair.position.set(x, y);
        // update player and rigidBody rotation
        const playerRigidBody = this.player.getComponents<RigidBodyComponent>('RigidBody')[0]
        const angle = Math.atan2(y - this.player.y, x - this.player.x);
        this.player.rotation = angle;
        playerRigidBody.setRotation(angle)


        this.engine.time.runOnFrameNum([1, 30], (frameNumber: number) => {
            this.engine.log(`Player hasLineOfSight: ${frameNumber}`, this.engine.physics.hasLineOfSight(this.player, this.obstacle2))
        })


        if (this.engine.input.iskeyDownOnce('O')) {
            this.engine.log("the 'O' key has been pressed....")
            // TEST log2UI
            this.engine.log2UI(`the 'O' key has been pressed....${Math.floor(Math.random() * 10000)}`)
        }

        if (this.engine.input.iskeyDownOnce('DEBUG')) {
            this.engine.log("Debug mode active ....")
            this.engine.togleDebug()
        }

        /** TEST GAME SPEED*/
        if (this.engine.input.iskeyDownOnce('M')) {
            this.engine.animation.aminateOneObjectProperty('game-time', this.engine.time, { gameSpeed: 2 }, 3, undefined, () => {
                this.engine.log('GameSpeed animation completed!')
            })
        }
        /* TEST GAME SPPED CHANGE */
        if (this.engine.input.iskeyDownOnce('E')) {
            this.engine.time.setGameSpeed(this.engine.time.getGameSpeed() / 2)
        }
        if (this.engine.input.iskeyDownOnce('R')) {
            this.engine.time.setGameSpeed(this.engine.time.getGameSpeed() * 2)
        }
        // TEST enable/disable COLLISION
        if (this.engine.input.iskeyDownOnce('Z')) {
            this.engine.physics.disableCollisions(this.player.getComponents<RigidBodyComponent>('RigidBody')[0].rigidBody)
        }

        if (this.engine.input.iskeyDownOnce('X')) {
            const categoriesToCollideWith = GROUP.ENEMY | GROUP.PROJECTILE | GROUP.WALL | GROUP.ITEM;
            this.engine.physics.enableCollisions(this.player.getComponents<RigidBodyComponent>('RigidBody')[0].rigidBody, categoriesToCollideWith)
        }

        /* test crosshair */
        if (this.engine.input.iskeyDownOnce('O')) {
            this.engine.crosshair.hide()
        }
        if (this.engine.input.iskeyDownOnce('N')) {
            this.engine.crosshair.show()
        }
    }
}