# PIXI Engine

Super basic 2D game Engine based on [Pixijs v.7](https://pixijs.com/), [Pixi Sounds v.5](https://pixijs.io/sound/examples/index.html), [GSAP V3 + pixiPlugin](https://greensock.com/docs/v3/Plugins/PixiPlugin) Typescript and Webpack. 

Just provide in the folder `game` a list of scenes included in the file `Config.ts`. 
```typescript
export const Config = {
    name: 'My Game',
    scenes: [FirstScene, SecondScene],  // the first is the startScene
    storagePrefix: 'app_',
};
```

## Features
- [x] Loader manager: all the `.png` and `.jpeg` images, `.mp3` sounds and `.json` files included in the folder `assets` will be pre loaded before the game starts and available during gameplay.
- [x] Sound manager: a map of all the .mp3 resources is available after pre loading
- [x] Scene manager
- [x] Object pool
- [x] Storage in localstorage
- [x] Time Manager + Timers
- [x] Game Logic class for win/lose conditions
- [ ] Scheduler
- [ ] 


