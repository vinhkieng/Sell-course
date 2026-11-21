// Khai báo đường dẫn của web (Phần chung C7). Đường dẫn viết tiếng Việt không dấu, nối bằng gạch ngang.
// Khung dự án chưa có trang nào: mọi đường dẫn đều hiện trang 404 tạm bên dưới.
// Phần 1 làm khung trang dùng chung, trang Chính sách, trang 403 và 404 theo thiết kế rồi thay trang tạm này.
// Không có đường /khong-co-quyen: sai vai trò thì hiện trang 403 ngay tại đường dẫn đang mở (Phần chung C5).
import { Route, Routes } from 'react-router-dom'

function TrangTam404() {
  return (
    <main className="khung-noi-dung trang-tam">
      <p className="trang-tam-so">404</p>
      <h1>Không tìm thấy trang</h1>
      <p>Đây là trang tạm của khung dự án. Phần 1 sẽ làm trang này theo thiết kế.</p>
    </main>
  )
}

function AppRouter() {
  return (
    <Routes>
      <Route path="*" element={<TrangTam404 />} />
    </Routes>
  )
}

export default AppRouter
