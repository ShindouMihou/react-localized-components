import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App.tsx'
import './style.css'
import React from 'react'
import {setLocalizations} from "../../src/localizations";

setLocalizations({
    "en-US": {
        "hello-world": "Hello World",
        "test": "This is a test",
    }
})

createRoot(document.querySelector('#app')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
