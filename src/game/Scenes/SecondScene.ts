import { Player } from '../entities/player';
import { Enemy } from '../entities/enemy';

import { Graphics, Text } from "pixi.js";
import { PixiEngine as $PE } from "../../engine/Engine";
import { Scene } from "../../engine/Scene";
import { GameObject } from '../../engine/GameObject';
import { EventType, GameEvent, GameEventForGroup } from '../../engine/EventManager';

export class SecondScene extends Scene {

    text: Text

    player: GameObject;
    playerSpeed: number;

    enemy1: GameObject;
    enemy2: GameObject;


    gameSpeed = 1;
    rectangle: Graphics;
    crosshair: Graphics;

    constructor() {
        super()
    }

    setup() {
        // for text see https://codesandbox.io/s/8q7hs?file=/src/Scene.js:218-312
        this.text = new Text("Hello, I move with the elapsedTime \n😀", {
            fontSize: 24,
            lineHeight: 28,
            letterSpacing: 0,
            fill: 0xffffff,
            align: "center"
        });
        this.text.anchor.set(0.5);
        this.text.resolution = 8;
        this.text.x = window.innerWidth / 2;
        this.text.y = window.innerHeight / 2;
        this.addChild(this.text)

        this.player = new Player('Player', 'player')
        $PE.camera.focusOn(this.player, this)

        this.enemy1 = new Enemy('Nemico1', 'player')
        this.enemy2 = new Enemy('Nemico2', 'player')
        this.enemy1.entity.x = 100

        // rettangolo
        this.rectangle = new Graphics();
        this.rectangle.beginFill(0xff0000);
        this.rectangle.drawRect(0, 0, 200, 100);
        this.addChild(this.rectangle)

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
        this.text.x = Math.sin($PE.time.getElapsedTime()) * window.innerWidth / 8;

        // rotate player to target
        const mousePosition = $PE.input.getMouse();
        this.crosshair.position.set(mousePosition.x, mousePosition.y);
        const angle = Math.atan2(mousePosition.y - this.player.entity.y, mousePosition.x - this.player.entity.x);
        this.player.entity.rotation = angle;

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
        if ($PE.input.isKeyDown('N')) {
            $PE.camera.startShake(750, 8); // Durata di 1000 ms e ampiezza in pixel
        }

        // test zoomTo
        if ($PE.input.isKeyDown('M')) {
            $PE.camera.zoomTo($PE.camera.zoomLevel > 1 ? $PE.camera.zoomLevel - 0.5 : $PE.camera.zoomLevel + 0.5, 2000); // Zoom in di 0.2 e durata di 1000 ms
        }

        // test change camera target
        if ($PE.input.isKeyDown('O')) {
            const target = $PE.camera.target.name === 'Player' ? this.enemy1 : this.player
            $PE.camera.focusOn(target, this)
        }

        // test event to single entity
        if ($PE.input.isKeyDown('E')) {
            $PE.events.sendEvent(new GameEvent(EventType.Pickup, this.player, this.enemy1, { test: 'test GameEvent' }))
        }
        // test event to group of entity
        if ($PE.input.isKeyDown('R')) {
            $PE.events.sendEvent(new GameEventForGroup('Enemy', EventType.Pickup, this.player, { test: 'test GameEventForGroup' }))
        }


        this.player.update(delta)
    }

    destroy() {

    }

}