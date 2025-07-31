import React from "react";
import type {LocalizeOptions} from "./types/options";
import {language, localizations} from "./localizations";

const defaultOptions = {
    targets: ["children"]
} as const;

type DefaultTargets = {
    targets: readonly ["children"];
};

export function localize<
    P extends object,
    const T extends readonly string[]
>(
    component: React.ComponentType<P> | React.ReactElement<P>,
    options?: LocalizeOptions<T>
) {
    const opts = {...defaultOptions, ...options};
    type Targets = T extends readonly string[] ? T[number] : DefaultTargets;

    const Component: React.ComponentType<P> = React.isValidElement(component)
        ? component.type as React.ComponentType<P>
        : component;

    return (props: Omit<P, Targets> & {
        /**
         * An internalization key that starts with "i18n:" which will be used to look up the translation in the localizations object.
         * This will automatically be replaced with the localized string based on the current language.
         */
        [K in Targets]: string;
    }) => {
        const translations = (opts.targets ?? defaultOptions.targets).reduce((acc, v) => {
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
            return {
                ...acc,
                [v]: localizations[language][propValue.slice(5)]
            }
        }, {});
        const translatedProps = {...props, ...translations} as P;
        return (
            <Component {...translatedProps}/>
        )
    }
}