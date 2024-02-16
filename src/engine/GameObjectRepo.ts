import { GameObject } from './GameObject'

/**
 * Represents a repository for managing game objects.
 */
export class GameObjectRepo {

    gameObjectsIdMap!: Map<string, GameObject>;
    gameObjectsNameMap!: Map<string, GameObject>;
    gameObjectsGroups!: { [key: string]: GameObject[] };

    constructor() {
        this.createDefaults()
    }

    /**
     * Take the object from the gameObjects store
     * @param name the name of the object
     * @returns the object
     */
    getObjectByName(name: string) {
        if (this.gameObjectsNameMap.has(name)) {
            return this.gameObjectsNameMap.get(name)
        }
        return null
    }

    /**
     * Take the object from the gameObjects store
     * @param id the id of the object
     * @returns the object
     */
    getObjectById(id: string) {
        if (this.gameObjectsIdMap.has(id)) {
            return this.gameObjectsIdMap.get(id)
        }
        return null
    }

    /**
     * Retrieves an array of `GameObject` instances that match the given tags.
     *
     * @param {string | string[]} tags - The tag or tags to search for.
     * @return {GameObject[]} An array of `GameObject` instances that match the given tags.
     */
    getObjectByTags(tags: string | string[], condition: 'AND' | 'OR' = 'AND'): GameObject[] {
        let found = []
        for (let obj of this.gameObjectsIdMap.values()) {
            if (obj.queryTag(tags, condition)) {
                found.push(obj)
            }
        }
        return found
    }

    /**
     * Retrieves a group of game objects by name.
     * 
     * @param name - The name of the group.
     * @returns The group of game objects with the specified name, or null if not found.
     */
    getGroup(name: string) {
        if (this.gameObjectsGroups[name]) {
            return this.gameObjectsGroups[name]
        }
        return null
    }

    /**
     * Initializes the default values for the game object repository.
     */
    createDefaults() {
        this.gameObjectsIdMap = new Map<string, GameObject>();
        this.gameObjectsNameMap = new Map<string, GameObject>();
        this.gameObjectsGroups = {};
    }
}