import { PixiEngine } from './Engine';
import { Body, Bodies, World, Composite } from 'matter-js';


type DecoratorOptions = {
    id?: string;
    groupName?: string;
    rigidBody?: RigidBodyOptions;
} | null

// Opzioni per il decoratore
type RigidBodyOptions = {
    shape: 'rectangle' | 'circle' | 'polygon';
    isStatic: boolean;
}

// Decoratore Matter.js per GameObject
export function GameNode(options?: DecoratorOptions) {

    return function (target: any) {
        const original = target;

        // si decora la classe originale
        const newConstructor: any = function (...args: any[]) {
            // si istanzia la classe decorata
            const instance = new original(...args);

            instance.id = options?.id || Math.random().toString(36).substring(2, 15); // `${Date.now()}${Math.random()*1000000}`;
            // si registra nel objects repository
            PixiEngine.repo.gameObjectsIdMap.set(instance.id, instance);
            PixiEngine.repo.gameObjectsNameMap.set(instance.name, instance);
            PixiEngine.repo.gameObjectsIdNameMap.set(instance.id, instance.name);
            PixiEngine.scenes.currentScene.addChild(instance.sprite);

            if (options?.groupName) {
                // si registra nel objects repository
                if (!PixiEngine.repo.gameObjectsGroups[options.groupName]) {
                    PixiEngine.repo.gameObjectsGroups[options.groupName] = [];
                }
                PixiEngine.repo.gameObjectsGroups[options.groupName].push(instance);
            }

            if (options?.rigidBody) {
                // si registra nel objects repository
                const { shape, isStatic } = options.rigidBody;
                const { x = 0, y = 0, width, height } = instance._sprite;

                // Crea il corpo Matter.js in base alle opzioni
                if (shape === 'rectangle') {
                    instance.rigidBody = Bodies.rectangle(x + width / 2, y + height / 2, width, height, { isStatic, friction: 0, label: instance.name });
                } else if (shape === 'circle') {
                    instance.rigidBody = Bodies.circle(x + width / 2, y + height / 2, width, { isStatic, friction: 0, label: instance.name }); // TODO
                } else if (shape === 'polygon') {
                    // Crea un poligono personalizzato in base alle tue esigenze
                }

                // Aggiungi il corpo Matter.js al mondo
                if (instance.rigidBody) {
                    World.add(PixiEngine.physics.physicsEngine.world, instance.rigidBody);
                    instance.removeRigidBody = () => {
                        World.remove(PixiEngine.physics.physicsEngine.world, instance.rigidBody);
                    }
                }
            }

            // ritorna l'istanza
            return instance;
        };

        newConstructor.prototype = original.prototype;
        return newConstructor;
    }
}




