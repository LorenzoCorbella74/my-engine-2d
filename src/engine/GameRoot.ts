import { GameObject } from "./GameObject";
import { Entity } from './decorators';

export const GAMEROOT = "GAMEROOT"

@Entity()
export class GameRoot<GameState> extends GameObject {

    private state: GameState;
    private initialState: GameState;

    constructor(initialState: GameState) {
        super(GAMEROOT)
        this.initialState = initialState;
        this.state = initialState;
    }

    /**
     * Sets the state of the game.
     * @param state - The new state to set 
     * or a function that updates the current state.
     */
    setState(state: GameState | ((state: GameState) => GameState)) {
        this.state = typeof state === 'function' ?
            (state as (state: GameState) => GameState)(this.state)
            : { ...this.state, ...state };

    }

    /**
     * Retrieves the value of a specific key from the game state.
     * 
     * @param key - The key of the state property to retrieve.
     * @returns The value of the specified key from the game state.
     */
    getState(key: keyof GameState): GameState[keyof GameState] {
        return this.state[key];
    }

    /**
     * Resets the state of the game root to its initial state.
     */
    resetState() {
        this.state = { ...this.initialState }
    }

    /**
     * Listens for changes in the specified key of the game state and executes the provided callback function.
     * @param key - The key of the state property to listen for changes.
     * @param callback - The callback function to execute when the state property changes.
     */
    onStateChange(
        key: keyof GameState,
        callback: (newValue: GameState[keyof GameState], oldValue: GameState[keyof GameState]) => void
    ) {
        let currentValue = this.getState(key);

        Object.defineProperty(this.state, key, {
            get: () => currentValue,
            set: (newValue) => {
                const oldValue = currentValue;
                currentValue = newValue;
                callback(newValue, oldValue);
            },
            enumerable: true,
            configurable: true,
        });
    }
}