import { MyEngine2D } from './Engine';
import { GameObject } from './GameObject'
import { BaseEventType, BasePayload } from './models/events';



// Definizione dell'oggetto evento
export class GameEvent<Payload, EventType> {
    constructor(
        public eventType: EventType,
        public sender: GameObject,
        public receiver: GameObject,
        public payload: Payload
    ) { }
}

export class GameEventForGroup<Payload, EventType> {
    constructor(
        public groupName: string,
        public eventType: EventType,
        public sender: GameObject,
        public payload: Payload
    ) {
    }
}

/**
 * Manage custom events
 * the PIXI event system is not used. EventManager has more power 
 * (events for groups, sender, receiver, etc) 
 */
export class EventManager {

    private eventQueue: (GameEvent<BasePayload, BaseEventType> | GameEventForGroup<BasePayload, BaseEventType>)[] = [];

    constructor(public engine: typeof MyEngine2D) { }

    /**
     * Sends an event to the event queue.
     *
     * @param {GameEvent<BasePayload, BaseEventType> | GameEventForGroup<BasePayload, BaseEventType>} event - The event to be sent.
     */
    sendEvent(event: GameEvent<BasePayload, BaseEventType> | GameEventForGroup<BasePayload, BaseEventType>) {
        this.eventQueue.push(event);
    }

    processEvents() {
        while (this.eventQueue.length > 0) {
            const event = this.eventQueue.shift();
            if (event) {
                // group
                if (event instanceof GameEventForGroup) {
                    const group = this.engine.getRepos().gameObjectsGroups[event.groupName];
                    if (group) {
                        for (const receiver of group) {
                            receiver.onEventHandler(event);
                        }
                    }
                } else {
                    // single entity
                    const receiver = this.engine.getRepos().getObjectById(event.receiver?.id);
                    if (receiver) {
                        receiver.onEventHandler(event);
                    }
                }
            }
        }
    }

}

