import { GameEvent } from "../EventManager";


export type BasePayload = {
    [key: string]: any
}

export type BaseEventType = {
    [key: string]: any
}

export interface IGameObjectEventHandler {
    onEventHandler: (event: GameEvent<BasePayload, BaseEventType>) => void
}
