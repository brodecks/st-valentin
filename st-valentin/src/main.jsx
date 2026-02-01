import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Valentine from './valentine.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Valentine />
  </StrictMode>,
)
