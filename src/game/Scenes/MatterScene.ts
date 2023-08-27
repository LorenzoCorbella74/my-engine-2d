import { Player } from '../entities/player';
import { Graphics } from "pixi.js";
import { PixiEngine } from "../../engine/Engine";
import { Scene } from "../../engine/Scene";
import { GameObject } from '../../engine/GameObject';
import { GameGraphics } from '../../engine/GameGraphics'
import * as Matter from 'matter-js';
import { GraphicsWithPhisics } from '../../engine/PhysicManager';




export class MatterScene extends Scene {

    player: GameObject;
    obstacle: GraphicsWithPhisics;
    obstacle2: GraphicsWithPhisics;
    crossHair: Graphics;


    rectangle: Graphics;
    circle: Graphics;
    line: Graphics;

    constructor() {
        super(PixiEngine)
    }

    setup() {
        // test MATTER-JS
        this.obstacle = new Graphics() as GraphicsWithPhisics;
        this.obstacle.beginFill(0xff0000);
        this.obstacle.drawRect(0, 0, 200, 100);
        this.addChild(this.obstacle)
        // rigidBody
        this.obstacle.rigidBody = Matter.Bodies.rectangle(100, 50, 200, 100, {
            isStatic: true,
            label: "Obstacle"
        });
        Matter.Composite.add(this.engine.physics.physicsEngine.world, this.obstacle.rigidBody);


        this.obstacle2 = new Graphics() as GraphicsWithPhisics;
        this.obstacle2.beginFill(0xff0000);
        this.obstacle2.drawRect(200, 400, 200, 100);
        this.addChild(this.obstacle2)
        // rigidBody
        this.obstacle2.rigidBody = Matter.Bodies.rectangle(300, 450, 200, 100, {
            isStatic: true,
            label: "Obstacle2"
        });
        Matter.Composite.add(this.engine.physics.physicsEngine.world, this.obstacle2.rigidBody);

        this.player = new Player('Player', 'player')
        this.player.sprite.x = window.innerWidth / 2;
        this.player.sprite.y = window.innerHeight / 2 - 100;
        this.player.sprite.anchor.set(0.5);
        this.engine.camera.focusOn(this.player, this)

        // test GameGraphics
        this.rectangle = new GameGraphics(this).drawRectangle(500, 0, 100, 100)
        this.line = new GameGraphics(this).drawLine(800, 0, 0, 600)
        this.circle = new GameGraphics(this).drawCircle(500, 500, 100)

        this.crossHair = this.engine.crosshair.activateOnCurrentScene(this);
    }

    update(delta: number) {
        // PixiEngine.log(PixiEngine.time.getFrame().toString())
        // const dt = this.engine.time.getDeltaTime()

        // rotate player to target
        const mousePosition = this.engine.mouse.getMouse();
        this.crossHair.position.set(mousePosition.x, mousePosition.y);
        //console.log('Mouse: ', mousePosition.x, mousePosition.y)
        const angle = Math.atan2(mousePosition.y - this.player.sprite.y, mousePosition.x - this.player.sprite.x);
        this.player.sprite.rotation = angle;

        this.player.update(delta)


        this.engine.time.runOnFrameNum(1, () => {
            this.engine.log('Player hasLineOfSight: ', this.engine.physics.hasLineOfSight(this.player, this.obstacle2))
        })
    }

    destroy() {
        // remove sprites and rigidBodies
        this.player.destroy()
    }

    onInputChange(inputs: any): void {
        /** TEST GAME SPEED*/
        if (this.engine.input.isKeyDown('M')) {
            this.engine.time.aminateGameSpeed(2)
        }
        /* TEST GAME SPPED CHANGE */
        if (this.engine.input.isKeyDownForOneShot('E')) {
            this.engine.time.setGameSpeed(this.engine.time.getGameSpeed() / 2)
        }
        if (this.engine.input.isKeyDownForOneShot('R')) {
            this.engine.time.setGameSpeed(this.engine.time.getGameSpeed() * 2)
        }
    }
}