// importing scenes
import { FirstScene } from "./Scenes/FirstScene";
import { SecondScene } from './Scenes/SecondScene';
import { MatterScene } from './Scenes/MatterScene';
import { GraphicScene } from './Scenes/GraphicScene'

export type GameConfig = {
    name: string;
    scenes: any[],
    storagePrefix?: string;
    input?: { [key: string]: string }
}

export const Config = {
    name: 'My Game',
    scenes: [FirstScene, SecondScene, MatterScene, GraphicScene],  // the first is the startScene
    storagePrefix: 'app_',
    input: {
        'UP': 'w',
        'DOWN': 's',
        'RIGHT': 'd',
        'LEFT': 'a',
        'Z': 'z',       // ZOOM IN
        'X': 'x',       // ZOOM OUT
        'N': 'n',       // ZOOM TO
        'M': 'm',       // CAMERA SHAKING
        'O': 'o',       // Change camera focus
        'E': 'e',       // TEST send event
        'R': 'r',       // TEST send event to group
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