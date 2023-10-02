import { PixiEngine } from './Engine';
import { Component } from './Component';

import { IGameConditionEntity } from './GameLogic'
import { GameEvent, GameEventForGroup, IGameObjectEventHandler, BasePayload } from './EventManager'

export class GameObject implements IGameConditionEntity, IGameObjectEventHandler {

  private _id: string;
  private _name: string;
  private components: { [key: string]: Component[] } = {};

  engine: typeof PixiEngine;

  constructor(name: string, spriteName?: string) {
    this._name = name;
    this.engine = PixiEngine
  }

  onEventHandler(event: GameEvent<BasePayload> | GameEventForGroup<BasePayload>) {
    // Implementa la logica per gestire l'evento specifico per questo oggetto
    // TODO: nel caso di evento per gruppo non sarebbe male ricevere tutto il gruppo...
    console.log(`GameObject ${this.name} received event:`, event);
  }

  // check for game logic
  isSatisfied: () => boolean;

  get id(): string {
    return this._id;
  }

  set id(id: string) {
    this._id = id;
  }

  get name(): string {
    return this._name;
  }

  update(deltaTime: number) {
    for (const key in this.components) {
      if (Object.prototype.hasOwnProperty.call(this.components, key)) {
        const component = this.components[key];
        component[0].update(deltaTime);
      }
    }
  }

  destroy() {
    // TODO
    /*  this._sprite.destroy()
     if (this.rigidBody) {
       this.removeRigidBody()
     } */
  }


  addComponent(component: Component) {
    const componentName = component.name;

    if (!this.components[componentName]) {
      this.components[componentName] = [];
    }
    this.components[componentName].push(component);
    // Verifica le dipendenze e abilita i componenti necessari se non sono già abilitati.
    for (const dependency of component.dependencies) {
      if (!this.isComponentEnabled(dependency)) {
        this.setComponentEnabled(dependency, true);
      }
    }
  }

  // Rimuoviamo un componente dall'entità.
  removeComponent(component: Component) {
    const componentName = component.name;
    if (this.components[componentName]) {
      const index = this.components[componentName].indexOf(component);
      if (index !== -1) {
        this.components[componentName].splice(index, 1);
      }
    }
  }

  // Ottieni tutti i componenti di un tipo specifico associati a questa entità.
  getComponents<T extends Component>(componentName: string): T[] {
    return (this.components[componentName] as T[] || []).filter((component) => component.enabled);
  }

  // Abilita o disabilita i componenti specificati nel parametro componentsState.
  setComponentsEnabled(componentsState: { [componentName: string]: boolean }) {
    for (const componentName in componentsState) {
      if (componentsState.hasOwnProperty(componentName)) {
        const enabled = componentsState[componentName];
        this.setComponentEnabled(componentName, enabled);
      }
    }
  }

  // Abilita o disabilita un componente specifico.
  setComponentEnabled(componentName: string, enabled: boolean) {
    const components = this.components[componentName] as Component[];
    if (components) {
      for (const component of components) {
        component.enabled = enabled;
      }
    }
  }

  // Verifica se un componente specifico è abilitato.
  isComponentEnabled(componentName: string): boolean {
    const components = this.components[componentName] as Component[];
    if (components) {
      return components.some((component) => component.enabled);
    }
    return false;
  }
}