
import './style.css'

import * as PIXI from "pixi.js";

import { Engine, MyEngine2D } from "./engine/Engine";
import { Config } from "./game/Config";

PIXI.utils.skipHello(); // remove pixi message in console log 

declare global {
  interface Window {
    $PE: Engine;
  }
}

MyEngine2D.run(Config);
