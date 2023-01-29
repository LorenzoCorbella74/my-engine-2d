export class GameLogic {
    private winConditions: any[];
    private loseConditions: any[];

    constructor() {
        this.winConditions = [];
        this.loseConditions = [];
    }

    registerObject(obj: any, isWinCondition: boolean) {
        if (isWinCondition) {
            this.winConditions.push(obj);
        } else {
            this.loseConditions.push(obj);
        }
    }

    update() {
        let hasWon = true;
        let hasLost = false;

        for (const obj of this.winConditions) {
            if (!obj.isSatisfied()) {
                hasWon = false;
                break;
            }
        }

        if (hasWon) {
            console.log("You have won the game!"); // TODO
            return;
        }

        for (const obj of this.loseConditions) {
            if (obj.isSatisfied()) {
                hasLost = true;
                break;
            }
        }

        if (hasLost) {
            console.log("You have lost the game."); // TODO
        }
    }
}