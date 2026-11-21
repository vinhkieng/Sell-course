import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthProvider.jsx'
import AppRouter from './router/AppRouter.jsx'
import CuonTrang from './components/CuonTrang.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'

function App() {
  return (
    <BrowserRouter>
      <CuonTrang />
      <AuthProvider>
        <ErrorBoundary>
          <AppRouter />
        </ErrorBoundary>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
