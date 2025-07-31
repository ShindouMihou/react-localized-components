import type {Localizations} from "./types/localizations";

export let language = "en-US";
export let localizations = {} as Localizations;

export function addLocalization(lang: string, context: Record<string, string>) {
    localizations[lang] = context;
}

export function setLocalizations(context: Localizations) {
    localizations = context;
}

export function setLanguage(lang: string) {
    if (!localizations[lang]) {
        throw new Error(`Language ${lang} not found in contexts.`);
    }
    language = lang;
}