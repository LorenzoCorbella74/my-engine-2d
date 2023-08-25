import { Player } from '../entities/player';
import { Enemy } from '../entities/enemy';

import { Graphics, Text } from "pixi.js";
import { PixiEngine as $PE } from "../../engine/Engine";
import { Scene } from "../../engine/Scene";
import { GameObject } from '../../engine/GameObject';
import { EventType, GameEvent, GameEventForGroup } from '../../engine/EventManager';
import { InputKeyboardManager } from '../../engine/InputKeyboardManager';

import * as Matter from 'matter-js';

export class MatterScene extends Scene {


    player: GameObject;
    playerSpeed: number;

    obstacle: Graphics;
    rectangle2: Graphics;
    crosshair: Graphics;

    constructor(inputMgr: InputKeyboardManager) {
        super(inputMgr)
    }

    setup() {


        // test MATTER-JS
        this.obstacle = new Graphics();
        this.obstacle.beginFill(0xff0000);
        this.obstacle.drawRect(0, 0, 200, 100);
        this.addChild(this.obstacle)
        // rigidBody
        const obstacleRigidBody = Matter.Bodies.rectangle(100, 50, 200, 100, {
            isStatic: true,
            label: "Obstacle"
        });
        Matter.Composite.add($PE.physics.physicsEngine.world, obstacleRigidBody);


        this.player = new Player('Player', 'player')
        $PE.camera.focusOn(this.player, this)

        // get the reference of the objecty in the gameObjects repository
        $PE.log('Test getObjectByName: ', $PE.getObjectByName('Player'));
        $PE.log('Test getGroup: ', $PE.getGroup('Enemy'));

        // Creazione del mirino
        this.crosshair = new Graphics();
        this.crosshair.lineStyle(2, 0xFFFFFF, 1);
        this.crosshair.moveTo(-15, 0);
        this.crosshair.lineTo(15, 0);
        this.crosshair.moveTo(0, -15);
        this.crosshair.lineTo(0, 15);
        this.crosshair.position.set($PE.app.screen.width / 2, $PE.app.screen.height / 2);
        this.addChild(this.crosshair);

        // Nascondere l'icona del mouse usando CSS
        $PE.app.view.style.cursor = 'none';
    }

    update(delta: number) {
        // PixiEngine.log(PixiEngine.time.getFrame().toString())
        const dt = $PE.time.getDeltaTime()

        // rotate player to target
        const mousePosition = $PE.mouse.getMouse();
        this.crosshair.position.set(mousePosition.x, mousePosition.y);
        //console.log('Mouse: ', mousePosition.x, mousePosition.y)
        const angle = Math.atan2(mousePosition.y - this.player.sprite.y, mousePosition.x - this.player.sprite.x);
        this.player.sprite.rotation = angle;

        this.player.update(delta)
    }

    destroy() {
        // remove sprites and rigidBodies
    }

    onInputChange(inputs: any): void {
        // updating game speed
        /* if ($PE.input.isMouseButton2Down()) {
            $PE.log('Mouse 1 pressed: Game speed',this.gameSpeed ) 
            this.gameSpeed -= dt
            $PE.time.setGameSpeed(this.gameSpeed)
        }
        if ($PE.input.isMouseButton3Down()) {
             $PE.log('Mouse 1 pressed: Game speed',this.gameSpeed ) 
            this.gameSpeed += dt
            $PE.time.setGameSpeed(this.gameSpeed)
        } */

        if ($PE.input.isKeyDown('Z')) {
            $PE.camera.zoomIn();
        }
        if ($PE.input.isKeyDown('X')) {
            $PE.camera.zoomOut();
        }
        if ($PE.input.isKeyDownForOneShot('N')) {
            $PE.camera.startShake(750, 8); // Durata di 1000 ms e ampiezza in pixel
        }

        /** TEST GAME SPEED*/
        if ($PE.input.isKeyDown('M')) {
            $PE.time.aminateGameSpeed(2)
        }

        /* TEST GAME SPPED CHANGE */
        if ($PE.input.isKeyDownForOneShot('E')) {
            $PE.time.setGameSpeed($PE.time.getGameSpeed() / 2)
        }
        if ($PE.input.isKeyDownForOneShot('R')) {
            $PE.time.setGameSpeed($PE.time.getGameSpeed() * 2)
        }

    }

}