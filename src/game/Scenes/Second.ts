import { Sprite, Text } from "pixi.js";
import { PixiEngine as $PE } from "../../engine/Engine";
import { Scene } from "../../engine/SceneManager";

export class SecondScene extends Scene {

    text: Text

    player: Sprite;
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

        this.player = $PE.getAsset("player")
        this.player.x = window.innerWidth / 2;
        this.player.y = window.innerHeight / 2 -100;
        this.playerSpeed = 150; // 150 px/sec
        this.addChild(this.player);
    }

    update(delta: number) {
        // PixiEngine.log(PixiEngine.time.getFrame().toString())
        const dt = $PE.time.getDeltaTime()
        this.text.x = Math.sin($PE.time.getElapsedTime()) * window.innerWidth / 2;

        // PLayer movement
        if($PE.input.isKeyDown('UP')){
            this.player.y -=  this.playerSpeed* dt;
        }
        if($PE.input.isKeyDown('DOWN')){
            this.player.y +=  this.playerSpeed* dt;
        }
        if($PE.input.isKeyDown('RIGHT')){
            this.player.x +=  this.playerSpeed* dt;
        }
        if($PE.input.isKeyDown('LEFT')){
            this.player.x -=  this.playerSpeed* dt;
        }

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

    }

    destroy() {
        
    }

}