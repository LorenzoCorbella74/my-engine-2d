## Asset Manager

It is possible to load asincronously the resources placed in the assets folder and subdivided in group folder. Each folder can contain specific scene resources organised in the following mandatory sub folders:

- `audio` for audio files,
- `img` for textures,
- `data` for json data and translations.

```typescript
// after loading resources in the init() fn of your scene...
// ("sceneOne" is the name of the folder in /assets)
await this.engine.loader.loadAssetsGroup("sceneOne");

// ... you can get the sprite by using the name of the file without the extension
this.engine.getAsset("rocket-launcher");
```

[back](./README.md#Features)

## GameObject Architecture and ECS

Thanks to the `Entity` decorator it is possible to instanciate Gameobject with an unique id and add them automatically to the current scene.

The engine provides several methods to search for objects and query the game world:

- `getEntitytByName(game:string)`,
- `getEntitytById(id:number)`
- `getEntityGroup(name: string)` to retrieve a list of GameObjects belonging to the relevant group.

It's possible to decorate GameObjects with tags and retrieve a list of GameObject instances that match the given tags with the `getEntitiesByTags(tags: string | string[], condition: 'AND' | 'OR' = 'AND')` methods:

```typescript
@Entity({
  group:'enemy'
  tags:["soldier", "robot"]
})
export class EnemyCommander extends GameObject {
  // code here..
}

// in a game scene to search for entities
const enemies = this.engine.getObjectsByTags(['soldier','!friend']) // to invert use "!" before the tag => soldier NOT friend :-(
```

The "Gameobject" class extends the PIXI.Container, and being the "Entity" is composed of components. The engine provides out of the box:

- sprite component
- rigidbody component to manage collision of rigid bodies via the library [Matter-js](https://github.com/liabru/matter-js/tree/master)
- script component to manage custom logic
- input-controller component to manage the entity via user inputs

```typescript
@Entity()
export class Player extends GameObject {
  constructor(name: string, spriteName: string) {
    super(name);
    this.addComponent(new SpriteComponent(this, spriteName));
    this.addComponent(new HealthComponent(this, 100));
    this.addComponent(
      new RigidBodyComponent(this, {
        shape: "rectangle",
        isStatic: false,
        collisionFilter: {
          category: GROUP.PLAYER,
          mask:
            GROUP.ENEMY |
            GROUP.PROJECTILE |
            GROUP.WALL |
            GROUP.ITEM |
            GROUP.TRIGGER,
        },
        position: {
          x: 0,
          y: 0,
        },
      })
    );
    this.addComponent(new InputController(this, 150));
  }
}
```

For the time being Systems are not implemented but the engine provides a method to update all the components of the game world with the `update(dt: number, delta: number)` method of the GameObject class.

[back](./README.md#Features)

### Gameobject Templates

The engine provides the following template entities:

- [x] Trigger: invisible, one time box to fire events
- [x] Positional Sound Emitter: volume is based on the distance with the player
- [ ] TODO...

[back](./README.md#Features)

## Sound Manager

The SoundManager class is responsible for managing sound resources in the game.It is used with the property `sounds` of the main `Engine` class.
A map of all the .mp3 resources is available after pre loading and sounds are managed with the following methods:

- `this.engine.sounds.playSound(name:string)` to play a sound
- `this.engine.sounds.stopSound(name:string)` to stop a sound
- `this.engine.sounds.toggleSound(name:string)` to toggle a sound
- `this.engine.sounds.playRandomSound(keys: string[])`. to play a random sound from a list of keys
- `this.engine.sounds.fadeInSound(name: string, duration: number = 1)` to fade in a sound
- `this.engine.sounds.fadeOutSound(name: string, volume: number = 0, duration: number = 1)` to fade out a sound

[back](./README.md#Features)

### Scene manager

It is possible to manage the game scenes with the `SceneManager` class. It is used with the property `scenes` of the main `Engine` class.
Game scenes extend PIXI.Container and allow in the init method to load asincronously the required resources of the scene.

```typescript
export class Scene extends Container {
  constructor() {
    super();
  }

  /**
   * Initialize objetct and load resources asyncronously
   */
  async init() {}

  update(dt: number, delta: number) {}

  /**
   * Clean up and load resources for next scene
   */
  onExit() {
    super.destroy();
    console.log(this.constructor.name, " exit");
  }

  onResize(width: number, height: number) {}
}
```

The engine provide methods to change scenes with gsap transitions.

```typescript
this.engine.scenes.goToScene("DungeonOne");
```

[back](./README.md#Features)

## Keyboard Input Manager

It is possible to manage the user keyboard inputs with the property `keyboard` of the main `Engine` class:

- `iskeyDown(key)` to check CONTINUOSLY if a key has been pressed
- `iskeyDownOnce(key)` to check if a key has been pressed in the current frame (and was not pressed on the previous)

  ```typescript
  if (this.engine.keyboard.iskeyDownOnce("M")) {
    // do something
  }
  ```

  [back](./README.md#Features)

## Mouse Input Manager

It is possible to manage the user mouse inputs with the the property `mouse` of the main `Engine` class.

- `isMouseButton1Down()` to check CONTINUOSLY if mouse button One has been pressed
  ```typescript
  if (this.engine.input.isMouseButton1Down()) {
    // do something
  }
  ```
- `isMouseButton1Pressed()` to check if mouse button One has been pressed in the current frame (and was not pressed on the previous)
- `isMouseButton2Down()` to check CONTINUOSLY if mouse button Two has been pressed
- `isMouseButton2Pressed()` to check if mouse button Two has been pressed in the current frame (and was not pressed on the previous)

[back](./README.md#Features)

## Camera Manager

The engine provides a simple camera manager to manage the game camera. It is used with the property `camera` of the main `Engine` class.
The camera class allows to:

- make the camera follow a gameObject with the method `this.engine.camera.focusOn(element: GameObject, currentScene: Scene)`
- animate the camera with the `this.engine.camera.zoomTo(targetZoom, duration, ease, callback)` method.
- move the camera with `this.engine.camera.moveTo(point: Point, duration, ease, callback)`
- animate on a bezier curve with `this.engine.camera.animateOnBezierCurve(start: Point, controlOne: Point, controlTwo: Point, end: Point, callback)`
- shake camera with `this.engine.camera.shake(duration: number, amplitude: number)`
- set the camera bounds with `this.engine.camera.setBounds(bounds: Rectangle)` <!-- TODO: -->

[back](./README.md#Features)

## Time Manager and Timers

It's possible to manage the game speed with the `setGameSpeed(speed)` and manage timers with the following methods:

- Run a function after a certain delay with the method `after(delay, fn)`
- Add a function that will be called count times every delay seconds with the method `every(delay, callback, repeat)`
- Run a function only during specific frames with `runOnFrameNum(frameNumbers, fn)`

[back](./README.md#Features)

## Event Manager

The engine provides a simple event manager to send and listen to events.
It's possible to send events to gameObject or to gameObject groups with the method`sendEvent(GameEvent<BasePayload> | GameEventForGroup<BasePayload>)`. It is used with the property `events` of the main `Engine` class.

```typescript
// queue a game event
this.engine.events.sendEvent(
  new GameEvent(this.engine.config.events?.Pickup, this.player, this.enemy, {
    message: "You are dead!",
  })
);
```

The class GameObject implements the method `onEventHandler(event)` to listen to game events:

```typescript
// on a GameObject
onEventHandler(event: GameEvent<BasePayload, BaseEventType> | GameEventForGroup<BasePayload, BaseEventType>) {
  console.log(`GameObject ${this.name} received event:`, event);
}

```

[back](./README.md#Features)

## Localization

The engine provide a sinple class to manage locale translations. Put in the assets folder a folder called `i18n/data` (or configure its name in the configuration object) and the engine will load the relevant json files on engine bootstrap. The default locale is the `navigator.language` so use as names of the .json files appropiate names.

## GameStats Class

The `GameStats` class is a utility class used to manage game statistics. The class provides methods to add, update, delete, and reset the values of these stats. It is used with the property `stats` of the main `Engine` class.

Here's an example of how to use it on a game scene:

```typescript
// Add a new stat key
this.engine.stats.addStatKey("killed-enemy");

// Update the value of a stat key
this.engine.stats.updateStatKey("killed-enemy", 100);

// Delete a stat key
this.engine.stats.deleteStatKey("killed-enemy");

// Reset specified stat keys to zero
this.engine.stats.cleanStatKeys(["killed-enemy"]);
```

[back](./README.md#Features)

## Storage Manager

The engine provides a simple class to manage player saving in localstorage. It is used with the property `storage` of the main `Engine` class.

```typescript
this.engine.storage.save("player-score", { kills: 45, death: 12 });
```

[back](./README.md#Features)

### Utils

- [x] Math functions for random
- [x] Object pool
- [x] CrossHair management
- [x] PIXI Filters management in dedicated class
- [x] PIXI Particles in dedicated class

[back](./README.md#Features)

## GameRoot Class

The `GameRoot` class holds the current state of the game and provides methods to manipulate it and being a GameObject can receive GameEvents. It is used with the property `game` of the main `Engine` class.

Here's an example of how to use its methods:

```typescript
export const Config: GameConfig<{ score: number }> = {
    name: 'My Game',
   ...
    // to manage game state as global object
    state: {
        score: 0,
        lives:3
    }
};


// in a scene
this.engine.game.updateState({ score: 100 }); // OR
this.engine.game.updateState((state)=> { ...state, score: state.score + 10 });

// to get the state
const score = this.engine.game.getState('score');

// to listen to state changes TODO:
this.engine.game.onStateChange('score', (newScore, oldScore) => {
    console.log('Score changed from', oldScore, 'to', newScore);
});

//to reset state
this.engine.game.resetState();
```

[back](./README.md#Features)

## Game Logic

The `GameLogic` class is responsible for managing the game's logic, checking the conditions that determine winning, losing, progression and triggering relevant events in the game.

The `engine.logic.registerGameLogicConditions(obj: GameObject, condition: 'WIN' | 'LOSE' | 'EVENT' = 'WIN')` method is used to register game logic conditions for a specific GameObject. The condition parameter determines whether the object is checked for a win condition, lose condition, or event condition. By default, the condition is set to 'WIN'.

```typescript
// the game logic is registered in the init() method of the scene
this.engine.logic.registerGameLogicConditions(this.player, "LOSE");

//in the player class add method to check the lose, win condition or specific game event
  satisfyLoseGameCondition(): boolean {
    let healthC = this.getComponent<HealthComponent>('HealthComponent')
      if (healthC?.alive) {
        return healthC.health < 0;
      };
      return false
  }
```

The GameLogic track the game logic conditions every n frames (where n is defined in the property `framesToCheckLogic` of the configuration object) by checking the win conditions, lose conditions, and event conditions. If a win condition is satisfied, a GameWon event is triggered. If a lose condition is satisfied, a GameLose event is triggered. If an event condition is satisfied, a GameEvent event is triggered.

[back](./README.md#Features)

## UIManager Class

The `UIManager` class is responsible for managing user interface (UI) objects in the game. The class provides methods to add, remove, hide, and show GameObjects.

Here's an example of how to use it in a game scene:

```typescript
// Add a GameObject to the UILayer
this.engine.ui.addUIElement("PLAYER-LIFE_BAR", new PlayerLifeBar());

// Remove GameObject from the UILayer
this.engine.ui.removeUIElement("PLAYER-LIFE_BAR");

// Show/Hide specific GameObject
this.engine.ui.showUIElementByName("PLAYER-LIFE_BAR");
this.engine.ui.hideUIElementByName("PLAYER-LIFE_BAR");

// hide / show UILayer
this.engine.ui.hideUILayer();
this.engine.ui.showUILayer();
this.engine.ui.toggleUILayerVisibility();
```

[back](./README.md#Features)
