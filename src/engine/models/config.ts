/**
 * Represents the configuration for a game.
 * @template T - The type of the game state.
 */
export type GameConfig<T> = {
    name: string;                       // the name of the game
    scenes: any[],                      // list of Scene Class
    storagePrefix?: string;             // the prefix for the storage in localstorage 
    engineLogPrefix?: string;           // prefix for console log
    localeFolder?: string;              // locale folder
    defaultLocale?: string;             // default locale
    assetPath?: string;                 // 
    input?: { [key: string]: string },  // list of input remapped keys
    events?: { [key: string]: any },    // list of game events
    state: T,                           // game state
    framesToCheckLogic: number[]        // frames for game logic conditions
}