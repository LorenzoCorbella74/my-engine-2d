import { MyEngine2D } from "./Engine";
import { GameEvent } from "./EventManager";
import { GameObject } from "./GameObject";
import { GAMEROOT } from "./game-root";
import { IGameConditionEntity } from "./models/condition-logic";

export class GameLogic {
    private winConditions: IGameConditionEntity[];
    private loseConditions: IGameConditionEntity[];
    private eventConditions: IGameConditionEntity[];

    constructor(public engine: typeof MyEngine2D) {
        this.winConditions = [];
        this.loseConditions = [];
        this.eventConditions = [];
    }

    registerGameLogicConditions(obj: any, condition: 'WIN' | 'LOSE' | 'EVENT' = 'WIN') {
        switch (condition) {
            case 'WIN': this.winConditions.push(obj); break;
            case 'LOSE': this.loseConditions.push(obj); break;
            case 'EVENT': this.eventConditions.push(obj); break
            default: break;
        }
    }

    update() {
        let hasWon = false;
        let hasLost = false;
        for (const obj of this.winConditions) {
            if (obj.satisfyWinGameCondition && obj.satisfyWinGameCondition()) {
                hasWon = true;
                let game = this.engine.getEntityByName(GAMEROOT) as GameObject;
                this.engine.events.sendEvent(new GameEvent(MyEngine2D.config.events?.GameWon, game, game, { empty: true }));
                break;
            }
        }
        if (!hasWon) {
            for (const obj of this.loseConditions) {
                if (obj.satisfyLoseGameCondition && obj.satisfyLoseGameCondition()) {
                    hasLost = true;
                    let game = this.engine.getEntityByName(GAMEROOT) as GameObject;
                    this.engine.events.sendEvent(new GameEvent(MyEngine2D.config.events?.GameLose, game, game, { empty: true }));
                    break;
                }
            }
        }
        if (!hasWon && !hasLost) {
            for (const obj of this.eventConditions) {
                let event = obj.satisfyEventGameCondition && obj.satisfyEventGameCondition()
                if (event) {
                    let game = this.engine.getEntityByName(GAMEROOT) as GameObject;
                    this.engine.events.sendEvent(new GameEvent(MyEngine2D.config.events?.GameEvent, game, game, { empty: true }));
                    break;
                }
            }
        }
    }
}