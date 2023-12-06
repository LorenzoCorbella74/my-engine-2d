import { Body, Query, Engine, Events, Composite, Render } from 'matter-js';
import { MyEngine2D } from './Engine'
import { GameEvent } from './EventManager';
import { GameObject } from './GameObject';
import { GROUP, RigidBodyComponent } from './components/rigidBody';
import { BaseEventType, BasePayload } from './models/events';
import { Trigger } from './templates/trigger';

export class PhysicManager {

    physicsEngine!: Engine;
    render!: Render;

    constructor(public engine: typeof MyEngine2D) {

        this.physicsEngine = Engine.create()

        if (import.meta.env.DEV) {
            this.render = Render.create({
                element: document.querySelector('#phisic-debugger') as HTMLCanvasElement,
                engine: this.physicsEngine,
                options: {
                    width: this.engine.app.view.width,
                    height: this.engine.app.view.height,
                    wireframes: true,
                    background: 'transparent',
                    wireframeBackground: 'transparent'
                }
            });
            Render.run(this.render);
        }

        this.physicsEngine.gravity.y = 0; // default is 0 as for a TOP DOWN SHOOTER Gane

        Events.on(this.physicsEngine, 'collisionStart', (event) => this.onCollisionStart(event))
        Events.on(this.physicsEngine, 'collisionEnd', (event) => this.onCollisionEnd(event))
        Events.on(this.physicsEngine, 'collisionActive', (event) => this.onCollisionStart(event))
    }

    setGravity(y: number) {
        this.physicsEngine.gravity.y = y
    }

    /* ---------------------- DEBUG ---------------------- */
    showPhisicsCanvas() {
        if (!import.meta.env.DEV) return;
        (document.querySelector('#phisic-debugger canvas') as HTMLCanvasElement).style.display = "block";
        (document.querySelector('#phisic-debugger canvas') as HTMLCanvasElement).style.zIndex = '100';
    }

    hidePhisicsCanvas() {
        if (!import.meta.env.DEV) return;
        (document.querySelector('#phisic-debugger canvas') as HTMLCanvasElement).style.display = "none";
        (document.querySelector('#phisic-debugger canvas') as HTMLCanvasElement).style.zIndex = '-1';
    }

    /* --------------------------------------------------- */
    update() {
        Engine.update(this.physicsEngine, 1000 / 60) // this.app.ticker.maxFPS
        // Show phisics simulation in development
        if (import.meta.env.DEV && (document.querySelector('#phisic-debugger canvas') as HTMLCanvasElement).style.display !== "none" && this.engine.camera.target) {
            this.engine.camera.zoomLevel = 1;
            (document.querySelector('#phisic-debugger canvas') as HTMLCanvasElement).style.translate = `${this.engine.app.screen.width / 2 - (this.engine.camera.target?.x * this.engine.camera.zoomLevel)}px ${this.engine.app.screen.height / 2 - (this.engine.camera.target.y * this.engine.camera.zoomLevel)}px`;
        }
    }

    /**
     * Remove temporarily a body from the physics engine by setting the group to 0
     * @param body 
     */
    disableCollisions(body: Body) {
        body.collisionFilter.category = GROUP.DEFAULT;
    }

    /**
     * Restore the rigid body to a Body by setting the appropriate collision groups
     * @param body 
     * @param groups 
     */
    enableCollisions(body: Body, groups: number) {
        body.collisionFilter.category = groups;
    }

    onCollisionStart(event: Matter.IEventCollision<Matter.Engine>) {
        let collision = event.pairs[0]
        let [bodyA, bodyB] = [collision.bodyA, collision.bodyB]
        MyEngine2D.log(`${bodyA.label} starts collision with ${bodyB.label}.`, bodyA, bodyB)
        if (bodyB.label.includes('trigger')) {
            // disable rigid body
            this.disableCollisions(bodyB)
            // RUN TRIGGER Callback only once
            const trigger = MyEngine2D.getObjectByName(bodyB.label) as Trigger
            if (!trigger.fired) {
                trigger.fired = true;
                trigger.callback();
            }
        } else {
            // SEND EVENT TO TARGET TODO: only if of a specific type (walls do not send collision events...)
            const colisionEvent = new GameEvent<BasePayload, BaseEventType>(
                MyEngine2D.config.events?.Collision,
                MyEngine2D.getObjectByName(bodyA.label)!,
                MyEngine2D.getObjectByName(bodyB.label)!,
                { empty: true },
            );
            MyEngine2D.events.sendEvent(colisionEvent);
        }
    }

    onCollisionActive(event: Matter.IEventCollision<Matter.Engine>) {
        let collision = event.pairs[0]
        let [bodyA, bodyB] = [collision.bodyA, collision.bodyB]
        MyEngine2D.log(`${bodyA.label} has an active collision with ${bodyB.label}.`, bodyA, bodyB)
    }

    onCollisionEnd(event: Matter.IEventCollision<Matter.Engine>) {
        let collision = event.pairs[0]
        let [bodyA, bodyB] = [collision.bodyA, collision.bodyB]
        MyEngine2D.log(`${bodyA.label} ends collision with ${bodyB.label}.`, bodyA, bodyB)
    }

    /**
     * Line of sight from a body to another
     * @param fromObj 
     * @param toObj 
     * @returns 
     */
    hasLineOfSight(fromObj: GameObject, toObj: GameObject): boolean {
        const from = fromObj.getComponents<RigidBodyComponent>('RigidBody')[0];
        const to = toObj.getComponents<RigidBodyComponent>('RigidBody')[0];
        if (from.rigidBody && to.rigidBody) {
            let collisions = Query.ray(
                Composite.allBodies(MyEngine2D.physics.physicsEngine.world),
                from.rigidBody.position,
                to.rigidBody.position
            );
            collisions = collisions.filter(collision => ![from.rigidBody.label, to.rigidBody.label].includes(collision.bodyA.label));
            return collisions.length === 0;
        }
        return false;
    }
}