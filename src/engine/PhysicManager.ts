import * as Matter from 'matter-js';
/* import { Engine } from './Engine' */

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
        // console.log(`${bodyA.label} ${bodyA.id} hits ${bodyB.label} ${bodyA.id}`)
        console.log(bodyA, bodyB)
    }
    onCollisionActive(event: Matter.IEventCollision<Matter.Engine>) {
        let collision = event.pairs[0]
        let [bodyA, bodyB] = [collision.bodyA, collision.bodyB]
        console.log(`${bodyA.label} ${bodyA.id} hits ${bodyB.label} ${bodyA.id}`)
        console.log(bodyA, bodyB)
    }
    onCollisionEnd(event: Matter.IEventCollision<Matter.Engine>) {
        let collision = event.pairs[0]
        let [bodyA, bodyB] = [collision.bodyA, collision.bodyB]
        // console.log(`${bodyA.label} ${bodyA.id} hits ${bodyB.label} ${bodyA.id}`)
        console.log(bodyA, bodyB)
    }

}