import { Graphics } from "pixi.js";
import { MyEngine2D } from "../../engine/Engine";

export function createTestCrosshair(engine: typeof MyEngine2D) {
    const c = new Graphics();
    c.lineStyle(2, 0xFFFFFF, 1);
    c.moveTo(-15, 0);
    c.lineTo(15, 0);
    c.moveTo(0, -15);
    c.lineTo(0, 15);
    c.position.set(engine.app.screen.width / 2, engine.app.screen.height / 2);
    return c;
}