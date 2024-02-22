# MY-ENGINE-2D &#128165;

I have always been fascinated by video game engines and my-engine-2d is my effort in typescript and WebGL to learn how to build one. To not reinvent the wheel the engine is based on the following technologies:

- [Pixijs v.7.2](https://pixijs.com/) for rendering 2D assets,
- [Pixi Sounds v.5](https://pixijs.io/sound/examples/index.html) for sounds,
- [Pixi Particle Emitter v.5.0.8](https://github.com/pixijs/particle-emitter) for particles,
- [GSAP V3 + pixiPlugin](https://greensock.com/docs/v3/Plugins/PixiPlugin) for animations,
- [Matter-js](https://github.com/liabru/matter-js/tree/master) for physics,
- [Vite](https://vitejs.dev/) for fast builds and HMR,
- [Typescript](https://www.typescriptlang.org/)

## Features &#128163;

The engine provides a series of abstractions, contained in the `engine` folder, that allow to speed up the creation of a 2D game in WebGL.

- [Asset Manager](./Docs.md#asset-manager)
- [GameObject Architecture and ECS](./Docs.md#gameobject-architecture-and-ecs)
- [Sound Manager](./Docs.md#sound-manager)
- [Scene Manager](./Docs.md#scene-manager)
- [Keyboard Input Manager](./Docs.md#keyboard-input-manager)
- [Mouse Input Manager](./Docs.md#mouse-input-manager)
- [Camera Manager](./Docs.md#camera-manager)
- [Time Manager and Timers](./Docs.md#time-manager-and-timers)
- [Event Manager](./Docs.md#event-manager)
- [Localization](./Docs.md#localization)
- [GameStats ](./Docs.md#gamestats-class)
- [Storage Manager](./Docs.md#storage-manager)
- [Utils](./Docs.md#utils)
- [Debug](./Docs.md#debug)
- [Game Logic](./Docs.md#game-logic)
- [UIManager](./Docs.md#uimanager-class)

Due to the fact that the engine is in continuous development, the documentation is not exhaustive and the features are not yet complete. Please be patient and feel free to contribute &#128521;.

## Debug &#128301;

It is possible to use the Chrome Extension [Pixijs Devtools](https://chromewebstore.google.com/detail/pixijs-devtools/aamddddknhcagpehecnhphigffljadon?pli=1) and check the engine object as `window.$PE`.

To test physics use the 2d visualisation of the matter-js world by running in the browser devtools the function `window.$PE.physics.showPhisicsCanvas()` to show (and `window.$PE.physics.hidePhisicsCanvas()` to hide).

## Usage &#128296;

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

Before starting the app place your scenes in the `/Game/Scenes` folder, the basic configuration of the game in `/Game/Config.ts` and you are good to go!.

```typescript
export const Config: GameConfig<{ score: number }> = {
  name: "My Game",
  scenes: [FirstScene, SecondScene, MatterScene, GraphicScene], // the first is the startScene
  storagePrefix: "MyGame_", // to store in localstorage
  engineLogPrefix: "[MY-ENGINE-2D]: ", // to log in console
  // defaultLocale: 'en',
  // localeFolder: 'i18n',
  // set your input here...
  input: {
    UP: "w",
    DOWN: "s",
    RIGHT: "d",
    LEFT: "a",
    DEBUG: "i",
    ACTION: "e",
  },
  // place your events here...
  events: {
    Collision: "Collision",
    Pickup: "Pickup",
    CustomEvent: "CustomEvent",
    UpdateForUI: "UpdateForUI",
  },
  // to manage game state as global object
  state: {
    score: 0,
    lives: 3,
  },
  // run gameLogic each n frame
  framesToCheckLogic: [1, 30],
};
```

## [VSC Snippets](./VSC_snippets.md)
