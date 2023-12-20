import { Application, Container } from "pixi.js";
import { GameObject } from "./GameObject";

export class UIManager {
    private uiLayer: Container;

    constructor(app: Application) {
        this.uiLayer = new Container();
        this.uiLayer.zIndex = 20;
        app.stage.addChild(this.uiLayer);
    }

    setUILayer(layer: Container): void {
        this.uiLayer = layer;
    }

    addUIElement(uiElement: GameObject): void {
        this.uiLayer.addChild(uiElement);
        // this.uiLayer.children.sort((a, b) => a.zIndex - b.zIndex);
    }

    removeUIElement(uiElement: GameObject): void {
        this.uiLayer.removeChild(uiElement);
    }

    hide(): void {
        this.uiLayer.visible = false;
    }

    show(){
        this.uiLayer.visible = true;
    }

    toggle(): void {
        this.uiLayer.visible = !this.uiLayer.visible;
    }
}
