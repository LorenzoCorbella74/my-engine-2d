import { PixiEngine } from './Engine';
import { GameObject } from './GameObject'

// Definizione dei tipi di evento
export enum EventType {
    Collision = 'Collision',
    Pickup = 'Pickup',
    CustomEvent = 'CustomEvent'
}

export interface IGameObjectEventHandler { onEventHandler: (event: GameEvent<any>) => void }

// Definizione dell'oggetto evento
export class GameEvent<T> {
    constructor(
        public eventType: EventType,
        public sender: GameObject,
        public receiver: GameObject,
        public payload: T
    ) { }
}

export class GameEventForGroup<T> {
    constructor(
        public groupName: string,
        public eventType: EventType,
        public sender: GameObject,
        public payload: T
    ) {
    }
}

export type BasePayload = {
    [key: string]: any
}


export class EventManager {

    private eventQueue: (GameEvent<BasePayload> | GameEventForGroup<BasePayload>)[] = [];
    constructor(public engine: typeof PixiEngine) {

    }

    sendEvent(event: GameEvent<BasePayload> | GameEventForGroup<BasePayload>) {
        this.eventQueue.push(event);
    }

    processEvents() {
        while (this.eventQueue.length > 0) {
            const event = this.eventQueue.shift();
            if (event) {
                // group
                if (event instanceof GameEventForGroup) {
                    const group = this.engine.repo.gameObjectsGroups[event.groupName];
                    if (group) {
                        for (const receiver of group) {
                            receiver.onEventHandler(event);
                        }
                    }
                } else {
                    // single entity
                    const receiver = this.engine.repo.getObjectById(event.receiver?.id);
                    if (receiver) {
                        receiver.onEventHandler(event);
                    }
                }
            }
        }
    }

}