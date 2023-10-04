import { GROUP } from "../components/rigidBody";

export type GroupsType = keyof typeof GROUP;
export type GroupsValue = typeof GROUP[keyof typeof GROUP];

// Opzioni per il corpo Matter
export type RigidBodyOptions = {
    shape: 'rectangle' | 'circle' | 'polygon';
    isStatic: boolean;
    friction?: number;
    frictionAir?: number;
    restitution?: number;
    collisionFilter: {
        category?: GroupsValue,
        mask?: number  // Esempio maschera di collisione
    }
    position?: { x: number, y: number }
}