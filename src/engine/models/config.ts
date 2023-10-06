export type GameConfig = {
    name: string;
    scenes: any[],
    storagePrefix?: string;
    engineLogPrefix?: string;
    assetPath?: string;
    input?: { [key: string]: string },
    events?: { [key: string]: any }
}