import { GameObject } from './GameObject'

export class GameObjectRepo {

    private gameObjectsIdMap!: Map<string, GameObject>;
    private gameObjectsNameMap!: Map<string, GameObject>;
    private gameObjectsGroups!: { [key: string]: GameObject[] };

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

    getObjectByTag(tags: string[]) {
        // TODO: implementare i tag
    }

    getGroup(name: string) {
        if (this.gameObjectsGroups[name]) {
            return this.gameObjectsGroups[name]
        }
        return null
    }

    createDefaults() {
        this.gameObjectsIdMap = new Map<string, GameObject>();
        this.gameObjectsNameMap = new Map<string, GameObject>();
        this.gameObjectsGroups = {};
    }
}