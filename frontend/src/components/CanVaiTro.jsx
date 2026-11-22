// Bộ chặn theo vai trò (Phần chung C5).
// Khách (khi choKhach không bật): chuyển sang /dang-nhap?quay_lai=<đường dẫn đang mở>.
// Sai vai trò: hiện trang 403 ngay tại đường dẫn đang mở (không có đường /khong-co-quyen).
// khungLoi: bọc trang 403 trong khung công khai, dùng cho khu vực không nằm trong khung công khai (khu quản trị).
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import TrangLoi from '../pages/chung/TrangLoi.jsx'
import KhungCongKhai from './KhungCongKhai.jsx'

function CanVaiTro({ vaiTro, choKhach = false, khungLoi = false, children }) {
  const { nguoiDung, dangTai } = useAuth()
  const { pathname, search, hash } = useLocation()

  if (dangTai) return null
  if (!nguoiDung) {
    if (choKhach) return children
    return <Navigate to={`/dang-nhap?quay_lai=${encodeURIComponent(pathname + search + hash)}`} replace />
  }
  if (!vaiTro.includes(nguoiDung.vai_tro)) {
    return khungLoi ? (
      <KhungCongKhai>
        <TrangLoi ma={403} />
      </KhungCongKhai>
    ) : (
      <TrangLoi ma={403} />
    )
  }
  return children
}

export default CanVaiTro
