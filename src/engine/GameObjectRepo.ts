import { GameObject } from './GameObject'

export class GameObjectRepo {

    public gameObjectsIdMap = new Map<string, GameObject>();
    public gameObjectsNameMap = new Map<string, GameObject>();
    public gameObjectsIdNameMap = new Map<string, string>();
    public gameObjectsGroups: { [key: string]: GameObject[] } = {};

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
}