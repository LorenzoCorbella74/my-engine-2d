/**
 * Represents the game statistics.
 */
export class GameStats {
    // Private map to store game stats
    private stats: Map<string, number>;

    constructor() {
        this.stats = new Map<string, number>();
    }

    /**
     * Adds a new stat key with an initial value of 0
     * @param key - The key of the stat to add
     */
    addStatKey(key: string): void {
        this.stats.set(key, 0);
    }


    /**
     * Retrieves the value of a stat with the specified key.
     * Returns undefined if the key does not exist.
     * @param key - The key of the stat to retrieve.
     * @returns The value of the stat.
     */
    getStatKey(key: string): number | undefined {
        return this.stats.get(key);
    }


    /**
     * Updates the value of a stat with the specified key.
     * If the value is null, it increments the current value by 1.
     * @param key - The key of the stat to update.
     * @param value - The new value of the stat.
     */
    updateStatKey(key: string, value?: number): void {
        if (!value) {
            const currentValue = this.stats.get(key) || 0;
            this.stats.set(key, currentValue + 1);
        } else {
            this.stats.set(key, value);
        }
    }

    /**
     * Deletes a stat key
     * @param key - The key of the stat to delete
     */
    deleteStatKey(key: string): void {
        this.stats.delete(key);
    }

    /**
     * Resets specified stat keys to zero
     * @param keys - The keys of the stats to reset
     */
    cleanStatKeys(keys: string[]): void {
        keys.forEach(key => this.stats.set(key, 0));
    }
}