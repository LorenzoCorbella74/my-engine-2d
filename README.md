# PIXI Engine

Super basic 2D game Engine based on:

- [Pixijs v.7.2](https://pixijs.com/),
- [Pixi Sounds v.5](https://pixijs.io/sound/examples/index.html),
- [ GSAP V3 + pixiPlugin](https://greensock.com/docs/v3/Plugins/PixiPlugin)
- [Typescript](https://www.typescriptlang.org/)
- [Matter-js](https://github.com/liabru/matter-js/tree/master)
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

Thanks to the `GameNode` decorator it is possible to instanciate game entities with an unique id and add them automatically to the current scene.

```typescript
import { GameObject } from "../../engine/GameObject";
import { GameNode } from "../../engine/decorators";

@GameNode({
  groupName: "Enemy",
})
export class Enemy extends GameObject {
  constructor(name, spriteName) {
    super(name, spriteName);

    // set sprite dimension
    this.sprite.width = 32;
    this.sprite.height = 32;
  }

  update(dt) {
    super.update(dt);
  }
}
```

To give an entity a phisical shape just call the method `createRigidBody` passing the required params:

```typescript
const enemy = new Enemy("Nemico", "enemy_file_name");
enemy.sprite.x = 200;
enemy.sprite.y = 200;

// create the rigidBody
enemy.createRigidBody({
  shape: "rectangle",
  isStatic: false,
  collisionFilter: {
    category: GROUP.ENEMY,
    mask: GROUP.PLAYER | GROUP.PROJECTILE | GROUP.WALL,
  },
  position: {
    x: 200,
    y: 200,
  },
});
```

The engine provide methods to gather the relevant entities with the `getObjectByName`, `getObjectById` and `getGroup` methods.

### Sound Manager

A map of all the .mp3 resources is available after pre loading and sounds are managed with the following methods:

- `playSound(soundName)`
- `stopSound(soundName)`
- `toggleSound(soundName)`
- `playRandomSound(soundNames)`.

### Scene manager

Game scenes extend PIXI.Container and are detroied when the `changeScene(sceneName)` method is invoked.

```typescript
import {Container} from "pixi.js";
import { Engine } from "./Engine";

export class Scene extends Container {
    constructor(public engine: Engine) {
        super();
    }

    setup() { }

    // destroy() { }

    // Utilizzare dt per aggiornare gli elementi della scena
    update(dt: number, delta: number) {
    }

    onInputChange(inputs) {
        // to catch inputs
    }

    onResize(width: number, height: number) {
      ...
    }
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

- [x] Game Graphic management
- [ ] Text management
- [ ] Move from Webpack to Vite
- [ ] Improve the scene management with cached scenes
