import { Component } from './Component';
import { PixiEngine } from './Engine';
import { EventType, GameEvent } from './EventManager';
import { GameObject } from './GameObject';

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
            /* if (instance.spriteName) {
                PixiEngine.scenes.currentScene.addChild(instance.sprite);
            } */

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

/*
// IL decoratore @LogExecutionTime calcola il tempo necessario a eseguire una funzione
    class MyClass {
        @LogExecutionTime
        slowFunction() {
            for (let i = 0; i < 1e7; i++) {}
        }
    }
*/
export function LogExecutionTime(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
        const startTime = performance.now();
        const result = originalMethod.apply(this, args);
        const endTime = performance.now();
        PixiEngine.log(`${propertyKey} took ${endTime - startTime} milliseconds.`);
        return result;
    };
}

/*
    // IL decoratore @updateUI permette di mandare degli eventi ai gameobject specificati quando il valore cambia
    class MyClass {
        @updateUI(['playerUI', 'game'])
        myProperty: number = 0;
    }
*/
export function updateUI(entitiesName: string[]) {
    return function (target: any, propertyKey: string) {
        let previousValue: any;

        const getter = function () {
            return previousValue;
        };

        const setter = function (newVal: any) {
            if (previousValue !== newVal) {
                previousValue = newVal;

                let origin: GameObject | Component;
                if (target instanceof GameObject) {
                    origin = target
                } else if (target instanceof Component) {
                    origin = target.entity
                } else {
                    throw new Error('updateUI can be used with GameObject or single Component instances.')
                }
                // Invia l'evento a ciascuna delle entità specificate nella lista
                for (const name of entitiesName) {
                    // events are sent to GameObject only !
                    PixiEngine.events.sendEvent(new GameEvent(EventType.UpdateForUI, origin, PixiEngine.getObjectByName(name), {
                        [propertyKey]: newVal
                    }));
                }
            }
        };
        // Rimpiazza la proprietà con il getter e il setter personalizzati
        Object.defineProperty(target, propertyKey, {
            get: getter,
            set: setter,
            enumerable: true,
            configurable: true,
        });
    };
}




