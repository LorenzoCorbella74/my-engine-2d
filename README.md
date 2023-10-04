# MY-ENGINE-2D

I have always been fascinated by video game engines and my-engine-2d is my effort in typescript and WebGL to make my own ...ultra ligth version. To not reinvent the wheel the engine is based on the following technologies:

- [Pixijs v.7.2](https://pixijs.com/) for rendering,
- [Pixi Sounds v.5](https://pixijs.io/sound/examples/index.html) for sounds,
- [GSAP V3 + pixiPlugin](https://greensock.com/docs/v3/Plugins/PixiPlugin) for animations,
- [Matter-js](https://github.com/liabru/matter-js/tree/master) for physics,
- [Vite](https://vitejs.dev/) for fast builds and HMR,
- [Typescript](https://www.typescriptlang.org/)

# Features

The engine provides a series of classes, contained in the `engine` folder, that allow you to speed up the creation of a 2D game.

## Asset Manager

It is possible to load asincronously the resources placed in the assets folder in the relevant sub folder (audio for audio files, img for textures, data for json).

```typescript
// load in the init() fn of your scene
await this.engine.loader.loadAssetsGroup('groupOne')   // groupOne is the folder in assets/groupOne with

// get the asset
this.engine.getAsset(<asset-name>)  // use as aaset name the name of the file without the extension

```

## GameObject Architecture and ECS

Thanks to the `GameNode` decorator it is possible to instanciate game entities with an unique id, add them automatically to the current scene and be retrievable by name or id via the `getObjectByName`, `getObjectById` and `getGroup` methods.
The "Gameobject" extends the PIXI.Container, and as our Entity is composed of components. The engine provides the sprite, rigidbody and input-controller component.

```typescript
@GameNode()
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
          mask: GROUP.ENEMY | GROUP.PROJECTILE | GROUP.WALL | GROUP.ITEM,
        },
        position: {
          x: this.getComponents<SpriteComponent>("Sprite")[0].sprite.x,
          y: this.getComponents<SpriteComponent>("Sprite")[0].sprite.y,
        },
      })
    );
    this.addComponent(new InputController(this, 150));
  }
}
```

## Sound Manager

A map of all the .mp3 resources is available after pre loading and sounds are managed with the following methods:

- `playSound(<soundName>)`
- `stopSound(<soundName>)`
- `toggleSound(<soundName>)`
- `playRandomSound(<soundName>s)`.

### Scene manager

Game scenes extend PIXI.Container and allow in the init method to load asincronously the required resources of the scene.

```typescript
export class Scene extends Container {
  constructor(public engine: Engine) {
    super();
  }

  /**
   * Initialize objetct and load resources asyncronously
   */
  async init() {}

  update(dt: number, delta: number) {}

  onInputChange(inputs: any) {}

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

## Camera Manager

It's possible to focus the camera on a specific entity with the `focusOn(element: GameObject, currentScene: Scene)` method and animate the focus with the `zoomTo(targetZoom, duration)` method.

## Time Manager

It's possible to set the game speed with the `setGameSpeed(speed: number)` and manage timers with several methods.

## Event Manager

It's possible to send events to gameObject or to gameObject groups with the `sendEvent(GameEvent<BasePayload> | GameEventForGroup<BasePayload>)` method: the class GameObject implements the method `onEventHandler(event)` to listen to events.

### Utils

- [x] Keyboard and mouse management
- [x] Object pool
- [x] Storage in localstorage
- [x] Game Logic class for win/lose conditions
- [x] CrossHair management
- [x] PIXI Filters management

# Usage

```bash
# clone engine with
> npx degit https://github.com/LorenzoCorbella74/my-engine-2d.git <game-folder>

# install dependancied
> npm install

# start dev
> npm run dev

# Build for production
> npm run build
```

Before starting the app place your scenes in the `Scenes` folder, your entitites in your `entities` folder, the basic configuration of the game in `Config.ts` and you are good to go!.

```typescript
export const Config = {
  name: "My Game",
  scenes: [FirstScene, SecondScene], // the first is the start Scene
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
