import { PixiEngine } from './Engine';
import { Sprite } from "pixi.js";

import { IGameConditionEntity } from './GameLogic'
import { GameEvent, GameEventForGroup, IGameObjectEventHandler, BasePayload } from './EventManager'

export class GameObject implements IGameConditionEntity, IGameObjectEventHandler {

  private _id: string;
  private _name: string;
  private _sprite: Sprite;
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

  onEventHandler(event: GameEvent<BasePayload> | GameEventForGroup<BasePayload>) {
    // Implementa la logica per gestire l'evento specifico per questo oggetto
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
  }
}