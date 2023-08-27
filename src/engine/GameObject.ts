import { PixiEngine } from './Engine';
import { Sprite } from "pixi.js";
import { Body } from 'matter-js';


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

  // TODO: https://stackoverflow.com/questions/32683832/javascript-matter-js-disable-collision-for-one-body
  switchPhysics(mode: 'ON' | 'OFF') {
    switch (mode) {
      case 'ON': this.rigidBody.collisionFilter.group = 0
      case 'ON': this.rigidBody.collisionFilter.group = -1
      default:
        break;
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

  update(deltaTime: number) { }

  destroy() {
    this._sprite.destroy()
    if (this.rigidBody) {
      this.removeRigidBody()
    }
  }
}