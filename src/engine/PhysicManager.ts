import * as Matter from 'matter-js';
import { PixiEngine } from './Engine'
import { EventType, GameEvent } from './EventManager';

export class PhysicManager {


    physicsEngine: Matter.Engine = null

    constructor(/* public engine: Engine */) {
        /*  this.engine = engine; */
        this.physicsEngine = Matter.Engine.create()

        this.physicsEngine.gravity.y = 0;
        Matter.Events.on(this.physicsEngine, 'collisionStart', (event) => this.onCollisionStart(event))
        Matter.Events.on(this.physicsEngine, 'collisionEnd', (event) => this.onCollisionEnd(event))
        Matter.Events.on(this.physicsEngine, 'collisionActive', (event) => this.onCollisionStart(event))
    }

    update() {
        Matter.Engine.update(this.physicsEngine, 1000 / 60)
    }

    onCollisionStart(event: Matter.IEventCollision<Matter.Engine>) {
        let collision = event.pairs[0]
        let [bodyA, bodyB] = [collision.bodyA, collision.bodyB]
        console.log(`${bodyA.label} starts collision with ${bodyB.label}.`, bodyA, bodyB)
        const colisionEvent = new GameEvent(
            EventType.Collision,
            PixiEngine.getObjectByName(bodyA.label),
            PixiEngine.getObjectByName(bodyB.label),
            null
        );
        PixiEngine.events.sendEvent(colisionEvent);
    }

    onCollisionActive(event: Matter.IEventCollision<Matter.Engine>) {
        let collision = event.pairs[0]
        let [bodyA, bodyB] = [collision.bodyA, collision.bodyB]
        console.log(`${bodyA.label} has an active collision with ${bodyB.label}.`, bodyA, bodyB)
    }

    onCollisionEnd(event: Matter.IEventCollision<Matter.Engine>) {
        let collision = event.pairs[0]
        let [bodyA, bodyB] = [collision.bodyA, collision.bodyB]
        console.log(`${bodyA.label} ends collision with ${bodyB.label}.`, bodyA, bodyB)
    }

}