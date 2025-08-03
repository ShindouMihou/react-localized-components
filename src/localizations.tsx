import React from "react";

export function createLocalization<T extends Record<string, string>>(initialLanguage: string, schema: T) {
    type ConstrainedLocalizations = {
        [K in keyof T]: string;
    };

    const localizations = {
        [initialLanguage]: schema
    } as {
        [key: string]: ConstrainedLocalizations
    };

    let language = initialLanguage;
    const instance = {
        add: (lang: string, values: ConstrainedLocalizations) => {
            if (Object.keys(values).length !== Object.keys(schema).length) {
                throw new Error(`Localization for ${lang} must have exactly ${Object.keys(schema).length} keys.`);
            }
            localizations[lang] = values;
            if (!language) {
                language = lang; // Set the default language if not already set
            }
            return instance;
        },
        addIncomplete: (lang: string, fallbackLang: string, values: Partial<ConstrainedLocalizations>) => {
            const fallback = localizations[fallbackLang];
            if (!fallback) {
                throw new Error(`Fallback language ${fallbackLang} not found.`);
            }
            const completeValues: ConstrainedLocalizations = {} as ConstrainedLocalizations;
            for (const key in schema) {
                completeValues[key] = values[key] ?? fallback[key];
            }
            if (Object.keys(completeValues).length !== Object.keys(schema).length) {
                throw new Error(`Localization for ${lang} must have exactly ${Object.keys(schema).length} keys.`);
            }
            localizations[lang] = completeValues;
            if (!language) {
                language = lang; // Set the default language if not already set
            }
            return instance;
        },
        set: (localizations: {
            [key: string]: ConstrainedLocalizations
        }) => {
            for (const lang in localizations) {
                if (Object.keys(localizations[lang]).length !== Object.keys(schema).length) {
                    throw new Error(`Localization for ${lang} must have exactly ${Object.keys(schema).length} keys.`);
                }
            }
            if (!language) {
                language = Object.keys(localizations)[0]; // Set the default language if not already set
            }
            Object.assign(localizations, localizations);
            return instance;
        },
        setLanguage: (lang: string) => {
            if (!localizations[lang]) {
                throw new Error(`Language "${lang}" not found in localizations.`);
            }
            language = lang;
            return instance;
        },
        getLanguage: () => language,
        localize<
            P extends object,
            const TTargets extends readonly string[]
        >(
            component: React.ComponentType<P> | React.ReactElement<P>,
            ...targets: TTargets
        ) {
            type Targets = TTargets[number];

            const Component: React.ComponentType<P> = React.isValidElement(component)
                ? component.type as React.ComponentType<P>
                : component;

            return (props: Omit<P, Targets> & {
                /**
                 * An internalization key that starts with "i18n:" which will be used to look up the translation in the localizations object.
                 * This will automatically be replaced with the localized string based on the current language.
                 */
                [K in Targets]: K extends "children"
                    ? string
                    : `i18n:${keyof T & string}`;
            }) => {
                const translations = targets.reduce((acc, v) => {
                    const propValue = (props as Record<string, unknown>)[v];
                    if (propValue == null) {
                        return acc;
                    }
                    if (typeof propValue !== "string") {
                        throw new Error(`Property ${v} must be a string to localize.`);
                    }
                    if (!propValue.startsWith("i18n:")) {
                        throw new Error(`Property ${v} must start with "i18n:" to localize.`);
                    }
                    const key = propValue.slice(5) as keyof T;
                    if (localizations[language][key] == null) {
                        throw new Error(`Localization key "${String(key)}" not found for language "${language}".`);
                    }

                    return {
                        ...acc,
                        [v]: localizations[language][key]
                    }
                }, {});
                const translatedProps = {...props, ...translations} as P;
                return (
                    <Component {...translatedProps}/>
                )
            }
        }
    };
    return instance;
}
