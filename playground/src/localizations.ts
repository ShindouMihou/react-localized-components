import {createLocalization} from "../../src";

export const localizations = createLocalization("en", {
    title: "Playground",
    description: "This is a playground for testing and experimenting with the library."
})
    .addIncomplete("cn", "en", {
        title: "Nihao",
    });

localizations.setLanguage("cn");
export const localize = localizations.localize;