// Bộ chuyển trang dạng createBrowserRouter để dùng được useBlocker (hỏi lại khi rời trang, Phần 7).
// Mọi đường dẫn vẫn khai báo trong AppRouter.jsx, gắn dưới một đường "*".
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthProvider.jsx'
import { ThongBaoProvider } from './contexts/ThongBaoProvider.jsx'
import AppRouter from './router/AppRouter.jsx'
import CuonTrang from './components/he_thong/CuonTrang.jsx'
import ErrorBoundary from './components/he_thong/ErrorBoundary.jsx'

function Goc() {
  return (
    <>
      <CuonTrang />
      <AuthProvider>
        <ThongBaoProvider>
          <ErrorBoundary>
            <AppRouter />
          </ErrorBoundary>
        </ThongBaoProvider>
      </AuthProvider>
    </>
  )
}

const boChuyenTrang = createBrowserRouter([{ path: '*', element: <Goc /> }])

function App() {
  return <RouterProvider router={boChuyenTrang} />
}

export default App
