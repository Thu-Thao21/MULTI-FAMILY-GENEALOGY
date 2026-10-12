import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import { FamilyProvider } from './context/FamilyContext'
import { ToastProvider } from './shared/common/Toast'
import './styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <FamilyProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </FamilyProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
