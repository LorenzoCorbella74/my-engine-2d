import { MyEngine2D } from "./Engine";
import { EngineError } from "./EngineError";

/**
 * Manages the aspect ratio of the game engine.
 * and the origin and scale of the game scene
 */
export class ScreenManager {

    private widthR: number;
    private heightR: number;

    private scaleX: number = 1;
    private scaleY: number = 1;
    private startWidth: number;
    private startHeight: number;

    constructor(public engine: typeof MyEngine2D) {
        const { widthR, heightR } = this.parseAspectRatio(engine.config.aspectRatio || "16:9");
        this.widthR = widthR;
        this.heightR = heightR;
        const { width, height } = this.engine.app.screen; // get the initial screen size
        this.startWidth = width;
        this.startHeight = height;
        this.calculateSceneDimensionAndOrigin();
    }

    /**
     * Updates the screen manager.
     */
    private updateScale() {
        const { width, height } = this.engine.app.screen;
        if (width !== this.startWidth || height !== this.startHeight) {
            this.scaleX = Math.ceil(width / this.startWidth);
            this.scaleY = height / this.startHeight;
            this.calculateSceneDimensionAndOrigin();
        }
    }

    get scale() {
        return { x: this.scaleX, y: this.scaleY };
    }

    /**
     * Calculates the dimensions and origin of the screen.
     * and internally updates the scale.
     * @returns An object containing the width, height, x-coordinate, and y-coordinate.
     */
    calculateSceneDimensionAndOrigin(): { width: number, height: number, x: number, y: number } {
        const { width, height } = this.engine.app.screen;
        const isWidthConstrained = width < height * this.heightR / this.widthR;
        const isHeightConstrained = width * this.widthR / this.heightR > height;
        const actualWidth = isWidthConstrained ? width : height * this.heightR / this.widthR;
        const actualHeight = isHeightConstrained ? height : width * this.widthR / this.heightR;
        const originX = (width - actualWidth) / 2;
        const originY = (height - actualHeight) / 2;
        this.updateScale();
        return { width: actualWidth, height: actualHeight, x: originX, y: originY };
    }

    private parseAspectRatio(input: string): { widthR: number, heightR: number } {
        const pattern = /^\d+:\d+$/;
        if (!pattern.test(input)) {
            throw new EngineError("Format not valid for aspect ratio. Please use the format <number>:<number>");
        }
        const [widthStr, heightStr] = input.split(':');
        const width = parseInt(widthStr);
        const height = parseInt(heightStr);

        return { widthR: width, heightR: height };
    }
}