import { GameEvent, GameEventForGroup } from "./EventManager";
import { GameObject } from "./GameObject"
import { Entity } from './decorators';
import { BasePayload, BaseEventType } from "./models/events";


export const GAMEROOT = 'GAME-OBJECT-ROOT'

export type GameState = {
    [key: string]: any
}

@Entity()
export class GameRoot extends GameObject {

    state: GameState = {}

    constructor(name: string = GAMEROOT) {
        super(name);
    }

    // TODO: capire cosa farci...
    setState(state: GameState) {
        this.state = Object.assign({}, this.state, state)
    }

    resetState() {
        this.state = {}
    }

    onEventHandler(event: GameEvent<BasePayload, BaseEventType> | GameEventForGroup<BasePayload, BaseEventType>): void {

    }
}