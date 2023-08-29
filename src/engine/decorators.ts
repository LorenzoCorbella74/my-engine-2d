import { PixiEngine } from './Engine';

type DecoratorOptions = {
    id?: string;
    groupName?: string;
} | null

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

            // ritorna l'istanza
            return instance;
        };

        newConstructor.prototype = original.prototype;
        return newConstructor;
    }
}




