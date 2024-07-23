import { Body, Query, Engine, Events, Composite, Render } from 'matter-js';
import { MyEngine2D } from './Engine'
import { GameEvent } from './EventManager';
import { GameObject } from './GameObject';
import { GROUP, RigidBodyComponent } from './components/rigidBody';
import { BaseEventType, BasePayload } from './models/events';
import { Trigger } from './templates/trigger';
import { DefaultComponentNames } from './models/component-names.enum';

/**
 * Manages the physics simulation for the game.
 */
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
                    width: this.engine.app.canvas.width,
                    height: this.engine.app.canvas.height,
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

    /**
     * Sets the gravity value along the y-axis for the physics engine.
     * @param y The gravity value along the y-axis.
     */
    setGravity(y: number) {
        this.physicsEngine.gravity.y = y
    }

    /* ---------------------- DEBUG ---------------------- */
    /**
     * Shows the physics canvas if the environment is in development mode.
     */
    showPhisicsCanvas() {
        if (!import.meta.env.DEV) return;
        (document.querySelector('#phisic-debugger canvas') as HTMLCanvasElement).style.display = "block";
        (document.querySelector('#phisic-debugger canvas') as HTMLCanvasElement).style.zIndex = '100';
    }

    /**
     * Hides the physics canvas if the application is not in development mode.
     */
    hidePhisicsCanvas() {
        if (!import.meta.env.DEV) return;
        (document.querySelector('#phisic-debugger canvas') as HTMLCanvasElement).style.display = "none";
        (document.querySelector('#phisic-debugger canvas') as HTMLCanvasElement).style.zIndex = '-1';
    }

    /* --------------------------------------------------- */
    update() {
        Engine.update(this.physicsEngine, 1000 / 60) // this.app.ticker.maxFPS
        // Show phisics simulation in development
        const simulation = (document.querySelector('#phisic-debugger canvas') as HTMLCanvasElement)
        if (import.meta.env.DEV && simulation.style.display === "block" && this.engine.camera.target) {
            this.engine.camera.zoomLevel = 1;
            // simulation.style.translate = `${this.engine.app.screen.width / 2 - (this.engine.camera.target?.x * this.engine.camera.zoomLevel)}px ${this.engine.app.screen.height / 2 - (this.engine.camera.target.y * this.engine.camera.zoomLevel)}px`;
            simulation.style.translate = `${this.engine.camera.container.x}px ${this.engine.camera.container.y}px`;
        }
    }

    /**
     * Remove temporarily a body from the physics engine by setting the group to 0
     * @param body 
     */
    disableCollisions(body: Body | undefined) {
        if (body) {
            body.collisionFilter.category = GROUP.DEFAULT;
        }
    }

    /**
     * Restore the rigid body to a Body by setting the appropriate collision groups
     * @param body 
     * @param groups 
     */
    enableCollisions(body: Body | undefined, groups: number) {
        if (body) {
            body.collisionFilter.category = groups;
        }
    }

    onCollisionStart(event: Matter.IEventCollision<Matter.Engine>) {
        let collision = event.pairs[0]
        let [bodyA, bodyB] = [collision.bodyA, collision.bodyB]
        MyEngine2D.log(`${bodyA.label} starts collision with ${bodyB.label}.`, bodyA, bodyB)
        if (bodyB.label.includes('trigger')) {
            // disable rigid body
            this.disableCollisions(bodyB)
            // RUN TRIGGER Callback only once
            const trigger = MyEngine2D.getEntityByName(bodyB.label) as Trigger
            if (!trigger.fired) {
                trigger.fired = true;
                trigger.callback();
            }
        } else {
            // SEND EVENT TO TARGET TODO: only if of a specific type (walls do not send collision events...)
            const colisionEvent = new GameEvent<BasePayload, BaseEventType>(
                MyEngine2D.config.events?.Collision,
                MyEngine2D.getEntityByName(bodyA.label)!,
                MyEngine2D.getEntityByName(bodyB.label)!,
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
        const from = fromObj.getComponent<RigidBodyComponent>(DefaultComponentNames.RigidBody);
        const to = toObj.getComponent<RigidBodyComponent>(DefaultComponentNames.RigidBody);
        if (from?.rigidBody && to?.rigidBody) {
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