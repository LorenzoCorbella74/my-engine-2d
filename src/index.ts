import { Engine, PixiEngine } from "./engine/Engine";
import { Config } from "./game/Config";

import  "./index.css";

declare global {
    interface Window {
        $PE: Engine;
    }
}

PixiEngine.run(Config);

// debug
window.$PE = PixiEngine