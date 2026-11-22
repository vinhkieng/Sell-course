// Khung khu quản trị: đầu trang "Quản trị" và menu dọc 8 mục, không có chân trang (Phần chung C9).
// Theo thiet_ke/quan_tri_khoa_hoc/danh_sach_khoa_hoc.html.
import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import { laySoChoXuLy } from '../api/khung.js'
import Logo from './Logo.jsx'
import AnhDaiDien from './AnhDaiDien.jsx'
import './KhungQuanTri.css'

// [chữ, đường dẫn, hình, tên số tròn (trường trong GET /api/quan-tri/so-cho-xu-ly), kiểu số tròn]
const MUC = [
  ['Khóa học', 'khoa-hoc', <path key="h" d="M4 5h16v11H4zM8 20h8M12 16v4" />],
  ['Báo cáo khóa học', 'bao-cao-khoa-hoc', <path key="h" d="M5 21V4M5 4h11l-2 4 2 4H5" />, 'bao_cao_khoa_hoc', 'do'],
  ['Báo cáo đánh giá', 'bao-cao-danh-gia', <path key="h" d="m12 3.5 2.6 5.3 5.9.9-4.2 4.1 1 5.8L12 16.9l-5.3 2.7 1-5.8L3.5 9.7l5.9-.9z" />, 'bao_cao_danh_gia', 'do'],
  ['Người dùng', 'nguoi-dung', <g key="h"><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14.5a6.5 6.5 0 0 1 3.5 5.5" /></g>],
  ['Danh mục', 'danh-muc', <g key="h"><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></g>],
  ['Đơn hàng', 'don-hang', <g key="h"><path d="M3 4h2l2.2 10.2a1 1 0 0 0 1 .8h8.4a1 1 0 0 0 1-.8L19 8H6" /><circle cx="9" cy="19.5" r="1.5" /><circle cx="17" cy="19.5" r="1.5" /></g>],
  ['Yêu cầu rút tiền', 'rut-tien', <g key="h"><rect x="3" y="6" width="18" height="12" rx="2" /><circle cx="12" cy="12" r="2.5" /></g>, 'yeu_cau_rut_tien', 'vang'],
  ['Chính sách', 'chinh-sach', <g key="h"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5M9 13h6M9 17h6" /></g>],
]

function KhungQuanTri() {
  const { nguoiDung } = useAuth()
  const { pathname } = useLocation()
  const [so, setSo] = useState({})

  // Đọc lại ba con số mỗi lần chuyển mục, để số cập nhật sau khi admin xử lý xong
  useEffect(() => {
    laySoChoXuLy().then(setSo, () => {})
  }, [pathname])

  return (
    <div className="khung-quan-tri">
      <header className="kqt-dau">
        <div className="kqt-dau-ruot">
          <Logo />
          <span className="nhan kqt-nhan">Quản trị</span>
          <div className="kqt-tai-khoan">
            <button type="button" className="kqt-nut-tai-khoan" aria-label="Tài khoản admin">
              <AnhDaiDien nguoiDung={nguoiDung} co={40} />
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
            </button>
            <div className="kqt-xo">
              <div className="kqt-menu">
                <Link to="/quan-tri/khoa-hoc">Trang quản trị</Link>
                <Link to="/ho-so">Hồ sơ</Link>
                {/* Phần 3 nối việc đăng xuất */}
                <button type="button" className="kqt-dang-xuat">Đăng xuất</button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="kqt-than">
        <aside className="hop kqt-menu-doc">
          <nav>
            {MUC.map(([chu, duong, hinh, tenSo, kieuSo]) => (
              <NavLink key={duong} to={`/quan-tri/${duong}`} className={({ isActive }) => `kqt-muc${isActive ? ' on' : ''}`}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{hinh}</svg>
                <span className="kqt-muc-chu">{chu}</span>
                {so[tenSo] > 0 && <em className={`kqt-so ${kieuSo}`}>{so[tenSo]}</em>}
              </NavLink>
            ))}
          </nav>
        </aside>
        <main className="kqt-giua">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default KhungQuanTri
