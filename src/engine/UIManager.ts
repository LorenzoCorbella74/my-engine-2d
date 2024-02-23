import { Application, Container } from "pixi.js";
import { GameObject } from "./GameObject";

const DEFAULT_LAYER = 'default';

/**
 * Manages the UI layers in the game engine.
 */
export class UIManager {
    private nextZIndex = 20;
    private uiLayers: Map<string, Container> = new Map<string, Container>()
    private uiObjects: Map<string, GameObject> = new Map<string, GameObject>();

    constructor(private app: Application) {
        this.createDefaultLayer();
    }

    /**
     * Creates a default UI layer.
     */
    private createDefaultLayer(): void {
        const defaultLayer = new Container();
        defaultLayer.zIndex = this.nextZIndex;
        this.nextZIndex++;
        this.uiLayers.set(DEFAULT_LAYER, defaultLayer);
        this.app.stage.addChild(defaultLayer);
    }

    /**
     * Adds a UI layer to the UIManager.
     * @param name - The name of the new UI layer.
     */
    addUILayer(name: string): void {
        if (!this.uiLayers.has(name)) {
            const layer = new Container();
            layer.zIndex = this.nextZIndex;
            this.uiLayers.set(name, layer);
            this.app.stage.addChild(layer);
        }
    }

    /**
     * Adds a UI element to the specified UI layer.
     * @param uiElement - The UI element to be added.
     * @param name - The name of the UI layer to add the element to.
     */
    addUIElement(uiElement: GameObject, layerName?: string): void {
        const layer = this.uiLayers.get(layerName ? layerName : DEFAULT_LAYER)! as Container;
        this.uiObjects.set(uiElement.name, uiElement);
        layer.addChild(uiElement);
    }

    /**
     * Removes a UI element from the specified UI layer.
     * @param uiElement - The UI element to be removed.
     * @param layerName - The name of the UI layer to remove the element from (optional).
     */
    removeUIElement(uiElement: string | GameObject, layerName?: string): void {
        if (typeof uiElement === "string") {
            const gameObject = this.uiObjects.get(uiElement);
            if (gameObject) {
                const layer = this.uiLayers.get(layerName ? layerName : DEFAULT_LAYER)! as Container;
                layer.removeChild(gameObject);
                this.uiObjects.delete(uiElement);
            }
        } else if (uiElement instanceof GameObject) {
            const layer = this.uiLayers.get(layerName ? layerName : DEFAULT_LAYER)! as Container;
            layer.removeChild(uiElement);
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
     * Hides the UI layer by setting its visibility to false.
     * @param name - The name of the UI layer to be hidden.
     */
    hideUILayer(name: string): void {
        const uiLayer = this.uiLayers.get(name);
        if (uiLayer) {
            uiLayer.visible = false;
        }
    }

    /**
     * Shows the UI layer by setting its visibility to true.
     * @param name - The name of the UI layer to be shown.
     */
    showUILayer(name: string) {
        const uiLayer = this.uiLayers.get(name);
        if (uiLayer) {
            uiLayer.visible = true;
        }
    }

    /**
     * Toggles the visibility of a UI layer.
     * @param name - The name of the UI layer to toggle.
     */
    toggleUILayerVisibility(name: string): void {
        const uiLayer = this.uiLayers.get(name);
        if (uiLayer) {
            uiLayer.visible = !uiLayer.visible;
        }
    }
}
