# PIXI Engine

Super basic 2D game Engine based on:

- [Pixijs v.7](https://pixijs.com/),
- [Pixi Sounds v.5](https://pixijs.io/sound/examples/index.html),
- [ GSAP V3 + pixiPlugin](https://greensock.com/docs/v3/Plugins/PixiPlugin)
- [Typescript](https://www.typescriptlang.org/)
- [Webpack](https://webpack.js.org/)

The `src/engine` folder containes all the classes to set up in no time a game project, while in the `src/game` folder the developer must provide a list of game scenes and game entities to populate such scenes!.

The basic configuration of the game are inside `Config.ts`.

```typescript
export const Config = {
  name: "My Game",
  scenes: [FirstScene, SecondScene], // the first is the startScene
  storagePrefix: "my-game_",
  input: {
    UP: "w",
    DOWN: "s",
    RIGHT: "d",
    LEFT: "a",
    PAUSE: "p",
  },
};
```

## Features

### Loader manager

All the `.png` and `.jpeg` images, `.mp3` sounds and `.json` files included in the folder `assets` will be pre loaded before the game starts and available via the `getAsset("gameAssetName")` method.

### GameObject

Thanks to the `GameObjectEntity` and `GameObjectGroup` decorators it is possible to instanciate game entities with an unique id and add them automatically to the current scene. In the update method the engine provide the game speed delta time.

```typescript
import { PixiEngine as $PE } from "../../engine/Engine";
import { GameObjectEntity, GameObject } from "../../engine/GameObject"

@GameObjectEntity
export class Player extends GameObject {

    private speed: number;

    constructor(name, spriteName) {
        super(name, spriteName);
        this.entity.x = window.innerWidth / 2;
        this.entity.y = window.innerHeight / 2 - 100;
        this.speed = 150; // 150 px/sec
    }

    update(dt) {
        if ($PE.input.isKeyDown('UP')) {
            this.entity.y -= this.speed * dt;
        }
        .....
    }
}
```

The engine provide methods to gather the relevant entities with the `getObjectByName`, `getObjectById` and `getGroup` methods.

```typescript
import { PixiEngine as $PE } from "../../engine/Engine";
import { GameObjectEntity, GameObject } from "../../engine/GameObject"

@GameObjectEntity
export class Player extends GameObject {

    private speed: number;

    constructor(name, spriteName) {
        super(name, spriteName);
        this.entity.x = window.innerWidth / 2;
        this.entity.y = window.innerHeight / 2 - 100;
        this.speed = 150; // 150 px/sec
    }

    update(dt) {
        if ($PE.input.isKeyDown('UP')) {
            this.entity.y -= this.speed * dt;
        }
        .....
    }
}
```

### Sound Manager

A map of all the .mp3 resources is available after pre loading and sounds are managed with the following methods:

- `playSound(soundName)`
- `stopSound(soundName)`
- `toggleSound(soundName)`
- `playRandomSound(soundNames)`.

### Scene manager

Game scenes extend PIXI.Container and are detroied when the `changeScene(sceneName)` method is invoked.

```typescript
export class Scene extends PIXI.Container {
  constructor() {
    super();
  }
  // to instanciate game entities
  setup() {}
  // to detroy the scene
  destroy() {}
  // dt is 0.016sec delta is close to 1
  update(dt, delta) {}
}
```

### Camera Manager

It's possible to focus the camera on a specific entity with the `focusOn(element: GameObject, currentScene: Scene)` method and animate the focus with the `zoomTo(targetZoom, duration)` method and `zoomIn` and `zoomOut`.

### Time Manager

It's possible to set the game speed with the `setGameSpeed(speed: number)` and manage timers with the method `after(sec: number, callback: () => any, repeat?: number)`.

### Event Manager

It's possible to send events to gameObject or to gameObject groups with the `sendEvent(GameEvent<BasePayload> | GameEventForGroup<BasePayload>)` method: the class GameObject implements the method `onEventHandler(event)` to listen to events.

### Utils

- [x] Keyboard and mouse management
- [x] Object pool
- [x] Storage in localstorage
- [x] Game Logic class for win/lose conditions
- [ ] Scheduler

# TODO

- [ ] Move from Webpack to Vite
- [ ] Improve the scene management with cached scenes
- [ ] Improve timers with an animation method
