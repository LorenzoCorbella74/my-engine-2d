import { GameEvent } from "../EventManager"
import { BaseEventType, BasePayload } from "./events"

export interface IGameConditionEntity {
    satisfyWinGameCondition?: () => boolean
    satisfyLoseGameCondition?: () => boolean
    satisfyProgressionGameCondition?: (key: string) => GameEvent<BasePayload, BaseEventType> | null
}