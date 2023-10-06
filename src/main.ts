
import './style.css'

import { Engine, MyEngine2D } from "./engine/Engine";
import { Config } from "./game/Config";

declare global {
  interface Window {
    $PE: Engine;
  }
}

MyEngine2D.run(Config);
