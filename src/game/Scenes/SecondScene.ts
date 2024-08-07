import { Player } from '../entities/player';
import { Enemy } from '../entities/enemy';

import { Graphics, Text } from "pixi.js";
import { Scene } from "../../engine/Scene";
import { GameObject } from '../../engine/GameObject';
import { GameEvent, GameEventForGroup } from '../../engine/EventManager';

import { Power2 } from 'gsap'
import { Trigger } from '../../engine/templates/trigger';

export class SecondScene extends Scene {

    text!: Text


    player!: GameObject;
    enemy1!: GameObject;

    testTrigger!: Trigger;

    constructor() {
        super()
    }

    async init() {
        await this.engine.loader.loadAssetsFolder('group2')

        this.engine.ui.hideUILayer('Layer1') // test UI

        // testing second load...
        const textFormat = this.engine.getAsset('text-format');
        // for text see https://codesandbox.io/s/8q7hs?file=/src/Scene.js:218-312
        this.text = new Text({...textFormat, text: "Hello, I move with the elapsedTime \n😀"});
        this.text.anchor.set(0.5);
        this.text.resolution = 8;
        this.text.x = window.innerWidth / 2;
        this.text.y = window.innerHeight / 2;
        this.addChild(this.text)

        // PLAYER
        this.player = new Player('Player', 'player')
        this.player.setPosition(300, 100); // update player container position

        // Focus on PLayer
        this.engine.camera.lockTo(this.player, this)

        // ENEMY 1
        this.enemy1 = new Enemy('Nemico1', 'color1')
        this.enemy1.setPosition(300, 300);

        // get the reference of the objecty in the gameObjects repository
        this.engine.log('Test getObjectByName: ', this.engine.getEntityByName('Player'));
        this.engine.log('Test getGroup: ', this.engine.getEntityGroup('Enemy'));

        // Test engine.locale
        this.engine.log('Test engine.locale: ',
            this.engine.locale.translate('test'),
            this.engine.locale.translate('nested.test'),
            this.engine.locale.translate('test2', { name: 'Lorenzo' })
        );

        this.testTrigger = new Trigger(
            'test-trigger',
            { x: 500, y: 0, width: 300, height: 100 },
            () => console.log('Trigger has been fired', this));


    }

    update(delta: number) {
        this.text.x = Math.sin(this.engine.time.getElapsedTime()) * window.innerWidth / 8;

        // update gameObjects
        super.update(delta)

        if (this.engine.keyboard.iskeyDownOnce('Z')) {
            this.engine.togleDebug()
        }

        if (this.engine.keyboard.iskeyDownOnce('X')) {
            this.engine.camera.moveTo({ x: 100, y: 400 }, 3, Power2.easeIn, () => {
                console.log('camera.moveTo done!')
            })
        }

        /* if (this.engine.keyboard.iskeyDownOnce('B')) {
            console.time('camera.animateOnBezierCurve')
            this.engine.camera.animateOnBezierCurve(this.player, { x: 100, y: 400 }, { x: 300, y: 200 }, { x: 300, y: 400 }, 3, () => {
                console.timeEnd('camera.animateOnBezierCurve')
                console.log('camera.animateOnBezierCurve done!')
            })
        } */

        if (this.engine.keyboard.iskeyDownOnce('B')) {
            console.time('camera.followPath')
            let graphics = new Graphics()
            .moveTo(200, 20)
            .lineTo(200, 200)
                .arcTo(350, 200, 450, 900, 100)
                .lineTo(200, 500)
                .lineTo(700, 100)
                .bezierCurveTo(700, 100, 700, 400, 100, 100)
                .stroke({width:2, color:0xaaaaaa, alpha: 1});
                console.log('graphics.getBounds()!', graphics.getBounds(), /* graphics.graphicsData[0].shape.points */) // 

            let path =[200,20, 200,200, 350, 200, 450, 900, 200, 500, 700, 100, 700, 400, 100, 100]
            this.engine.camera.followPath(path, 3, () => {
                console.timeEnd('camera.followPath')
                console.log('camera.followPath done!')
            })
        }

        if (this.engine.keyboard.iskeyDownOnce('N')) {
            this.engine.camera.shake(750, 8); // Durata di 1000 ms e ampiezza in pixel
        }

        // test zoomTo
        if (this.engine.keyboard.iskeyDownOnce('M')) {
            const ease = Power2.easeOut; // "bounce.out", "expo.out"  "elastic.out(1, 0.3)" 
            this.engine.camera.zoomTo(this.engine.camera.zoomLevel > 1 ?
                this.engine.camera.zoomLevel - 0.5 :
                this.engine.camera.zoomLevel + 0.5,
                2, ease, () => {
                    console.log('camera.zoomTo done!', this.engine.camera.zoomLevel);
                });
        }

        // test change camera target
        if (this.engine.keyboard.iskeyDownOnce('O')) {
            const target = this.engine.camera.target?.name === 'Player' ? this.enemy1 : this.player
            this.engine.camera.lockTo(target, this)
        }

        // test event to single entity
        if (this.engine.keyboard.iskeyDownOnce('E')) {
            this.engine.events.sendEvent(new GameEvent(this.engine.config.events?.Pickup, this.player, this.enemy1, { test: 'test GameEvent' }))
        }
        // test event to group of entity
        if (this.engine.keyboard.iskeyDownOnce('R')) {
            this.engine.events.sendEvent(new GameEventForGroup('Enemy', this.engine.config.events?.Pickup, this.player, { test: 'test GameEventForGroup' }))
        }
    }

}