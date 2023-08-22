export interface IGameConditionEntity { isSatisfied: () => boolean }

export class GameLogic {
    private winConditions: IGameConditionEntity[];
    private loseConditions: IGameConditionEntity[];

    constructor() {
        this.winConditions = [];
        this.loseConditions = [];
    }

    registerGameWinLoseConditions(obj: any, isWinCondition: boolean = true) {
        if (isWinCondition) {
            this.winConditions.push(obj);
        } else {
            this.loseConditions.push(obj);
        }
    }

    update() {
        let hasWon = false;
        let hasLost = false;

        for (const obj of this.winConditions) {
            if (obj.isSatisfied()) {
                hasWon = true;
                break;
            }
        }

        if (hasWon) {
            console.log("You have won the game!"); // TODO
            return;
        }

        for (const obj of this.loseConditions) {
            if (!obj.isSatisfied()) {
                hasLost = true;
                break;
            }
        }

        if (hasLost) {
            console.log("You have lost the game."); // TODO
        }
    }
}