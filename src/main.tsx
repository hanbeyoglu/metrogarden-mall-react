import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/styles/globals.css'
import '@/i18n/i18n'
import { App } from './App'

const container = document.getElementById('root')

if (!container) {
  throw new Error(
    'Root element #root not found. Ensure index.html contains <div id="root"></div>.',
  )
}

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
