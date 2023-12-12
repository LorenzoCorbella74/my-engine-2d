# MY-ENGINE-2D

I have always been fascinated by video game engines and my-engine-2d is my effort in typescript and WebGL to learn how to build one. To not reinvent the wheel the engine is based on the following technologies:

- [Pixijs v.7.2](https://pixijs.com/) for rendering 2D assets,
- [Pixi Sounds v.5](https://pixijs.io/sound/examples/index.html) for sounds,
- [Pixi Particle Emitter v.5.0.8](https://github.com/pixijs/particle-emitter) for particles,
- [GSAP V3 + pixiPlugin](https://greensock.com/docs/v3/Plugins/PixiPlugin) for animations,
- [Matter-js](https://github.com/liabru/matter-js/tree/master) for physics,
- [Vite](https://vitejs.dev/) for fast builds and HMR,
- [Typescript](https://www.typescriptlang.org/)

# Features

The engine provides a series of classes, contained in the `engine` folder, that allow you to speed up the creation of a 2D game.

## Asset Manager

It is possible to load asincronously the resources placed in the assets folder and subdivided in group folder. Each folder can contain specific scene resources organised in the following mandatory sub folders:

- `audio` for audio files,
- `img` for textures,
- `data` for json data and translations.

```typescript
// after loading resources in the init() fn of your scene...
// ("sceneOne" is the name of the folder in /assets)
await this.engine.loader.loadAssetsGroup("sceneOne");

// ... you can get the sprite by using the name
//  of the file without the extension
this.engine.getAsset("rocket-launcher");
```

## GameObject Architecture and ECS

Thanks to the `Entity` decorator it is possible to instanciate Gameobject with an unique id and add them automatically to the current scene.

The engine provides several methods to search for objects and query the game world:

- `getObjectByName(game:string)`,
- `getObjectById(id:number)`
- `getGroup(name: string)` to retrieve a list of GameObjects belonging to the relevant group.

It's possible to decorate GameObjects with tags and retrieve a list of GameObject instances that match the given tags with the `getObjectsByTags(tags: string | string[], condition: 'AND' | 'OR' = 'AND')` methods (to invert use "!" before the tag):

```typescript
@Entity({
  group:'enemy'
  tags:["soldier", "robot", '!friend']
})
export class EnemyCommander extends GameObject {

  // code here..
}
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

### Gameobject Templates

The engine provides the following template objects:

- [x] Trigger
- [ ] TODO...

## Sound Manager

A map of all the .mp3 resources is available after pre loading and sounds are managed with the following methods:

- `playSound(name:string)`
- `stopSound(name:string)`
- `toggleSound(name:string)`
- `playRandomSound(keys: string[])`.
- `fadeInSound(name: string, duration: number = 1)`.
- `fadeOutSound(name: string, volume: number = 0, duration: number = 1)`.

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

The engine provide methods to change scenes with gsap transitions.

## Keyboard Input Manager

Just track the user input with:

- `iskeyDown(key)` to check CONTINUOSLY if a key has been pressed
- `iskeyDownOnce(key)` to check if a key has been pressed in the current frame (and was not pressed on the previous)

## Mouse Input Manager

Just track the mouse inputs with:

- `isMouseButton1Down()` to check CONTINUOSLY if mouse button One has been pressed
- `isMouseButton1Pressed()` to check if mouse button One has been pressed in the current frame (and was not pressed on the previous)
- `isMouseButton2Down()` to check CONTINUOSLY if mouse button Two has been pressed
- `isMouseButton2Pressed()` to check if mouse button Two has been pressed in the current frame (and was not pressed on the previous)

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

The engine provide a sinple class to manage locale translations. Put in the assets folder a folder called `i18n/data` (or configure its name in the configuration object) and the engine will load the relevant json files on engine bootstrap. The default locale is the `navigator.language` so use as names of the .json files appropiate names.

### Utils

- [x] math functions for random
- [x] Object pool
- [x] Storage in localstorage
- [x] Basic Game Logic class for win/lose conditions
- [x] CrossHair management
- [x] PIXI Filters management in dedicated class
- [x] PIXI Particles in dedicated class

## Debug

It is possible to use the Chrome Extension [Pixijs Devtools](https://chromewebstore.google.com/detail/pixijs-devtools/aamddddknhcagpehecnhphigffljadon?pli=1) and check the engine object as window.$PE.

To test physics use the 2d visualisation of the matter-js world by running in the browser devtools the function `window.$PE.physics.showPhisicsCanvas()` to show (and `window.$PE.physics.hidePhisicsCanvas()` to hide).

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
