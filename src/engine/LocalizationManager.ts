import { MyEngine2D } from "./Engine";


export interface Translation {
    [key: string]: string | Translation;
}

/**
 * Manages localization for the game engine.
 */
export class LocalizationManager {

    availableLocales: string[] = [];
    localizations: Translation = {}; // loaded resources cache

    private defaultLanguage: string;
    private currentLanguage: string;

    constructor(public engine: typeof MyEngine2D) {

        this.defaultLanguage = this.engine.config.defaultLocale || 'en' /* navigator.language */;
        this.currentLanguage = this.defaultLanguage;
    }


    /**
     * Sets the current language for localization.
     * If the specified language is not found, the default language will be used.
     * @param language - The language code to set.
     */
    setLanguage(language: string): void {
        if (this.localizations[language]) {
            this.currentLanguage = language;
        } else {
            console.warn(`Translation for language ${language} not found!. Using the default language.`);
            this.currentLanguage = this.defaultLanguage;
        }
    }


    /**
     * Translates the given key into a localized string.
     * @param key - The key to be translated.
     * @param replacements - Optional replacements for placeholders in the translated string.
     * @returns The translated string if available, otherwise the key itself.
     */
    translate(key: string, replacements?: Record<string, string>): string {
        const translation = this.findTranslation(key);
        if (translation && typeof translation === 'string') {
            // Esegui le sostituzioni se sono fornite
            if (replacements) {
                return this.replacePlaceholders(translation, replacements);
            }
            return translation;
        }
        return key; // Restituisce la chiave stessa se la traduzione non è disponibile
    }


    /**
     * Replaces placeholders in a translation string with the corresponding values from a replacements object.
     * 
     * @param translation - The translation string containing placeholders.
     * @param replacements - An object containing key-value pairs where the key is the placeholder and the value is the replacement.
     * @returns The translation string with placeholders replaced by their corresponding values.
     */
    private replacePlaceholders(translation: string, replacements: Record<string, string>): string {
        return translation.replace(/{{\s*([^}\s]+)\s*}}/g, (match, placeholder) => {
            const replacement = replacements[placeholder];
            return replacement !== undefined ? replacement : match;
        });
    }


    /**
     * Finds the translation for the given key.
     * @param key - The key to search for in the localizations.
     * @returns The translation string if found, otherwise undefined.
     */
    private findTranslation(key: string): string | undefined {
        const keys = key.split('.');
        let currentObject: Translation | string | undefined = this.localizations[this.currentLanguage];

        for (const k of keys) {
            if (currentObject && typeof currentObject === 'object') {
                currentObject = currentObject[k];
            } else {
                break;
            }
        }
        return typeof currentObject === 'string' ? currentObject : undefined;
    }
}