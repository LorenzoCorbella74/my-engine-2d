import { Player } from '../entities/player';
import { Enemy } from '../entities/enemy';

import { Graphics, Text } from "pixi.js";
import { PixiEngine } from "../../engine/Engine";
import { Scene } from "../../engine/Scene";
import { GameObject } from '../../engine/GameObject';
import { EventType, GameEvent, GameEventForGroup } from '../../engine/EventManager';
import { SpriteComponent } from '../../engine/components/sprite';
import { RigidBodyComponent } from '../../engine/components/rigidBody';

export class SecondScene extends Scene {

    text: Text
    textCoord: Text

    player: GameObject;
    playerSpeed: number;

    enemy1: GameObject;
    enemy2: GameObject;

    crossHair: Graphics;

    constructor() {
        super(PixiEngine)
    }

    init() {
        // for text see https://codesandbox.io/s/8q7hs?file=/src/Scene.js:218-312
        this.text = new Text("Hello, I move with the elapsedTime \n😀", {
            fontSize: 18,
            lineHeight: 24,
            letterSpacing: 0,
            fill: 0xffffff,
            align: "center"
        });
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
        const player = this.player.getComponents<SpriteComponent>('Sprite')[0]
        player.setPosition(window.innerWidth / 2, window.innerHeight / 2 - 100)


        this.engine.camera.focusOn(this.player, this)

        // ENEMY 1
        this.enemy1 = new Enemy('Nemico1', 'color1')
        const enemy1 = this.enemy1.getComponents<SpriteComponent>('Sprite')[0];
        enemy1.setPosition(200, 200);

        // ENEMY 2
        this.enemy2 = new Enemy('Nemico2', 'color2')
        const enemy2 = this.enemy1.getComponents<SpriteComponent>('Sprite')[0];
        enemy2.setPosition(500, 500);

        // get the reference of the objecty in the gameObjects repository
        this.engine.log('Test getObjectByName: ', this.engine.getObjectByName('Player'));
        this.engine.log('Test getGroup: ', this.engine.getGroup('Enemy'));

        this.crossHair = this.engine.crosshair.activateOnCurrentScene(this);
    }

    update(delta: number) {
        // PixiEngine.log(PixiEngine.time.getFrame().toString())
        const dt = this.engine.time.getDeltaTime()
        this.text.x = Math.sin(this.engine.time.getElapsedTime()) * window.innerWidth / 8;

        // rotate player to target
        const { x, y } = this.engine.mouse.getMouse();
        this.crossHair.position.set(x, y);

        this.player.update(delta)

        // UI
        const { x: xp, y: yp } = this.player.getComponents<RigidBodyComponent>('RigidBody')[0].rigidBody.position
        this.textCoord.x = Math.ceil(xp)
        this.textCoord.y = Math.ceil(yp) - 16
        this.textCoord.text = `x:${this.textCoord.x} - y:${this.textCoord.y}`

        this.enemy1.update(delta)
        this.enemy2.update(delta)
    }

    destroy() {
        // remove sprites
        this.player.destroy()
        this.enemy1.destroy()
        this.enemy2.destroy()
    }

    onInputChange(inputs: any): void {

        if (this.engine.input.isKeyDown('Z')) {
            this.engine.camera.zoomIn();
        }
        if (this.engine.input.isKeyDown('X')) {
            this.engine.camera.zoomOut();
        }
        if (this.engine.input.isKeyDownForOneShot('N')) {
            this.engine.camera.startShake(750, 8); // Durata di 1000 ms e ampiezza in pixel
        }

        // test zoomTo
        if (this.engine.input.isKeyDown('M')) {
            this.engine.camera.zoomTo(this.engine.camera.zoomLevel > 1 ? this.engine.camera.zoomLevel - 0.5 : this.engine.camera.zoomLevel + 0.5, 2000); // Zoom in di 0.2 e durata di 1000 ms
        }

        // test change camera target
        if (this.engine.input.isKeyDownForOneShot('O')) {
            const target = this.engine.camera.target.name === 'Player' ? this.enemy1 : this.player
            this.engine.camera.focusOn(target, this)
        }

        // test event to single entity
        if (this.engine.input.isKeyDownForOneShot('E')) {
            this.engine.events.sendEvent(new GameEvent(EventType.Pickup, this.player, this.enemy1, { test: 'test GameEvent' }))
        }
        // test event to group of entity
        if (this.engine.input.isKeyDownForOneShot('R')) {
            this.engine.events.sendEvent(new GameEventForGroup('Enemy', EventType.Pickup, this.player, { test: 'test GameEventForGroup' }))
        }
    }

}