# react-localized-components

[![npm version](https://badge.fury.io/js/react-localized-components.svg)](https://badge.fury.io/js/react-localized-components)
[![Build Status](https://travis-ci.org/ShindouMihou/react-localized-components.svg?branch=master)](https://travis-ci.org/ShindouMihou/react-localized-components)

**Note: This is an in-progress library. While this is designed to eventually be used in an actual mobile application, the API may be subject to change.**

A lightweight, type-safe, and easy-to-use localization library for React and React Native applications. 
It uses a Higher-Order Component (HOC) to wrap your components and automatically translate specified props.

## Features

*   **Type-Safe**: Leverages TypeScript to enforce that all defined languages have a complete set of translation keys.
*   **Simple API**: Use a factory function to create a localization instance and a Higher-Order Component to wrap your components.
*   **React & React Native**: Works seamlessly in both React and React Native projects.
*   **Targeted Props**: Specify exactly which props should be localized.

## Installation

```bash
npm install react-localized-components
```

or

```bash
yarn add react-localized-components
```

## Usage

### 1. Create a Localization Instance

Create a file to define your localizations, for example `src/localizations.ts`. Use `createLocalization` to set up your translations. The first language and its key-value pairs will serve as the schema for all other languages.

`src/localizations.ts`:
```typescript
import { createLocalization } from 'react-localized-components';

// Create a localization instance
export const localizations = createLocalization("en", {
    title: "My App",
    welcome_message: "Welcome to the application!",
    button_text: "Click Me"
})
.add("es", {
    title: "Mi Aplicación",
    welcome_message: "¡Bienvenido a la aplicación!",
    button_text: "Haz Clic"
})
.addIncomplete("fr", "en", { // Fallbacks to 'en' for missing keys
    title: "Mon Application"
});

// Export the localize HOC from your instance
export const localize = localizations.localize;
```

### 2. Create a Localized Component

Use the exported `localize` HOC to wrap any component you want to provide translations for. Pass the component and the names of the props you want to make localizable as arguments.

`src/components/MyHeader.tsx`:
```typescriptreact
import React from 'react';
import { localize } from '../localizations';

// A standard React component
const Header = (props: { text: string }) => (
  <h1>{props.text}</h1>
);

// Wrap the component, specifying the 'text' prop should be localizable
export const LocalizedHeader = localize(Header, "text");
```

### 3. Use Your Localized Component

Now you can use your new localized component. For any localized prop, pass a string with the `i18n:` prefix, followed by a key from your localization schema. The library will automatically replace it with the correct translation based on the current language.

To change the language at runtime, call the `setLanguage` method on your localization instance.

`src/App.tsx`:
```typescriptreact
import React from 'react';
import { LocalizedHeader } from './components/MyHeader';
import { localizations } from './localizations';

function App() {
  // A state management library or React Context is recommended for this.
  const forceUpdate = React.useReducer(() => ({}), {})[1];

  const changeLanguage = (lang: 'en' | 'es' | 'fr') => {
    localizations.setLanguage(lang);
    forceUpdate(); // Force re-render to apply new language
  };

  return (
    <div>
      {/* The 'text' prop will be automatically translated */}
      {/* In localized components, the value of the prop are properly type-safe and will suggest available keys */}
      <LocalizedHeader text="i18n:welcome_message" />

      <hr />
      <button onClick={() => changeLanguage('en')}>English</button>
      <button onClick={() => changeLanguage('es')}>Español</button>
      <button onClick={() => changeLanguage('fr')}>Français</button>
    </div>
  );
}

export default App;
```

## API

### `createLocalization(initialLanguage, schema)`

Creates a new localization instance.

*   **`initialLanguage`**: `string`
    *   The language code for the initial set of translations (e.g., 'en').
*   **`schema`**: `Record<string, string>`
    *   An object of key-value pairs for the initial language. This object defines the required keys for all other languages.

Returns a localization instance with the following methods:

*   **`add(lang, values)`**: Adds a complete set of translations for a new language. Throws an error if the keys don't match the schema.
*   **`addIncomplete(lang, fallbackLang, values)`**: Adds a partial set of translations. Missing keys will be filled in from the specified `fallbackLang`.
*   **`setLanguage(lang)`**: Sets the active language for the application. Throws an error if the language has not been defined.
*   **`localize(component, ...targets)`**: The HOC for making components localizable.
    *   **`component`**: `React.ComponentType<P> | React.ReactElement<P>` - The React component or element to wrap.
    *   **`...targets`**: `string[]` - A list of prop names that should be made localizable. This can be `children` or any other prop that contains a string to be translated.

### Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

### License

This project is licensed under the MIT License.