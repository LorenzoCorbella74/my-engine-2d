import { PixiEngine } from './Engine';
import { Sprite } from "pixi.js";

import { Body, Bodies, World, Composite } from 'matter-js';

export const GROUP = {
  DEFAULT: 0x0001,
  PLAYER: 0x0002,
  ENEMY: 0x0004,
  PROJECTILE: 0x0008,
  WALL: 0x0010,
  ITEM: 0x0020,
  NPC: 0x0040
} as const

type GroupsType = keyof typeof GROUP;
type GroupsValue = typeof GROUP[keyof typeof GROUP];

// Opzioni per il decoratore
type RigidBodyOptions = {
  shape: 'rectangle' | 'circle' | 'polygon';
  isStatic: boolean;
  friction?: number;
  collisionFilter: {
    category?: GroupsValue,
    mask?: number  // Esempio maschera di collisione
  }
  position?: { x: number, y: number }
}


type MyRigidBody = Body | null

import { IGameConditionEntity } from './GameLogic'
import { GameEvent, GameEventForGroup, IGameObjectEventHandler, BasePayload } from './EventManager'

export class GameObject implements IGameConditionEntity, IGameObjectEventHandler {

  private _id: string;
  private _name: string;
  private _sprite: Sprite;

  // phisics body if present ...
  public rigidBody: MyRigidBody = null;
  public removeRigidBody: MyRigidBody extends Body ? () => void : null;


  engine: typeof PixiEngine;

  constructor(name: string, spriteName?: string) {
    this._name = name;
    this.engine = PixiEngine
    // empty sprite if not specified
    this._sprite = spriteName ? PixiEngine.getAsset(spriteName) : PixiEngine.getAsset('empty');
    if (!spriteName) {
      this.hide()
    }
  }

  createRigidBody(options?: RigidBodyOptions) {

    // si registra nel objects repository
    const { shape, isStatic } = options;
    const { x, y } = options.position || this._sprite;
    const { width, height } = this._sprite;
    const config = {
      isStatic,
      friction: options.friction || 0,
      label: this.name,
      collisionFilter: {
        category: options?.collisionFilter?.category || GROUP.DEFAULT,
        mask: options?.collisionFilter?.mask || GROUP.DEFAULT
      }
    }
    // Crea il corpo Matter.js in base alle opzioni
    if (shape === 'rectangle') {
      this.rigidBody = Bodies.rectangle(x + width / 2, y + height / 2, width, height, config);
    } else if (shape === 'circle') {
      this.rigidBody = Bodies.circle(x + width / 2, y + height / 2, width, config); // TODO
    } else if (shape === 'polygon') {
      // TODO: poligono personalizzato
    }

    // Aggiungi il corpo Matter.js al mondo
    World.add(PixiEngine.physics.physicsEngine.world, this.rigidBody);
    this.removeRigidBody = () => {
      World.remove(PixiEngine.physics.physicsEngine.world, this.rigidBody);
    }

  }


  onEventHandler(event: GameEvent<BasePayload> | GameEventForGroup<BasePayload>) {
    // Implementa la logica per gestire l'evento specifico per questo oggetto
    // TODO: nel caso di evento per gruppo non sarebbe male ricevere tutto il gruppo...
    console.log(`GameObject ${this.name} received event:`, event);
  }


  isSatisfied: () => boolean;

  get id(): string {
    return this._id;
  }

  set id(id: string) {
    this._id = id
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
  }

  get sprite(): Sprite {
    return this._sprite;
  }

  set sprite(value: Sprite) {
    this._sprite = value;
  }

  hide() {
    this._sprite.visible = false;
  }

  show() {
    this._sprite.visible = true;
  }

  update(deltaTime: number) {
    if (this.rigidBody) {
      this.sprite.x = this.rigidBody?.position?.x
      this.sprite.y = this.rigidBody?.position?.y
    }
  }

  destroy() {
    this._sprite.destroy()
    if (this.rigidBody) {
      this.removeRigidBody()
    }
  }
}