// importing default scene
import { Game } from "./Scenes/Game";

export const Config = {
    scenes: [Game]  // the first is the startScene
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