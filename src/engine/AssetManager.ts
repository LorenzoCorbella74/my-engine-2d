import { Assets } from 'pixi.js';
import { sound, SoundLibrary } from '@pixi/sound';
import { SoundManager } from './SoundManager';


import { Asset, Resources } from './models/asset';

export default class AssetManager {

    private assetFileUrls = this.importAssetPaths();
    list: Asset[];
    resources: Resources = {}; // loaded resources cache
    sound: SoundLibrary;
    soundsManager: SoundManager;

    constructor(soundsManager: SoundManager) {
        this.sound = sound;
        this.soundsManager = soundsManager;
        this.list = this.generateResourceList();
    }

    private importAssetPaths() {
        const assetFiles = import.meta.glob(`/assets/**/*.*`);
        return Object.keys(assetFiles);
    }

    async loadAssetsGroup(group: string) {
        const groupAssets = this.list.filter((asset) => asset.group === group);
        for (const asset of groupAssets) {
            if (['mp3', 'ogg', 'wav'].indexOf(asset.ext) !== -1) {
                this.soundsManager.addSound(asset.name, this.sound.add(asset.name, asset.url))
            } else {
                Assets.add(asset.name, asset.url);
            }
        }

        const resources = await Assets.load(groupAssets.map((asset) => asset.name));

        console.log(`✅ Loaded assets group ${group}: `, resources);

        // updating global resource cache
        this.resources = { ...this.resources, ...resources };

        return resources;
    }

    generateResourceList() {
        const assetData: Asset[] = [];
        const assetPathRegexp =
            /assets\/(?<group>[\w.-]+)\/(?<category>[\w.-]+)\/(?<name>[\w.-]+)\.(?<ext>\w+)$/;

        this.assetFileUrls.forEach((assetPath) => {
            const match = assetPathRegexp.exec(assetPath);
            if (!match || !match.groups) {
                return console.error(
                    `Invalid asset path: ${assetPath}, should match ${assetPathRegexp}`
                );
            }

            const { group, category, name, ext } = match.groups;
            assetData.push({
                group,
                category: category as 'img' | 'data' | 'audio',
                name,
                ext,
                url: assetPath/* .replace(/.*assets/, "") */,
            });
        });
        return assetData;
    }
}