
import './style.css'

import { Engine, MyEngine2D } from "./engine/Engine";
import { Config } from "./game/Config";

// PIXI.utils.skipHello(); // remove pixi message in console log  NOT IN PIXIJS 8

declare global {
  interface Window {
    $PE: Engine;
  }
}

MyEngine2D.run(Config);
