import { MyEngine2D } from './Engine';
import { Component } from './components/Component';
import { GameEvent, GameEventForGroup, } from './EventManager'
import { Container } from 'pixi.js';
import { IGameConditionEntity } from './models/condition-logic';
import { BaseEventType, BasePayload, IGameObjectEventHandler } from './models/events';
import { ComponentNames } from './models/component-names.enum';
import { RigidBodyComponent } from './components/rigidBody';
import { SpriteComponent } from './components/sprite';

// https://stackoverflow.com/a/73467859
/* declare global {
  interface Map<K, V> {
    has<P extends K>(key: P): this is { get(key: P): V } & this
    // funny thing: `& this` is the final piece of the puzzle
  }
} */

export class GameObject extends Container implements IGameConditionEntity, IGameObjectEventHandler {

  private _id!: string;
  private _name: string;
  private _tags: Set<string> = new Set();

  private components: Map<string, Component> = new Map();

  engine: typeof MyEngine2D;

  constructor(name: string) {
    super()
    this._name = name;
    this.engine = MyEngine2D
  }

  onEventHandler(event: GameEvent<BasePayload, BaseEventType> | GameEventForGroup<BasePayload, BaseEventType>) {
    // TODO: nel caso di evento per gruppo non sarebbe male ricevere tutto il gruppo...
    console.log(`GameObject ${this.name} received event:`, event);
  }

  // check for game logic
  isSatisfied(): boolean { return true }

  get id(): string {
    return this._id;
  }

  set id(id: string) {
    this._id = id;
  }

  get name(): string {
    return this._name;
  }

  get tags(): Set<string> {
    return this._tags;
  }

  /**
 * Deletes the object from the engine repository and removes its associated components.
 *
 * @return {void} 
 */
  kill() {
    this.engine.getRepos().gameObjectsIdMap.delete(this.id);
    this.engine.getRepos().gameObjectsNameMap.delete(this.name);
    if (this.hasComponent(ComponentNames.RigidBody)) {
      this.getComponent<RigidBodyComponent>(ComponentNames.RigidBody)?.removeRigidBody();
    }
    if (this.hasComponent(ComponentNames.Sprite)) {
      this.getComponent<SpriteComponent>(ComponentNames.Sprite)?.destroy();
    }
    this.components = new Map();
    this.destroy({ children: true });
  }

  /**
   * Update container position or, if present the rigidbody
   * @param x 
   * @param y 
   */
  setPosition(x: number, y: number) {
    if (this.hasComponent(ComponentNames.RigidBody)) {
      this.getComponent<RigidBodyComponent>(ComponentNames.RigidBody)?.updatePosition(x, y);
    } else {
      // update container position
      this.x = x;
      this.y = y;
    }
  }

  /**
   * Update all the components.
   * @param deltaTime 
   */
  update(deltaTime: number) {
    for (const c of this.components.values()) {
      c.update(deltaTime);
    }
  }

  resize(width: number, height: number) {
    for (const c of this.components.values()) {
      c.resize(width, height);
    }
  }

  /* -------------------- COMPONENTS --------------------- */

  addComponent<T extends Component>(component: T): void {
    // check component requirements
    if (this.checkDependencies(component)) {
      this.components.set(component.constructor.name, component);
    } else {
      console.error(`Impossibile aggiungere il componente ${component.name} a causa di dipendenze mancanti.`);
    }
  }

  hasComponent(componentName: string): boolean {
    return this.components.has(componentName) && !!this.components.get(componentName);
  }

  // Abilita un componente
  enableComponent(componentName: string): void {
    const component = this.getComponent(componentName);
    if (component) {
      component.enabled = true;
    }
  }

  // Disabilita un componente
  disableComponent(componentName: string): void {
    const component = this.getComponent(componentName);
    if (component) {
      component.enabled = false;
    }
  }

  // Rimuove un componente dall'entità
  removeComponent(componentName: string): void {
    this.components.delete(componentName);
    // Puoi fare ulteriori azioni qui, se necessario
  }

  // Restituisce il componente associato a un tipo specifico
  getComponent<T extends Component>(componentName: string): T | undefined {
    return this.components.get(componentName) as T;
  }

  // Verifica le dipendenze obbligatorie del componente
  checkDependencies(component: Component): boolean {
    /* const requirements: (string | { name: string; type: 'AND' | 'OR' })[] = (component as Component).dependencies || [];
    let requiredComponent;
    return requirements.every((requirement) => {
      if (typeof requirement === 'string') {
        requiredComponent = this.components.get(requirement);
        return !!requiredComponent;
      } else {
        requiredComponent = this.components.get(requirement.name);
        return (requirement.type === 'AND' && requiredComponent) || (requirement.type === 'OR' && requiredComponent);
      }
    }); */
    // FIXME: questo non funziona
    return true
  }



  /* -------------------- TAGS --------------------- */

  private evaluateSingleInput(input: string) {
    if (input.startsWith("!")) {
      return !this._tags.has(input.substr(1));
    } else {
      return this._tags.has(input);
    }
  }


  addTag(input: string | string[]) {
    if (Array.isArray(input)) {
      for (let a = 0; a < input.length; a++) {
        this._tags.add(input[a]);
      }
    } else {
      this._tags.add(input);
    }
  }


  queryTag(input: string | string[], mode = "AND") {
    if (Array.isArray(input)) {
      if (mode === "AND") {
        return input.every(e => this.evaluateSingleInput(e));
      } else if (mode === "OR") {
        return input.some(e => this.evaluateSingleInput(e));
      }
    } else {
      return this.evaluateSingleInput(input);
    }
  }

  deleteTag(input: string | string[]) {
    if (Array.isArray(input)) {
      for (let a = 0; a < input.length; a++) {
        this._tags.delete(input[a]);
      }
    } else {
      this._tags.delete(input);
    }
  }

  clearTags() {
    this._tags.clear();
  }
}