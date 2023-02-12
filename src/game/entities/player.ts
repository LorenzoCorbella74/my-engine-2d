import { PixiEngine as $PE } from "../../engine/Engine";
import { GameObjectEntity, GameObject } from "../../engine/GameObject"

@GameObjectEntity
export class Player extends GameObject {

    playerSpeed: number;

    constructor(name, spriteName){
        super(name, spriteName);

        this.entity.x = window.innerWidth / 2;
        this.entity.y = window.innerHeight / 2 -100;
        this.playerSpeed = 150; // 150 px/sec
    }

    update(){
        let dt = $PE.time.getDeltaTime()
        // PLayer movement
        if($PE.input.isKeyDown('UP')){
            this.entity.y -=  this.playerSpeed* dt;
        }
        if($PE.input.isKeyDown('DOWN')){
            this.entity.y +=  this.playerSpeed* dt;
        }
        if($PE.input.isKeyDown('RIGHT')){
            this.entity.x +=  this.playerSpeed* dt;
        }
        if($PE.input.isKeyDown('LEFT')){
            this.entity.x -=  this.playerSpeed* dt;
        }
    }



}