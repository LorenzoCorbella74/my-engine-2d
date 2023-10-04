import { Player } from '../entities/player';
import { Graphics, TilingSprite } from "pixi.js";
import { PixiEngine } from "../../engine/Engine";
import { Scene } from "../../engine/Scene";
import { GameObject } from '../../engine/GameObject';

import * as Matter from 'matter-js';
import { GraphicsWithPhisics } from '../../engine/PhysicManager';
import { GROUP, RigidBodyComponent } from '../../engine/components/rigidBody';

export class MatterScene extends Scene {

    player!: GameObject;
    obstacle!: GraphicsWithPhisics;
    obstacle2!: GraphicsWithPhisics;
    crossHair!: Graphics;

    tilingSprite!: TilingSprite;

    constructor() {
        super(PixiEngine)
    }

    async init() {
        // background tile
        const texture = PixiEngine.getTexture('tile')
        this.tilingSprite = new TilingSprite(
            texture,
            PixiEngine.app.screen.width,
            PixiEngine.app.screen.height,
        );
        this.tilingSprite.tileScale.x = 0.05 /* texture.width / PixiEngine.app.screen.width */
        this.tilingSprite.tileScale.y = 0.05 /* texture.height / PixiEngine.app.screen.width */
        this.addChild(this.tilingSprite);

        // test MATTER-JS
        this.obstacle = this.createObstacle('Obstacle', 100, 50, 200, 100);
        this.obstacle2 = this.createObstacle('Obstacle2', 300, 450, 200, 100);

        // si definisce il player
        this.player = new Player('Player', 'player')
        this.player.position.set(window.innerWidth / 2, window.innerHeight / 2 - 100)
        // focus della camera sul player
        this.engine.camera.focusOn(this.player, this)

        this.crossHair = this.engine.crosshair.activateOnCurrentScene(this);
    }

    private createObstacle(name: string, x: number, y: number, width: number, height: number): GraphicsWithPhisics {
        let obstacle = new Graphics() as GraphicsWithPhisics;
        obstacle.beginFill(0xff0000);
        obstacle.drawRect(x, y, width, height);
        this.addChild(obstacle);
        // rigidBody
        obstacle.rigidBody = Matter.Bodies.rectangle(x + width / 2, y + height / 2, width, height, {
            isStatic: true,
            label: name,
            collisionFilter: {
                category: GROUP.WALL,
                mask: GROUP.PLAYER | GROUP.PROJECTILE | GROUP.ENEMY
            }
        });
        Matter.World.add(this.engine.physics.physicsEngine.world, obstacle.rigidBody);
        return obstacle
    }

    update(delta: number) {
        // PixiEngine.log(PixiEngine.time.getFrame().toString())
        // const dt = this.engine.time.getDeltaTime()

        // rotate player to target
        const mousePosition = this.engine.mouse.getMouse();
        this.crossHair.position.set(mousePosition.x, mousePosition.y);
        //console.log('Mouse: ', mousePosition.x, mousePosition.y)

        const playerRigidBody = this.player.getComponents<RigidBodyComponent>('RigidBody')[0]
        const angle = Math.atan2(mousePosition.y - this.player.y, mousePosition.x - this.player.x);
        this.player.rotation = angle;
        playerRigidBody.setRotation(angle)

        this.player.update(delta)

        this.tilingSprite.tilePosition.x = 1
        this.tilingSprite.tilePosition.y = 1

        this.engine.time.runOnFrameNum([1, 30], (frameNumber: number) => {
            // this.engine.log(`Player hasLineOfSight: ${frameNumber}`, this.engine.physics.hasLineOfSight(this.player, this.obstacle2))
        })
    }

    destroy() {
        // remove sprites and rigidBodies
        this.player.destroy()
    }

    onInputChange(inputs: any): void {
        /** TEST GAME SPEED*/
        if (this.engine.input.isKeyDown('M')) {
            // this.engine.time.aminateGameSpeed(2)
            this.engine.time.aminateOneObjectProperty(this.engine.time, 'gameSpeed', 2, 3, () => {
                this.engine.log('GameSpeed animation completed!')
            })
        }
        /* TEST GAME SPPED CHANGE */
        if (this.engine.input.isKeyDown('E')) {
            this.engine.time.setGameSpeed(this.engine.time.getGameSpeed() / 2)
        }
        if (this.engine.input.isKeyDown('R')) {
            this.engine.time.setGameSpeed(this.engine.time.getGameSpeed() * 2)
        }
        // TEST enable/disable COLLISION
        if (this.engine.input.isKeyDown('Z')) {
            this.engine.physics.disableCollisions(this.player.getComponents<RigidBodyComponent>('RigidBody')[0].rigidBody)
        }
        if (this.engine.input.isKeyDown('X')) {
            const categoriesToCollideWith = GROUP.ENEMY | GROUP.PROJECTILE | GROUP.WALL | GROUP.ITEM;
            this.engine.physics.enableCollisions(this.player.getComponents<RigidBodyComponent>('RigidBody')[0].rigidBody, categoriesToCollideWith)
        }
    }

    onExit() { }
}