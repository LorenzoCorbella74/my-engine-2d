/**
 * Represents a storage database for saving and loading data using the localStorage API.
 */
export class StorageDB {

    constructor(private prefix: string = 'pe_') { }

    /**
     * Saves the specified value with the given key in the storage database.
     * @param key - The key used to identify the value.
     * @param value - The value to be saved.
     */
    save(key: string, value: any) {
        localStorage.setItem(this.prefix + key, JSON.stringify(value));
    }

    /**
     * Loads the value associated with the given key from the storage database.
     * @param key - The key used to identify the value.
     * @returns The loaded value, or undefined if the key does not exist.
     */
    load(key: string) {
        if (key !== null) {
            return JSON.parse(localStorage.getItem(this.prefix + key) as string);
        }
    }

    /**
     * Clears the storage database by removing all stored values, or removes the value associated with the specified key.
     * @param key - The key used to identify the value to be removed. If not provided, all values will be removed.
     */
    clear(key?: string) {
        if (key) {
            localStorage.removeItem(this.prefix + key);
        } else {
            localStorage.clear();
        }
    }

}