import { Application, Container } from "pixi.js";
import { GameObject } from "./GameObject";

/**
 * Manages the UI layer in the game engine.
 */
export class UIManager {
    private uiLayer: Container;
    private uiObjects: Map<string, GameObject>;

    constructor(app: Application) {
        this.uiLayer = new Container();
        this.uiObjects = new Map<string, GameObject>();
        this.uiLayer.zIndex = 20;
        app.stage.addChild(this.uiLayer);
    }

    /**
     * Sets the UI layer for the UIManager.
     * @param layer - The container representing the UI layer.
     */
    setUILayer(layer: Container): void {
        this.uiLayer = layer;
    }

    /**
     * Adds a UI element to the UIManager.
     * @param uiElement - The UI element to be added.
     */
    addUIElement(uiElement: GameObject): void {
        this.uiObjects.set(uiElement.name, uiElement);
        this.uiLayer.addChild(uiElement);
        // this.uiLayer.children.sort((a, b) => a.zIndex - b.zIndex);
    }

    /**
     * Removes a UI element from the UI layer.
     * @param uiElement - The UI element to be removed.
     */
    removeUIElement(uiElement: string | GameObject): void {
        if (typeof uiElement === "string") {
            const gameObject = this.uiObjects.get(uiElement);
            if (gameObject) {
                this.uiLayer.removeChild(gameObject);
                this.uiObjects.delete(uiElement);
            }
        } else {
            this.uiLayer.removeChild(uiElement);
            this.uiObjects.forEach((value, key) => {
                if (value === uiElement) {
                    this.uiObjects.delete(key);
                }
            });
        }
    }

    /**
     * Hides a UI element by passing the name of the GameObject.
     * @param uiElementName - The name of the UI element to be hidden.
     */
    hideUIElementByName(uiElementName: string): void {
        const uiElement = this.uiObjects.get(uiElementName);
        if (uiElement) {
            uiElement.visible = false;
        }
    }

    /**
     * Shows a UI element by passing the name of the GameObject.
     * @param uiElementName - The name of the UI element to be shown.
     */
    showUIElementByName(uiElementName: string): void {
        const uiElement = this.uiObjects.get(uiElementName);
        if (uiElement) {
            uiElement.visible = true;
        }
    }

    /**
     * Hides the UI layer.
     */
    hideUILayer(): void {
        this.uiLayer.visible = false;
    }

    /**
     * Shows the UI layer by setting its visibility to true.
     */
    showUILayer() {
        this.uiLayer.visible = true;
    }

    /**
     * Toggles the visibility of the UI layer.
     */
    toggleUILayerVisibility(): void {
        this.uiLayer.visible = !this.uiLayer.visible;
    }
}
