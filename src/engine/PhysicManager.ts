import { Body, Query, Engine, Events, Composite, Render } from 'matter-js';
import { PixiEngine } from './Engine'
import { EventType, GameEvent } from './EventManager';
import { GameObject } from './GameObject';
import { Application, Graphics } from 'pixi.js';
import { GROUP, RigidBodyComponent } from './components/rigidBody';

export type GraphicsWithPhisics = Graphics & {
    rigidBody: Body
}

export class PhysicManager {

    physicsEngine: Engine = null
    render: Render;

    constructor(public app: Application) {

        this.physicsEngine = Engine.create()

        this.render = Render.create({
            element: document.querySelector('#phisic-debugger'),
            engine: this.physicsEngine,
            options: {
                width: this.app.view.width,
                height: this.app.view.height,
                wireframes: true,
                background: 'transparent',
                wireframeBackground: 'transparent'
            }
        });

        Render.run(this.render);

        this.physicsEngine.gravity.y = 0; // default is 0 as TOP DOWN SHHOTER

        Events.on(this.physicsEngine, 'collisionStart', (event) => this.onCollisionStart(event))
        Events.on(this.physicsEngine, 'collisionEnd', (event) => this.onCollisionEnd(event))
        Events.on(this.physicsEngine, 'collisionActive', (event) => this.onCollisionStart(event))
    }

    setGravity(y: number) {
        this.physicsEngine.gravity.y = y
    }

    /* ---------------------- DEBUG ---------------------- */
    showPhisicsCanvas() {
        (document.querySelector('#phisic-debugger canvas') as HTMLCanvasElement).style.display = "block";
        (document.querySelector('#phisic-debugger canvas') as HTMLCanvasElement).style.zIndex = '100';
    }

    hidePhisicsCanvas() {
        (document.querySelector('#phisic-debugger canvas') as HTMLCanvasElement).style.display = "none";
        (document.querySelector('#phisic-debugger canvas') as HTMLCanvasElement).style.zIndex = '-1';
    }

    /* --------------------------------------------------- */
    update() {
        Engine.update(this.physicsEngine, 1000 / 60)    // TODO: al posto di 60 this.app.ticker.maxFPS ???
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
    hasLineOfSight(fromObj: GameObject /* | GraphicsWithPhisics */, toObj: GameObject /* | GraphicsWithPhisics */): boolean {
        const from = fromObj.getComponents<RigidBodyComponent>('RigidBody')[0];
        const to = fromObj.getComponents<RigidBodyComponent>('RigidBody')[0];
        if (from.rigidBody && to.rigidBody) {
            let collisions = Query.ray(
                Composite.allBodies(PixiEngine.physics.physicsEngine.world),
                from.rigidBody.position,
                to.rigidBody.position
            );
            collisions = collisions.filter(collision => ![from.rigidBody.label, to.rigidBody.label].includes(collision.bodyA.label));
            return collisions.length === 0;
        }
        return false;
    }

}