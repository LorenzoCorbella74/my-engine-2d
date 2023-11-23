// importing scenes
import { FirstScene } from "./Scenes/FirstScene";
import { SecondScene } from './Scenes/SecondScene';
import { MatterScene } from './Scenes/MatterScene';
import { GraphicScene } from './Scenes/GraphicScene'

import { GameConfig } from "../engine/models/config";

export const Config: GameConfig = {
    name: 'My Game',
    scenes: [FirstScene, SecondScene, MatterScene, GraphicScene],  // the first is the startScene
    storagePrefix: 'MyGame_',
    engineLogPrefix: '[MY-ENGINE-2D]: ',
    // defaultLocale: 'en',
    // localeFolder: 'i18n',
    // set your input here...
    input: {
        'UP': 'w',
        'DOWN': 's',
        'RIGHT': 'd',
        'LEFT': 'a',
        'DEBUG': 'i',
        'Z': 'z',       // ZOOM IN
        'X': 'x',       // ZOOM OUT
        'N': 'n',       // ZOOM TO
        'M': 'm',       // CAMERA SHAKING
        'O': 'o',       // Change camera focus
        'E': 'e',       // TEST send event
        'R': 'r',       // TEST send event to group
    },
    // place your events here...
    events: {
        Collision: 'Collision',
        Pickup: 'Pickup',
        CustomEvent: 'CustomEvent',
        UpdateForUI: 'UpdateForUI',
    }
};