import { MyEngine2D } from "./Engine";
import { GameEvent } from "./EventManager";
import { GameObject } from "./GameObject";

import { GAMEROOT } from "./GameRoot";

/**
 * Represents the game logic for a game.
 */
export class GameLogic {
    private winConditionsObj: GameObject[];
    private loseConditionsObj: GameObject[];
    private progressionConditionsObj: { obj: GameObject, progression: string }[];

    constructor(public engine: typeof MyEngine2D) {
        this.winConditionsObj = [];
        this.loseConditionsObj = [];
        this.progressionConditionsObj = [];
    }

    /**
     * Registers game logic conditions for a GameObject.
     * @param obj The GameObject to register the conditions for.
     * @param condition The condition type ('WIN', 'LOSE', or 'PROGRESSION'). Default is 'WIN'.
     * @param progressionKey The progression key for 'PROGRESSION' condition. Optional.
     */
    registerGameLogicConditions(obj: GameObject, condition: 'WIN' | 'LOSE' | 'PROGRESSION' = 'WIN', progressionKey?: string) {
        switch (condition) {
            case 'WIN': this.winConditionsObj.push(obj); break;
            case 'LOSE': this.loseConditionsObj.push(obj); break;
            case 'PROGRESSION': this.progressionConditionsObj.push({ obj, progression: progressionKey || '' }); break;
            default: break;
        }
    }

    /**
     * Deletes an item from an array.
     * @param array The array to remove the element from.
     * @param element The element to remove from the array.
     */
    private deleteItemFromArray<T>(array: T[], element: T): void {
        const index = array.indexOf(element);
        if (index > -1) {
            array.splice(index, 1);
        }
    }

    /**
     * Updates the game logic by checking win conditions, lose conditions, and game progression conditions.
     * If a win condition is satisfied, a GameWon event is triggered from the obj to the game root.
     * If a lose condition is satisfied, a GameLose event is triggered from the obj to the game root.
     * If an event condition is satisfied, a GameEvent event is triggered from the obj to the game root.
     * After the event emission the condition is destroyed!
     */
    update() {
        let hasWon = false;
        let hasLost = false;
        // first win
        for (const obj of this.winConditionsObj) {
            if (obj.satisfyWinGameCondition && obj.satisfyWinGameCondition()) {
                hasWon = true;
                let game = this.engine.getEntityByName(GAMEROOT);
                if (game) {
                    this.engine.events.sendEvent(new GameEvent(MyEngine2D.config.events?.GameWon, obj, game, { empty: true }));
                    this.deleteItemFromArray(this.winConditionsObj, obj)
                }
                break;
            }
        }
        // then lose
        if (!hasWon) {
            for (const obj of this.loseConditionsObj) {
                if (obj.satisfyLoseGameCondition && obj.satisfyLoseGameCondition()) {
                    hasLost = true;
                    let game = this.engine.getEntityByName(GAMEROOT);
                    if (game) {
                        this.engine.events.sendEvent(new GameEvent(MyEngine2D.config.events?.GameLose, obj, game, { empty: true }));
                    }
                    this.deleteItemFromArray(this.loseConditionsObj, obj)
                    break;
                }
            }
        }
        // the progression
        if (!hasWon && !hasLost) {
            for (const duo of this.progressionConditionsObj) {
                const { obj, progression } = duo;
                if (obj.satisfyProgressionGameCondition && obj.satisfyProgressionGameCondition(progression)) {
                    let game = this.engine.getEntityByName(GAMEROOT);
                    if (game) {
                        this.engine.events.sendEvent(new GameEvent(MyEngine2D.config.events?.GameProgressionEvent, obj, game, { empty: true }));
                        this.deleteItemFromArray(this.progressionConditionsObj, duo)
                    }
                    break;
                }
            }
        }
    }
}