//The entry point of your app.
//It renders <App /> into the DOM (usually attaches to a <div id="root"> in index.html).

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
