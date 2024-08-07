# MY-ENGINE-2D &#128165;

I have always been fascinated by video game engines and my-engine-2d is my effort in typescript and WebGL to learn how to build one. To not reinvent the wheel the engine is based on the following technologies:

- [Pixijs v.8.2.5](https://pixijs.com/) for rendering 2D assets,
- [Pixi Sounds v.6](https://pixijs.io/sound/examples/index.html) for sounds,
- [Pixi Particle Emitter v.5.0.8](https://github.com/pixijs/particle-emitter) for particles (as of 07/2024 the package is not updated for PixiJs V8 and this [fork](@barvynkoa/particle-emitter) was used ([official thread](https://github.com/pixijs/particle-emitter/issues/211)),
- [GSAP V3 + pixiPlugin](https://greensock.com/docs/v3/Plugins/PixiPlugin) for animations,
- [Matter-js](https://github.com/liabru/matter-js/tree/master) for physics,
- [Vite](https://vitejs.dev/) for fast builds and HMR,
- [Typescript](https://www.typescriptlang.org/)

## Features &#128163;

The engine provides a series of abstractions, contained in the `engine` folder, that allow to speed up the creation of a 2D game in WebGL.

- [Asset Manager](./Docs.md#asset-manager)
- [ScreenManager](./Docs.md#screenmanager)
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

Due to the fact that the engine is in continuous development, **the documentation is not exhaustive and the features are not yet complete**. Please be patient and feel free to contribute &#128521;.

## Debug &#128301;

It is possible to use the Chrome Extension [Pixijs Devtools](https://chromewebstore.google.com/detail/pixijs-devtools/aamddddknhcagpehecnhphigffljadon?pli=1) and check the engine object as `window.$PE`.

To test physics use the 2d visualisation of the matter-js world by running in the browser devtools the function `$PE.physics.showPhisicsCanvas()` to show and `$PE.physics.hidePhisicsCanvas()` to hide.

## Usage &#128296;

Download the [companion cli](https://github.com/LorenzoCorbella74/mye2d-cli) to create a game project, and start adding scenes and gameobject!
```bash
# download the my-engine-2d CLI
> npm install -g mye2d@0.0.6
# create a game project in a folder <project_name>
> mye2D --new <project_name>

# start dev
> npm run dev

# Build for production
> npm run build

# add game scenes and gameobject
> mye2D --scene <scene_name>
> mye2D  --gameobject <name> <scene_name>
```

Game scenes are placed in the `src/Game/Scenes` folder, while the basic configuration of the game is in `src/Game/Config.ts`.

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
  // aspectRatio: '16:9' as default. Can be, 16:10, 4:3, 3:2 , 1:1
  // fullscreen: true (default false)
};
```

## References:
- [Migration to V8](https://pixijs.com/8.x/guides/migrations/v8#3-deprecated-features)
- [optimisation](https://cprimozic.net/notes/posts/pixi-js-optimizations/)

## [VSC Snippets](./VSC_snippets.md)
