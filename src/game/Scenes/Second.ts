import { Player } from './../entities/player';
import { Sprite, Text } from "pixi.js";
import { PixiEngine as $PE } from "../../engine/Engine";
import { Scene } from "../../engine/SceneManager";
import { GameObject } from '../../engine/GameObject';

export class SecondScene extends Scene {

    text: Text

    player: GameObject;
    playerSpeed: number;

    gameSpeed = 1;

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

        this.player = new Player('Lorenzo','player')

        // get the reference of the objecty in the gameObjects repository
        $PE.log('Player', $PE.getObjectByName('Lorenzo'));
    }

    update(delta: number) {
        // PixiEngine.log(PixiEngine.time.getFrame().toString())
        const dt = $PE.time.getDeltaTime()
        this.text.x = Math.sin($PE.time.getElapsedTime()) * window.innerWidth / 2;

        // updating game speed
        if($PE.input.isMouseButton1Down()){
            // $PE.log('Mouse 1 pressed: Game speed',this.gameSpeed ) 
            this.gameSpeed -= dt
            $PE.time.setGameSpeed(this.gameSpeed )
        }
        if($PE.input.isMouseButton3Down()){
            // $PE.log('Mouse 1 pressed: Game speed',this.gameSpeed ) 
            this.gameSpeed += dt
            $PE.time.setGameSpeed(this.gameSpeed )
        }

        this.player.update()



    }

    destroy() {
        
    }

}