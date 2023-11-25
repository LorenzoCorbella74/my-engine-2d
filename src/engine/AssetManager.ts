import { Assets } from 'pixi.js';
import { sound, SoundLibrary } from '@pixi/sound';
import { SoundManager } from './SoundManager';


import { Asset, Resources } from './models/asset';
import { MyEngine2D } from './Engine';

import { LocalizationManager } from './LocalizationManager';

export default class AssetManager {

    private assetFileUrls = this.importAssetPaths();
    list: Asset[];
    resources: Resources = {}; // loaded resources cache
    sound: SoundLibrary;
    soundsManager: SoundManager;
    localeManager: LocalizationManager;

    constructor(engine: typeof MyEngine2D) {
        this.sound = sound;
        this.soundsManager = engine.sounds;
        this.localeManager = engine.locale;
        this.list = this.generateResourceList();
    }

    private generateResourceList() {
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
    private importAssetPaths() {
        const assetFiles = import.meta.glob(`/assets/**/*.*`);
        return Object.keys(assetFiles);
    }

    async loadAssetsFolder(group: string) {
        const groupAssets = this.list.filter((asset) => asset.group === group);
        if (groupAssets) {
            for (const asset of groupAssets) {
                if (['mp3', 'ogg', 'wav'].indexOf(asset.ext) !== -1) {
                    this.soundsManager.addSound(asset.name, this.sound.add(asset.name, asset.url))
                } else {
                    if (group === 'i18n') {
                        this.localeManager.availableLocales.push(asset.name);
                    }
                    Assets.add(asset.name, asset.url);
                }
            }
            const resources = await Assets.load(groupAssets.map((asset) => asset.name));
            console.log(`✅ Loaded assets group ${group}: `, resources);
            // updating global resource cache
            if (group !== 'i18n') {
                this.resources = { ...this.resources, ...resources };
            } else {
                this.localeManager.localizations = { ...resources };
            }
            return resources;
        } else {
            console.error(`❌ No assets found for group ${group}`);
            return null;
        }
    }

}