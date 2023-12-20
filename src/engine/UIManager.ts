import { Application, Container } from "pixi.js";
import { GameObject } from "./GameObject";

export class UIManager {
    private uiLayer: Container;

    constructor(app: Application) {
        this.uiLayer = new Container();
        this.uiLayer.zIndex = 2;
        app.stage.addChild(this.uiLayer);
    }

    addUIElement(uiElement: GameObject): void {
        this.uiLayer.addChild(uiElement);
        // this.uiLayer.children.sort((a, b) => a.zIndex - b.zIndex);
    }

    removeUIElement(uiElement: GameObject): void {
        this.uiLayer.removeChild(uiElement);
    }
}
