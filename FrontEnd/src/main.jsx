import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "@fontsource/passion-one/400.css";
import "@fontsource-variable/space-grotesk";
import "@fontsource-variable/jetbrains-mono";
import "@fontsource/dm-serif-display/400-italic.css";
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
