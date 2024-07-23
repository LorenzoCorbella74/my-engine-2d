import { MyEngine2D } from './Engine';
import { Component } from './components/Component';
import { GameEvent, GameEventForGroup, } from './EventManager'
import { Container } from 'pixi.js';
import { IGameConditionEntity } from './models/condition-logic';
import { BaseEventType, BasePayload, IGameObjectEventHandler } from './models/events';
import { DefaultComponentNames } from './models/component-names.enum';
import { RigidBodyComponent } from './components/rigidBody';
import { SpriteComponent } from './components/sprite';

// https://stackoverflow.com/a/73467859
/* declare global {
  interface Map<K, V> {
    has<P extends K>(key: P): this is { get(key: P): V } & this
    // funny thing: `& this` is the final piece of the puzzle
  }
} */

/**
 * Represents a game object in the game engine.
 */
export class GameObject extends Container implements IGameConditionEntity, IGameObjectEventHandler {

  private _id!: string;
  private _name: string;
  private _tags: Set<string> = new Set();

  private components: Map<string, Component> = new Map();

  engine: typeof MyEngine2D;

  constructor(name: string) {
    super()
    this._name = name;
    this.label = name; // Pixijs V8
    this.engine = MyEngine2D
  }

  onEventHandler(event: GameEvent<BasePayload, BaseEventType> | GameEventForGroup<BasePayload, BaseEventType>) {
    // TODO: nel caso di evento per gruppo non sarebbe male ricevere tutto il gruppo...
    console.log(`GameObject ${this.name} received event:`, event);
  }

  /* ---------------- check for game logic ---------------- */

  /**
   * Checks if the game win condition is satisfied.
   * @returns A boolean indicating whether the game win condition is satisfied.
   */
  satisfyWinGameCondition(): boolean {
    return true
  }

  /**
   * Checks if the game lose condition is satisfied.
   * @returns {boolean} True if the game lose condition is satisfied, false otherwise.
   */
  satisfyLoseGameCondition(): boolean {
    return true
  }

  /**
   * Checks if the game condition specified by the given key is satisfied.
   * 
   * @param key - The key of the game condition to check.
   * @returns A GameEvent object representing the game condition, or null if the condition is not satisfied.
   */
  satisfyProgressionGameCondition(key: string): GameEvent<BasePayload, BaseEventType> | null {
    return null
  }

  get id(): string {
    return this._id;
  }

  set id(id: string) {
    this._id = id;
  }

  get name(): string {
    return this._name;
  }

  set name(name: string) {
    this._name = name;
  }

  get tags(): Set<string> {
    return this._tags;
  }

  /**
   * Deletes the object from the engine repositories and removes its associated components.
   *
   * @return {void} 
   */
  kill() {
    this.engine.getRepos().gameObjectsIdMap.delete(this.id);
    this.engine.getRepos().gameObjectsNameMap.delete(this.name);
    if (this.hasComponent(DefaultComponentNames.RigidBody)) {
      this.getComponent<RigidBodyComponent>(DefaultComponentNames.RigidBody)?.removeRigidBody();
    }
    if (this.hasComponent(DefaultComponentNames.Sprite)) {
      this.getComponent<SpriteComponent>(DefaultComponentNames.Sprite)?.destroy();
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
    if (this.hasComponent(DefaultComponentNames.RigidBody)) {
      this.getComponent<RigidBodyComponent>(DefaultComponentNames.RigidBody)?.updatePosition(x, y);
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

  // TODO:
  resize(width: number, height: number) {
    for (const c of this.components.values()) {
      c.resize(width, height);
    }
  }

  /* -------------------- COMPONENTS --------------------- */

  /**
   * Adds a component to the game object.
   * @param component The component to add.
   */
  addComponent<T extends Component>(component: T): void {
    // check component requirements
    if (this.checkDependencies(component)) {
      this.components.set(component.constructor.name, component);
    } else {
      console.error(`Impossibile aggiungere il componente ${component.name} a causa di dipendenze mancanti.`);
    }
  }

  /**
   * Checks if the GameObject has a specific component.
   * @param componentName - The name of the component to check.
   * @returns True if the GameObject has the component, false otherwise.
   */
  hasComponent(componentName: string): boolean {
    return this.components.has(componentName) && !!this.components.get(componentName);
  }


  /**
   * Enables a component on the game object.
   * @param componentName - The name of the component to enable.
   */
  enableComponent(componentName: string): void {
    const component = this.getComponent(componentName);
    if (component) {
      component.enabled = true;
    }
  }


  /**
   * Disables a component of the game object.
   * @param componentName - The name of the component to disable.
   */
  disableComponent(componentName: string): void {
    const component = this.getComponent(componentName);
    if (component) {
      component.enabled = false;
    }
  }


  /**
   * Removes a component from the game object.
   * @param componentName - The name of the component to remove.
   */
  removeComponent(componentName: string): void {
    this.components.delete(componentName);
  }


  /**
   * Retrieves a component of type T from the GameObject.
   * @param componentName - The name of the component to retrieve.
   * @returns The component of type T, or undefined if the component does not exist.
   */
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


  /**
   * Adds a tag or an array of tags to the GameObject.
   * @param input - The tag(s) to add.
   */
  addTag(input: string | string[]) {
    if (Array.isArray(input)) {
      for (let a = 0; a < input.length; a++) {
        this._tags.add(input[a]);
      }
    } else {
      this._tags.add(input);
    }
  }


  /**
   * Queries the GameObject based on the provided tag(s).
   * @param input - The tag(s) to query. Can be a single string or an array of strings.
   * @param mode - The query mode. Defaults to "AND". Possible values are "AND" and "OR".
   * @returns True if the GameObject matches the tag(s) based on the query mode, otherwise false.
   */
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

  /**
   * Deletes a tag or an array of tags from the GameObject.
   * @param {string | string[]} input - The tag(s) to be deleted.
   */
  deleteTag(input: string | string[]) {
    if (Array.isArray(input)) {
      for (let a = 0; a < input.length; a++) {
        this._tags.delete(input[a]);
      }
    } else {
      this._tags.delete(input);
    }
  }

  /**
   * Clears all the tags associated with the game object.
   */
  clearTags() {
    this._tags.clear();
  }
}