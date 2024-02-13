import { GameEvent } from "../EventManager"
import { BaseEventType, BasePayload } from "./events"

export interface IGameConditionEntity {
    satisfyWinGameCondition?: () => boolean
    satisfyLoseGameCondition?: () => boolean
    satisfyEventGameCondition?: () => GameEvent<BasePayload, BaseEventType> | null
}