import { Player } from '../entities/player';
import { Graphics, Sprite, TilingSprite, Text } from "pixi.js";
import { MyEngine2D } from "../../engine/Engine";
import { Scene } from "../../engine/Scene";
import { GameObject } from '../../engine/GameObject';

import { GROUP, RigidBodyComponent } from '../../engine/components/rigidBody';
import { Obstacle } from '../entities/MatterScene/obstacle';
import { createTestCrosshair } from '../entities/crosshair';

export class MatterScene extends Scene {

    player!: GameObject;
    obstacle!: GameObject;
    obstacle2!: GameObject;
    crosshair!: Graphics | Sprite;

    tilingSprite!: TilingSprite;

    textCoord!: Text

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

        // focus della camera sul player
        this.engine.camera.lockTo(this.player, this)

        // crosshair
        this.crosshair = this.engine.crosshair.activateOnCurrentScene(this, createTestCrosshair(this.engine));

        this.textCoord = new Text("Coord:", {
            fontSize: 12,
            lineHeight: 20,
            letterSpacing: 0,
            fill: 0xffffff,
            align: "center"
        });
        this.textCoord.anchor.set(0.5);
        this.textCoord.resolution = 8;
        this.addChild(this.textCoord)
    }



    update(delta: number) {

        // update gameObjects
        super.update(delta)

        // update player and rigidBody rotation
        const { x, y } = this.engine.mouse.getMouse();
        const playerRigidBody = this.player.getComponent<RigidBodyComponent>('RigidBody')!
        const angle = Math.atan2(y - this.player.y, x - this.player.x);
        this.player.rotation = angle;
        playerRigidBody.setRotation(angle)

        const { x: xp, y: yp } = this.player.getComponent<RigidBodyComponent>('RigidBody')!.rigidBody.position
        this.textCoord.x = Math.ceil(xp)
        this.textCoord.y = Math.ceil(yp) - 32
        this.textCoord.text = `x:${Math.ceil(xp)} - y:${Math.ceil(yp)}`

        // TODO: test hasLineOfSight
        // this.engine.time.runOnFrameNum([1, 30], (frameNumber: number) => {
        //     this.engine.log(`Player hasLineOfSight: ${frameNumber}`, this.engine.physics.hasLineOfSight(this.player, this.obstacle2))
        // })


        if (this.engine.keyboard.iskeyDownOnce('O')) {
            this.engine.log("the 'O' key has been pressed....")
            // TEST log2UI
            this.engine.log2UI(`the 'O' key has been pressed....${Math.floor(Math.random() * 10000)}`)
        }

        if (this.engine.keyboard.iskeyDownOnce('DEBUG')) {
            this.engine.log("Debug mode active ....")
            this.engine.togleDebug()
        }

        /** TEST GAME SPEED*/
        if (this.engine.keyboard.iskeyDownOnce('M')) {
            this.engine.animation.aminateOneObjectProperty('game-time', this.engine.time, { gameSpeed: 2 }, 3, undefined, () => {
                this.engine.log('GameSpeed animation completed!')
            })
        }
        /* TEST GAME SPPED CHANGE */
        if (this.engine.keyboard.iskeyDownOnce('E')) {
            this.engine.time.setGameSpeed(this.engine.time.getGameSpeed() / 2)
        }
        if (this.engine.keyboard.iskeyDownOnce('R')) {
            this.engine.time.setGameSpeed(this.engine.time.getGameSpeed() * 2)
        }
        // TEST enable/disable COLLISION
        if (this.engine.keyboard.iskeyDownOnce('Z')) {
            this.engine.physics.disableCollisions(this.player.getComponent<RigidBodyComponent>('RigidBody')!.rigidBody)
        }

        if (this.engine.keyboard.iskeyDownOnce('X')) {
            const categoriesToCollideWith = GROUP.ENEMY | GROUP.PROJECTILE | GROUP.WALL | GROUP.ITEM | GROUP.TRIGGER;
            this.engine.physics.enableCollisions(this.player.getComponent<RigidBodyComponent>('RigidBody')!.rigidBody, categoriesToCollideWith)
        }

        /* test crosshair */
        if (this.engine.keyboard.iskeyDownOnce('O')) {
            this.engine.crosshair.toggle()
        }
        if (this.engine.keyboard.iskeyDownOnce('N')) {

        }
    }
}