import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App'
import { UserAuthProvider } from './context/userAuthContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <UserAuthProvider>
        <App />
      </UserAuthProvider>
    </BrowserRouter>
  </StrictMode>
)