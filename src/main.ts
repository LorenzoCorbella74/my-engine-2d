
import './style.css'
/* import { Application } from "pixi.js";

const app = new Application({
  view: document.querySelector("#app") as HTMLCanvasElement,
  autoDensity: true,
  resizeTo: window,
  powerPreference: "high-performance",
  backgroundColor: 0x23272a,
});

document.body.appendChild(app.view as HTMLCanvasElement);


const loader = new Loader();


loader.loadAssetsGroup('group1').then((resources) => {
  console.log("✅ Loaded !!", resources);
}); */


// npx degit user/project#main my-project


import { Engine, PixiEngine } from "./engine/Engine";
import { Config } from "./game/Config";

declare global {
  interface Window {
    $PE: Engine;
  }
}

PixiEngine.run(Config);
