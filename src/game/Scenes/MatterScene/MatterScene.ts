import { Player } from '../../entities/player';
import { Graphics, Sprite, TilingSprite, Text, Texture } from "pixi.js";

import { Scene } from "../../../engine/Scene";
import { GameObject } from '../../../engine/GameObject';

import { GROUP, RigidBodyComponent } from '../../../engine/components/rigidBody';
import { Obstacle } from './entities/obstacle';
import { createTestCrosshair } from '../../entities/crosshair';
import { DefaultComponentNames } from '../../../engine/models/component-names.enum';
import { Emitter } from '@barvynkoa/particle-emitter';
import { ring } from './ring';

export class MatterScene extends Scene {

    player!: GameObject;
    obstacle!: GameObject;
    obstacle2!: GameObject;
    obstacle3!: GameObject;
    crosshair!: Graphics | Sprite;

    tilingSprite!: TilingSprite;

    textCoord!: Text
    playerEmitter!: Emitter;

    constructor() {
        super()
    }

    async init() {
        // background tile
        // const texture = MyEngine2D.getTexture('tile')
        // this.tilingSprite = new TilingSprite(
        //     texture,
        //     this.engine.app.screen.width * 4, this.engine.app.screen.height * 4,  //this.engine.app.screen.width, this.engine.app.screen.height,
        // );
        // this.tilingSprite.tileScale.x = 0.05 /* texture.width / MyEngine2D.app.screen.width */
        // this.tilingSprite.tileScale.y = 0.05 /* texture.height / MyEngine2D.app.screen.width */
        // this.addChild(this.tilingSprite);

        // test MATTER-JS
        this.obstacle = new Obstacle('Obstacle', 100, 50, 200, 100);
        this.obstacle2 = new Obstacle('Obstacle2', 300, 450, 200, 100);
        this.obstacle3 = new Obstacle('Obstacle3', 1200, 150, 50, 300);

        // si definisce il player
        this.player = new Player('Player', 'player')

        // focus della camera sul player nella scena corrente
        this.engine.camera.lockTo(this.player, this)

        let crossHair = createTestCrosshair(this.engine)
        this.addChild(crossHair);

        // crosshair
        this.crosshair = this.engine.crosshair.activateOnCurrentScene(this, crossHair);


        this.playerEmitter = this.engine.emitter.addEmitter({
            lifetime: { min: 1, max: 5 },
            frequency: 0.01,
            spawnChance: 0.1,
            particlesPerWave: 1,
            emitterLifetime: 120,
            maxParticles: 100,
            pos: { x: this.player.x, y: this.player.y },
           /*  autoUpdate: true, */
            behaviors: [
                {
                    type: 'spawnShape',
                    config: { type: 'torus', data: { x: 0, y: 0, radius: 100 } },
                },
                { type: 'textureSingle', config: { texture: Texture.WHITE } },
            ]
        });

        this.engine.emitter.activate(this.playerEmitter);

        this.textCoord = new Text({
            text: "x:0 - y:0",
            style: {
                fontSize: 14,
                fill: 0xffffff,
                lineHeight: 20,
                letterSpacing: 0,
                align: "center"
            }
        });
        this.textCoord.anchor.set(0.5);
        this.textCoord.resolution = 8;
        this.addChild(this.textCoord)
    }



    update(delta: number) {

        // titling sprite as fized background
        // this.tilingSprite.tilePosition.x = -this.x;
        // this.tilingSprite.tilePosition.y = -this.y;
        // https://github.com/pixijs/pixijs/issues/5235 TILEPRITE ISSUE ???
        // this.tilingSprite.tilePosition.x %= this.tilingSprite.texture.width;
        // this.tilingSprite.tilePosition.y %= this.tilingSprite.texture.height;

        // update gameObjects
        super.update(delta)

        // update player and rigidBody rotation
        const { x, y } = this.engine.mouse.getMouse();
        const playerRigidBody = this.player.getComponent<RigidBodyComponent>(DefaultComponentNames.RigidBody)!
        // const playerSprite = this.player.getComponent<SpriteComponent>(ComponentNames.Sprite)!
        const angle = Math.atan2(y - this.player.y, x - this.player.x);
        // playerSprite.setRotation(angle);
        playerRigidBody.setRotation(angle)

        const { x: xp, y: yp } = this.player.getComponent<RigidBodyComponent>(DefaultComponentNames.RigidBody)!.rigidBody.position
        this.textCoord.x = Math.ceil(xp)
        this.textCoord.y = Math.ceil(yp) - 32
        this.textCoord.text = `x:${Math.ceil(xp)} - y:${Math.ceil(yp)}`


        this.playerEmitter.updateSpawnPos(
            this.player.x/* - this.engine.camera.container.x */, 
            this.player.y /* - this.engine.camera.container.y */
        );


        // TODO: test hasLineOfSight
        this.engine.time.runOnFrameNum([30], (frameNumber: number) => {
            this.engine.log(`Player hasLineOfSight: ${frameNumber}`, this.engine.physics.hasLineOfSight(this.player, this.obstacle2))
        })

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
            this.engine.physics.disableCollisions(this.player.getComponent<RigidBodyComponent>(DefaultComponentNames.RigidBody)!.rigidBody)
        }

        if (this.engine.keyboard.iskeyDownOnce('X')) {
            const categoriesToCollideWith = GROUP.ENEMY | GROUP.PROJECTILE | GROUP.WALL | GROUP.ITEM | GROUP.TRIGGER;
            this.engine.physics.enableCollisions(this.player.getComponent<RigidBodyComponent>(DefaultComponentNames.RigidBody)!.rigidBody, categoriesToCollideWith)
        }

        /* test crosshair */
        if (this.engine.keyboard.iskeyDownOnce('O')) {
            this.engine.crosshair.toggle()
        }
        if (this.engine.keyboard.iskeyDownOnce('N')) {
            this.engine.emitter.addEmitter(ring)
        }
    }
}