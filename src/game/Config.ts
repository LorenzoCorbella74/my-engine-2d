// importing scenes
import { Scene } from "../engine/SceneManager";
import { FirstScene } from "./Scenes/FirstScene";
import { SecondScene } from './Scenes/Second';

export type GameConfig = {
    name: string;
    scenes: any[],
    storagePrefix?: string;
    input?: { [key: string]: string }
}

export const Config = {
    name: 'My Game',
    scenes: [FirstScene, SecondScene],  // the first is the startScene
    storagePrefix: 'app_',
    input: {
        'UP': 'w',
        'DOWN': 's',
        'RIGHT': 'd',
        'LEFT': 'a',
    }
};

/*
    I) assetPath
        nell'assetpath ci stanno:
        - le imgs
        - i souni
        - i file json (da usare come sciptable object di Unity)

    2) array di scene, 

    L'idea è di avere un oggetto di configurazione da passare all'engine
    per gestire l'importazione dei file e la gestione delle scene.
*/