import { MyEngine2D } from "./Engine";

/*
    TODO: navigator.language
*/


export interface Translation {
    [key: string]: string | Translation;
}

export class LocalizationManager {

    availableLocales: string[] = [];
    localizations: Translation = {}; // loaded resources cache

    private defaultLanguage: string = this.engine.config.defaultLocale || 'en';
    private currentLanguage: string = this.defaultLanguage;

    constructor(public engine: typeof MyEngine2D) { }

    // Imposta la lingua corrente
    setLanguage(language: string): void {
        if (this.localizations[language]) {
            this.currentLanguage = language;
        } else {
            console.warn(`Traduzioni per la lingua ${language} non trovate. Utilizzando la lingua predefinita.`);
            this.currentLanguage = this.defaultLanguage;
        }
    }

    // Traduci una stringa con sostituzioni
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

    // Sostituisci i segnaposto nelle stringhe con i valori forniti
    private replacePlaceholders(translation: string, replacements: Record<string, string>): string {
        return translation.replace(/{{\s*([^}\s]+)\s*}}/g, (match, placeholder) => {
            const replacement = replacements[placeholder];
            return replacement !== undefined ? replacement : match;
        });
    }

    // Cerca la traduzione di una chiave ricorsivamente
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