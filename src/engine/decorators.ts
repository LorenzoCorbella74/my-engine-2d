import { PixiEngine } from './Engine';
import { Body, Bodies, World } from 'matter-js';

/**
 * GameObjectEntity decorator.
 * @description put the instance with a generated id in the objects repositories
 */
export function GameObjectEntity(target: any) {
    const original = target;

    // si decora la classe originale
    const newConstructor: any = function (...args: any[]) {
        // si istanzia la classe decorata
        const instance = new original(...args);

        instance.id = Math.random().toString(36).substring(2, 15); // `${Date.now()}${Math.random()*1000000}`;
        // si registra nel objects repository
        PixiEngine.repo.gameObjectsIdMap.set(instance.id, instance);
        PixiEngine.repo.gameObjectsNameMap.set(instance.name, instance);
        PixiEngine.repo.gameObjectsIdNameMap.set(instance.id, instance.name);
        PixiEngine.scenes.currentScene.addChild(instance.sprite);
        // ritorna l'istanza
        return instance;
    };

    newConstructor.prototype = original.prototype;
    return newConstructor;
}

/**
 * GameObjectGroup decorator.
 * @description put the instance inside an object group repository
 */
export function GameObjectGroup(groupName: string) {

    return function (target: any) {
        const original = target;

        // si decora la classe originale
        const newConstructor: any = function (...args: any[]) {
            // si istanzia la classe decorata
            const instance = new original(...args);

            // si registra nel objects repository
            if (!PixiEngine.repo.gameObjectsGroups[groupName]) {
                PixiEngine.repo.gameObjectsGroups[groupName] = [];
            }
            PixiEngine.repo.gameObjectsGroups[groupName].push(instance);

            // ritorna l'istanza
            return instance;
        };

        newConstructor.prototype = original.prototype;
        return newConstructor;
    }
}



// Opzioni per il decoratore
interface RigidBodyOptions {
    shape: 'rectangle' | 'circle' | 'polygon';
    isStatic: boolean;
}

// Decoratore Matter.js per GameObject
export function RigidBody(options: RigidBodyOptions) {
    return function (target: any) {
        return class extends target {
            /* private */ rigidBody: Body | null = null;

            constructor(...args: any[]) {
                super(...args);
                this.attachToMatterJs(options);
            }

            /* private */ attachToMatterJs(options: RigidBodyOptions) {
                const { shape, isStatic } = options;

                // Crea il corpo Matter.js in base alle opzioni
                if (shape === 'rectangle') {
                    this.rigidBody = Bodies.rectangle(this.x, this.y, this.width, this.height, { isStatic });
                } else if (shape === 'circle') {
                    this.rigidBody = Bodies.circle(this.x, this.y, this.radius, { isStatic });
                } else if (shape === 'polygon') {
                    // Crea un poligono personalizzato in base alle tue esigenze
                }

                // Aggiungi il corpo Matter.js al mondo
                if (this.rigidBody) {
                    World.add(PixiEngine.physics.physicsEngine.world, this.rigidBody);
                }
            }

            destroy() {
                super.destroy();
                if (this.rigidBody) {
                    World.remove(PixiEngine.physics.physicsEngine.world, this.rigidBody);
                }
            }
        };
    };
}



