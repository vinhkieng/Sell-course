// Đầu trang "Quản trị": dùng ở khu quản trị (KhungQuanTri) và trang hồ sơ của admin (Phần chung C9).
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import Logo from './Logo.jsx'
import AnhDaiDien from './AnhDaiDien.jsx'
import './DauTrangQuanTri.css'

function DauTrangQuanTri() {
  const { nguoiDung, dangXuat } = useAuth()

  return (
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
              <button type="button" className="kqt-dang-xuat" onClick={dangXuat}>Đăng xuất</button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default DauTrangQuanTri
