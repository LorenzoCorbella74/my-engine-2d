# PIXI Engine

Super basic 2D game Engine based on [Pixijs v.7](https://pixijs.com/), [Pixi Sounds v.5](https://pixijs.io/sound/examples/index.html), [GSAP V3 + pixiPlugin](https://greensock.com/docs/v3/Plugins/PixiPlugin) Typescript and Webpack.

Just provide in the folder `src/game` a list of scenes included in the file `Config.ts`.

```typescript
export const Config = {
  name: "My Game",
  scenes: [FirstScene, SecondScene], // the first is the startScene
  storagePrefix: "app_",
};
```

## Features

### Loader manager

All the `.png` and `.jpeg` images, `.mp3` sounds and `.json` files included in the folder `assets` will be pre loaded before the game starts and available via the `getAsset("gameAssetName")` method.

### Sound manager

A map of all the .mp3 resources is available after pre loading and sounds are managed via the following methods:

- `playSound(soundName)`
- `stopSound(soundName)`
- `toggleSound(soundName)`
- `playRandomSound(soundNames)`.

### Scene manager

Game scenes can be changed via the `changeScene(sceneName)` method. <!-- TODO  scene should be cached -->

### Camera Manager

It's possible to focus the camera on a specific entity with the focusOn(element: GameObject, currentScene: Scene) method and animate the focus with the `zoomTo(targetZoom, duration)` method and `zoomIn` and `zoomOut`.

### Time Manager

It's possible to set the game spped with the `setGameSpeed(speed: number)` and manage timers with the `after(sec: number, callback: () => any, repeat?: number)`

### Utils

- [x] Object pool
- [x] Storage in localstorage
- [x] Game Logic class for win/lose conditions
- [ ] Scheduler
