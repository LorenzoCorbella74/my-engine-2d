# MY-ENGINE-2D

I have always been fascinated by video game engines and my-engine-2d is my effort in typescript and WebGL to make my own ...ultra ligth version. To not reinvent the wheel the engine is based on the following technologies:

- [Pixijs v.7.2](https://pixijs.com/) for rendering,
- [Pixi Sounds v.5](https://pixijs.io/sound/examples/index.html) for sounds,
- [Pixi Particle Emitter v.5.0.8](https://github.com/pixijs/particle-emitter) for particles,
- [GSAP V3 + pixiPlugin](https://greensock.com/docs/v3/Plugins/PixiPlugin) for animations,
- [Matter-js](https://github.com/liabru/matter-js/tree/master) for physics,
- [Vite](https://vitejs.dev/) for fast builds and HMR,
- [Typescript](https://www.typescriptlang.org/)

# Features

The engine provides a series of classes, contained in the `engine` folder, that allow you to speed up the creation of a 2D game.

## Asset Manager

It is possible to load asincronously the resources placed in the assets folder and subdivided in group folder. Each folder can contain specific scene resources organised in sub folders (`audio` for audio files, `img` for textures, `data` for json).

```typescript
// load in the init() fn of your scene
await this.engine.loader.loadAssetsGroup("sceneOne"); // "sceneOne" is the name of the folder in /assets

// get the sprite
this.engine.getAsset("rocket-launcher"); // use as asset name the name of the file without the extension
```

## GameObject Architecture and ECS

Thanks to the `GameNode` decorator it is possible to instanciate game entities with an unique id, add them automatically to the current scene and be retrievable by name or id via the `getObjectByName`, `getObjectById` and `getGroup` methods.

The "Gameobject" extends the PIXI.Container, and being the "Entity" is composed of components. The engine provides out of the box:

- sprite component
- rigidbody component to manage collision of rigid bodies
- script component to manage custom logic
- input-controller component to manage the entity via user inputs

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
          x: 0,
          y: 0,
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

## Keyboard and Mouse Input Manager

Just track the user input with:

- `iskeyDown(key)` to check CONTINUOSLY if a key has been pressed
- `iskeyDownOnce(key)` to check if a key has been pressed in the current frame (and was not pressed on the previous)

## Camera Manager

The camera class allows to:

- make the camera follow a gameObject with `focusOn(element: GameObject, currentScene: Scene)`
- animate the camera with the `zoomTo(targetZoom, duration, ease, callback)` method.
- move the camera with `moveTo(point: Point, duration, ease, callback)`
- animate on a bezier curve with `animateOnBezierCurve(start: Point, controlOne: Point, controlTwo: Point, end: Point, callback)`
- shake camera with `shake(duration: number, amplitude: number)`

## Time Manager and Timers

It's possible to manage the game speed with the `setGameSpeed(speed)` and manage timers with the following methods:

- Run a function after a certain delay with the method `after(delay, fn)`
- Add a function that will be called count times every delay seconds with the method `every(delay, callback, repeat)`
- Run a function only during specific frames with `runOnFrameNum(frameNumbers, fn)`

## Event Manager

It's possible to send events to gameObject or to gameObject groups with the method`sendEvent(GameEvent<BasePayload> | GameEventForGroup<BasePayload>)`.

The class GameObject implements the method `onEventHandler(event)` to listen to events.

## Localization

The engine provide a sinple class to manage locale translations. Put in the assets folder a folder called `i18n` or configure its name in the configuration object and the engine will load the relevant json files on engine bootstrap. The default locale is the `navigator.language` so use as names of the .json files appropiate names.

### Utils

- [x] Object pool
- [x] Storage in localstorage
- [x] Basic Game Logic class for win/lose conditions
- [x] CrossHair management
- [x] PIXI Filters management in dedicated class
- [x] PIXI Particles in dedicated class

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
  // defaultLocale: 'en',
  // localeFolder: 'i18n',
  input: {
    UP: "w",
    DOWN: "s",
    RIGHT: "d",
    LEFT: "a",
    PAUSE: "p",
  },
};
```
