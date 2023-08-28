import { Body, Bodies, World, Query, Engine, Events, Composite } from 'matter-js';
import { PixiEngine } from './Engine'
import { EventType, GameEvent } from './EventManager';
import { GameObject } from './GameObject';
import { Graphics } from 'pixi.js';

import { GROUP } from './decorators';



export type GraphicsWithPhisics = Graphics & {

    rigidBody: Body
}

export class PhysicManager {

    physicsEngine: Matter.Engine = null

    constructor(/* public engine: Engine */) {
        /*  this.engine = engine; */
        this.physicsEngine = Engine.create()

        this.physicsEngine.gravity.y = 0;
        Events.on(this.physicsEngine, 'collisionStart', (event) => this.onCollisionStart(event))
        Events.on(this.physicsEngine, 'collisionEnd', (event) => this.onCollisionEnd(event))
        Events.on(this.physicsEngine, 'collisionActive', (event) => this.onCollisionStart(event))
    }

    update() {
        Engine.update(this.physicsEngine, 1000 / 60)
    }

    // Funzione per rimuovere temporaneamente un corpo dal mondo
    disableCollisions(body: Body,) {
        // Imposta il gruppo su zero per disabilitare temporaneamente le collisioni
        body.collisionFilter.category = GROUP.DEFAULT;
    }

    // Funzione per riabilitare le collisioni di un corpo
    enableCollisions(body: Body, groups: number) {
        body.collisionFilter.category = groups;
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

    // Funzione per verificare la visibilità tra due GameObject
    hasLineOfSight(fromObj: GameObject | GraphicsWithPhisics, toObj: GameObject | GraphicsWithPhisics): boolean {
        if (fromObj.rigidBody && toObj.rigidBody) {
            let collisions = Query.ray(
                Composite.allBodies(PixiEngine.physics.physicsEngine.world),
                fromObj.rigidBody.position,
                toObj.rigidBody.position
            );
            collisions = collisions.filter(collision => ![fromObj.rigidBody.label, toObj.rigidBody.label].includes(collision.bodyA.label));
            return collisions.length === 0;
        }
        return false;
    }

}