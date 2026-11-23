// Khai báo đường dẫn của web (Phần chung C7). Đường dẫn viết tiếng Việt không dấu, nối bằng gạch ngang.
// Không có đường /khong-co-quyen: sai vai trò thì hiện trang 403 ngay tại đường dẫn đang mở (Phần chung C5).
import { Navigate, Route, Routes } from 'react-router-dom'
import { VAI_TRO } from '../constants/vaiTro.js'
import KhungCongKhai from '../components/KhungCongKhai.jsx'
import KhungQuanTri from '../components/KhungQuanTri.jsx'
import CanVaiTro from '../components/CanVaiTro.jsx'
import TrangLoi from '../pages/chung/TrangLoi.jsx'
import TrangChinhSach from '../pages/chung/TrangChinhSach.jsx'
import TrangDangKy from '../pages/chung/TrangDangKy.jsx'
import TrangDangNhap from '../pages/chung/TrangDangNhap.jsx'
import TrangXacNhanDangNhap from '../pages/chung/TrangXacNhanDangNhap.jsx'

// tạm: 8 trang khu quản trị mới có tiêu đề như thiết kế; Phần 6, 19-24 thay bằng trang thật
const TRANG_QUAN_TRI = [
  ['khoa-hoc', 'Khóa học'],
  ['bao-cao-khoa-hoc', 'Báo cáo khóa học'],
  ['bao-cao-danh-gia', 'Báo cáo đánh giá'],
  ['nguoi-dung', 'Người dùng'],
  ['danh-muc', 'Danh mục'],
  ['don-hang', 'Đơn hàng'],
  ['rut-tien', 'Yêu cầu rút tiền'],
  ['chinh-sach', 'Chính sách và điều khoản'],
]

function AppRouter() {
  return (
    <Routes>
      <Route element={<KhungCongKhai />}>
        {/* tạm: trang chủ mới có đầu trang và chân trang, Phần 9 làm phần giữa */}
        <Route index element={null} />
        <Route path="chinh-sach" element={<TrangChinhSach />} />
        {/* tạm: chỉ có bộ chặn vai trò, khách và học viên thấy 404 cho tới Phần 12 */}
        <Route
          path="gio-hang"
          element={
            <CanVaiTro vaiTro={[VAI_TRO.HOC_VIEN]} choKhach>
              <TrangLoi ma={404} />
            </CanVaiTro>
          }
        />
        <Route path="*" element={<TrangLoi ma={404} />} />
      </Route>

      {/* Trang tài khoản: không có đầu trang công khai, không có chân trang (Phần chung C9) */}
      <Route path="dang-ky" element={<TrangDangKy />} />
      <Route path="dang-nhap" element={<TrangDangNhap />} />
      <Route path="xac-nhan-dang-nhap" element={<TrangXacNhanDangNhap />} />

      <Route
        path="quan-tri"
        element={
          <CanVaiTro vaiTro={[VAI_TRO.ADMIN]} khungLoi>
            <KhungQuanTri />
          </CanVaiTro>
        }
      >
        <Route index element={<Navigate to="khoa-hoc" replace />} />
        {TRANG_QUAN_TRI.map(([duong, tieuDe]) => (
          <Route key={duong} path={duong} element={<h1 className="kqt-tieu-de">{tieuDe}</h1>} />
        ))}
      </Route>
    </Routes>
  )
}

export default AppRouter
