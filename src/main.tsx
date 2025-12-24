import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AppProvider } from './store/AppContext'
import { DataProvider } from './store/DataContext'
import { ErrorBoundary } from './components/common/ErrorBoundary'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <AppProvider>
          <DataProvider>
            <App />
          </DataProvider>
        </AppProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>
)
