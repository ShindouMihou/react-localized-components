# react-localized-components

[![npm version](https://badge.fury.io/js/react-localized-components.svg)](https://badge.fury.io/js/react-localized-components)
[![Build Status](https://travis-ci.org/ShindouMihou/react-localized-components.svg?branch=master)](https://travis-ci.org/ShindouMihou/react-localized-components)

**Note: This is an in-progress library. While it is intended for production use, the API may be subject to change.**

A lightweight, type-safe, and easy-to-use localization library for React and React Native applications. It uses a Higher-Order Component (HOC) to wrap your components and automatically translate specified props.

## Features

*   **Type-Safe**: Leverages TypeScript for type safety on your localization keys.
*   **Simple Higher-Order Components (HOC) API**: Easily wrap existing components to add localization capabilities, similar to `forwardRef`.
*   **React & React Native**: Works seamlessly in both React and React Native projects.
*   **Targeted Props**: Specify which props should be localized, defaulting to `children`.

## Installation

```bash
npm install react-localized-components
```

or

```bash
yarn add react-localized-components
```

## Usage

### 1. Configure Localizations

At the entry point of your application (e.g., `index.tsx` or `App.tsx`), you must provide your translation strings using `setLocalizations` and set an initial language for your app with `setLanguage`.

`src/index.tsx` or `src/App.tsx`:
```typescript
import { setLocalizations, setLanguage } from 'react-localized-components';

// Define all your translations
setLocalizations({
    en: {
        welcome: "Welcome to our app!",
        button_text: "Click Me",
        placeholder_name: "Enter your name"
    },
    es: {
        welcome: "¡Bienvenido a nuestra aplicación!",
        button_text: "Haz Clic",
        placeholder_name: "Ingresa tu nombre"
    },
});

// Set the default language for the application
setLanguage('en'); 
```

### 2. Create a Localized Component

Use the `localize` HOC to wrap any component you want to provide translations for.

`src/components/MyButton.tsx`:
```typescriptreact
import React from 'react';
import { localize } from 'react-localized-components';

// A standard React component
const Button = (props: { title: string; onPress: () => void }) => (
  <button onClick={props.onPress}>
    {props.title}
  </button>
);

// Wrap the component, specifying the 'title' prop should be localizable
export const LocalizedButton = localize(Button, { targets: ['title'] });
```

### 3. Use Your Localized Component

Now you can use your new localized component. Pass a string with the `i18n:` prefix, followed by the key from your localizations object. The library will automatically replace it with the correct translation based on the currently set language.

To change the language at runtime, call `setLanguage` with the new language code and then trigger a re-render of your application.

`src/App.tsx`:
```typescriptreact
import React from 'react';
import { LocalizedButton } from './components/MyButton';
import { setLanguage } from 'react-localized-components';

function App() {
  const handlePress = () => {
    alert('Button clicked!');
  };

  // You must trigger a re-render after changing the language.
  // A state management library or React Context is recommended for this.
  const forceUpdate = React.useReducer(() => ({}), {})[1];

  const changeLanguage = (lang: 'en' | 'es') => {
    setLanguage(lang);
    forceUpdate(); // Force re-render to apply new language
  };

  return (
    <div>
      {/* The 'title' prop will be automatically translated */}
      <LocalizedButton 
        title="i18n:button_text"
         onPress={handlePress} 
      />

      <hr />
      <button onClick={() => changeLanguage('en')}>English</button>
      <button onClick={() => changeLanguage('es')}>Español</button>
    </div>
  );
}

export default App;
```

## API

### `localize(component, options?)`

A Higher-Order Component that returns a new component with localization capabilities.

*   **`component`**: `React.ComponentType<P> | React.ReactElement<P>`
    *   The React component to wrap.
*   **`options`** (optional): `LocalizeOptions<T>`
    *   An object to configure the HOC.
    *   **`targets`**: `readonly string[]`
        *   An array of prop names that should be localized.
        *   **Default**: `['children']`

### `setLocalizations(context)`

Sets or overwrites the entire localization object for the application. This should be called once at the entry point of your app.

*   **`context`**: `Localizations`
    *   An object where keys are language codes (e.g., 'en', 'es') and values are objects of translation key-value pairs.

### `addLocalization(lang, context)`

Adds a new language and its translations to the existing set of localizations.

*   **`lang`**: `string`
    *   The language code to add (e.g., 'fr').
*   **`context`**: `Record<string, string>`
    *   An object of translation key-value pairs for the new language.

### `setLanguage(lang)`

Sets the active language for the application. Throws an error if the language has not been previously defined via `setLocalizations` or `addLocalization`.

*   **`lang`**: `string`
    *   The language code to set as active (e.g., 'en').

### `language`:

Gets the currently active language code, importable from the library.

### Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

### License

This project is licensed under the MIT License.