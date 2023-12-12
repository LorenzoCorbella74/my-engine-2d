import { Point } from "pixi.js";
import { GameObject } from "../GameObject";
import { Action } from "./model";


export class MoveAction extends Action {

    private static DISTANCE_TOLERANCE: number = 5;

    constructor(
        public entity: GameObject,
        public targetPosition: Point,
        public tolerance: number = MoveAction.DISTANCE_TOLERANCE
    ) {
        super(entity);
    }

    update(dt: number) {
        if (this.entity.engine.math.distance(this.entity, this.targetPosition) < this.tolerance) {
            this.finished = true;
        }
    }
}