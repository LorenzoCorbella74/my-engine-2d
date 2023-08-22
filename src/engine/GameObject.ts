import { PixiEngine } from './Engine';
import { Sprite } from "pixi.js";

import { IGameConditionEntity } from './GameLogic'
import { GameEvent, GameEventForGroup, IGameObjectEventHandler, BasePayload } from './EventManager'


/**
 * GameObjectEntity decorator.
 * @description put the instance with a generated id in the objects repository
 */
export function GameObjectEntity(target: any) {
  const original = target;

  // si decora la classe originale
  const newConstructor: any = function (...args: any[]) {
    // si istanzia la classe decorata
    const instance = new original(...args);

    instance.id = Math.random().toString(36).substring(2, 15); // `${Date.now()}${Math.random()*1000000}`;
    // si registra nel objects repository
    PixiEngine.repo.gameObjectsIdMap.set(instance.id, instance);
    PixiEngine.repo.gameObjectsNameMap.set(instance.name, instance);
    PixiEngine.repo.gameObjectsIdNameMap.set(instance.id, instance.name);
    PixiEngine.scenes.currentScene.addChild(instance.entity);
    // ritorna l'istanza
    return instance;
  };

  newConstructor.prototype = original.prototype;
  return newConstructor;
}

/**
 * GameObjectGroup decorator.
 * @description put the instance inside an object group repository
 */
export function GameObjectGroup(groupName: string) {

  return function (target: any) {
    const original = target;

    // si decora la classe originale
    const newConstructor: any = function (...args: any[]) {
      // si istanzia la classe decorata
      const instance = new original(...args);

      // si registra nel objects repository
      if (!PixiEngine.repo.gameObjectsGroups[groupName]) {
        PixiEngine.repo.gameObjectsGroups[groupName] = [];
      }
      PixiEngine.repo.gameObjectsGroups[groupName].push(instance);

      // ritorna l'istanza
      return instance;
    };

    newConstructor.prototype = original.prototype;
    return newConstructor;
  }
}

export class GameObject implements IGameConditionEntity, IGameObjectEventHandler {

  private _id: string;
  private _name: string;
  private _sprite: Sprite;

  constructor(name: string, spriteName: string) {
    this._name = name;
    this._sprite = PixiEngine.getAsset(spriteName);
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

  get entity(): Sprite {
    return this._sprite;
  }

  set entity(value: Sprite) {
    this._sprite = value;
  }

  hide() {
    this._sprite.visible = false;
  }

  show() {
    this._sprite.visible = true;
  }

  update(deltaTime: number) { }
}