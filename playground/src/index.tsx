import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App.tsx'
import './style.css'
import React from 'react'
import './localizations'

createRoot(document.querySelector('#app')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
