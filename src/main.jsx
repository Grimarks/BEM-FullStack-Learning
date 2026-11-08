import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "@fontsource/passion-one/400.css";            // judul besar  → --font-display
import "@fontsource-variable/space-grotesk";          // teks biasa   → --font-sans
import "@fontsource-variable/jetbrains-mono";         // label kecil  → --font-mono
import "@fontsource/dm-serif-display/400-italic.css"; // teks miring  → --font-serif
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
