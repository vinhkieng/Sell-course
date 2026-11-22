import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthProvider.jsx'
import { ThongBaoProvider } from './contexts/ThongBaoProvider.jsx'
import AppRouter from './router/AppRouter.jsx'
import CuonTrang from './components/CuonTrang.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'

function App() {
  return (
    <BrowserRouter>
      <CuonTrang />
      <AuthProvider>
        <ThongBaoProvider>
          <ErrorBoundary>
            <AppRouter />
          </ErrorBoundary>
        </ThongBaoProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
