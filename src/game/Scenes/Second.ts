import { Player } from './../entities/player';
import { Enemy } from './../entities/enemy';

import { Graphics, Text } from "pixi.js";
import { PixiEngine as $PE } from "../../engine/Engine";
import { Scene } from "../../engine/Scene";
import { GameObject } from '../../engine/GameObject';

export class SecondScene extends Scene {

    text: Text

    player: GameObject;
    enemy: GameObject;

    playerSpeed: number;

    gameSpeed = 1;
    rectangle: Graphics;

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

        this.player = new Player('Lorenzo', 'player')
        this.enemy = new Enemy('Nemico', 'player')
        $PE.camera.focusOn(this.player, this)



        // rettangolo
        this.rectangle = new Graphics();
        this.rectangle.beginFill(0xff0000);
        this.rectangle.drawRect(0, 0, 200, 100);
        this.addChild(this.rectangle)

        // get the reference of the objecty in the gameObjects repository
        $PE.log('Player', $PE.getObjectByName('Lorenzo'));
    }

    update(delta: number) {
        // PixiEngine.log(PixiEngine.time.getFrame().toString())
        const dt = $PE.time.getDeltaTime()
        this.text.x = Math.sin($PE.time.getElapsedTime()) * window.innerWidth / 8;

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
            const target = $PE.camera.target.name === 'Lorenzo' ? this.enemy : this.player
            $PE.camera.focusOn(target, this)
        }

        this.player.update(delta)
    }

    destroy() {

    }

}