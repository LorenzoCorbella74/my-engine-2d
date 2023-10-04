import { GameEvent } from "../EventManager";

// Definizione dei tipi di evento
export enum EventType {
    Collision = 'Collision',
    Pickup = 'Pickup',
    CustomEvent = 'CustomEvent',
    UpdateForUI = 'UpdateForUI',
}

export interface IGameObjectEventHandler { onEventHandler: (event: GameEvent<any>) => void }


export type BasePayload = {
    [key: string]: any
}