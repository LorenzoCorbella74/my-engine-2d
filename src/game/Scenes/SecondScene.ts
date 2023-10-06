import { Player } from '../entities/player';
import { Enemy } from '../entities/enemy';

import { Graphics, Text } from "pixi.js";
import { MyEngine2D } from "../../engine/Engine";
import { Scene } from "../../engine/Scene";
import { GameObject } from '../../engine/GameObject';
import { GameEvent, GameEventForGroup } from '../../engine/EventManager';
import { RigidBodyComponent } from '../../engine/components/rigidBody';

import { Power2 } from 'gsap'

export class SecondScene extends Scene {

    text!: Text
    textCoord!: Text

    player!: GameObject;
    enemy1!: GameObject;

    crossHair!: Graphics;

    constructor() {
        super(MyEngine2D)
    }

    async init() {
        await this.engine.loader.loadAssetsGroup('group2')

        // testing second load...
        const textFormat = this.engine.getAsset('text-format');
        // for text see https://codesandbox.io/s/8q7hs?file=/src/Scene.js:218-312
        this.text = new Text("Hello, I move with the elapsedTime \n😀", textFormat);
        this.text.anchor.set(0.5);
        this.text.resolution = 8;
        this.text.x = window.innerWidth / 2;
        this.text.y = window.innerHeight / 2;
        this.addChild(this.text)

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

        // PLAYER
        this.player = new Player('Player', 'player')
        this.player.setPosition(300, 100); // update player container position
        // Focus on PLayer
        this.engine.camera.focusOn(this.player, this)

        // ENEMY 1
        this.enemy1 = new Enemy('Nemico1', 'color1')
        this.enemy1.setPosition(300, 300);

        // get the reference of the objecty in the gameObjects repository
        this.engine.log('Test getObjectByName: ', this.engine.getObjectByName('Player'));
        this.engine.log('Test getGroup: ', this.engine.getGroup('Enemy'));

        this.crossHair = this.engine.crosshair.activateOnCurrentScene(this);
    }

    update(delta: number) {
        // MyEngine2D.log(MyEngine2D.time.getFrame().toString())
        // const dt = this.engine.time.getDeltaTime()
        this.text.x = Math.sin(this.engine.time.getElapsedTime()) * window.innerWidth / 8;

        // rotate player to target
        const { x, y } = this.engine.mouse.getMouse();
        this.crossHair.position.set(x, y);

        // UI
        const { x: xp, y: yp } = this.player.getComponents<RigidBodyComponent>('RigidBody')[0].rigidBody.position
        this.textCoord.x = Math.ceil(xp)
        this.textCoord.y = Math.ceil(yp) - 32
        this.textCoord.text = `x:${this.textCoord.x} - y:${this.textCoord.y + 32}`

        // DEBUG
        this.textCoord.visible = this.engine.debug

        this.player.update(delta)
        this.enemy1.update(delta)
    }

    destroy() {
        // remove sprites
        this.player.destroy()
        this.enemy1.destroy()
    }

    onInputChange(inputs: any): void {

        if (this.engine.input.isKeyDown('Z')) {
            this.engine.togleDebug()
        }
        if (this.engine.input.isKeyDown('X')) {
            // TODO:
        }
        if (this.engine.input.isKeyDown('N')) {
            this.engine.camera.startShake(750, 8); // Durata di 1000 ms e ampiezza in pixel
        }

        // test zoomTo
        if (this.engine.input.isKeyDown('M')) {
            const ease = Power2.easeOut; // "bounce.out", "expo.out"  "elastic.out(1, 0.3)" 
            this.engine.camera.zoomTo(this.engine.camera.zoomLevel > 1 ? this.engine.camera.zoomLevel - 0.5 : this.engine.camera.zoomLevel + 0.5,
                2, ease);
        }

        // test change camera target
        if (this.engine.input.isKeyDown('O')) {
            const target = this.engine.camera.target?.name === 'Player' ? this.enemy1 : this.player
            this.engine.camera.focusOn(target, this)
        }

        // test event to single entity
        if (this.engine.input.isKeyDown('E')) {
            this.engine.events.sendEvent(new GameEvent(this.engine.config.events?.Pickup, this.player, this.enemy1, { test: 'test GameEvent' }))
        }
        // test event to group of entity
        if (this.engine.input.isKeyDown('R')) {
            this.engine.events.sendEvent(new GameEventForGroup('Enemy', this.engine.config.events?.Pickup, this.player, { test: 'test GameEventForGroup' }))
        }
    }

}