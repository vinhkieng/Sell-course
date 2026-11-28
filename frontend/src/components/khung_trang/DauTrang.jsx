// Đầu trang công khai, 4 kiểu theo người xem: khách, học viên, người cung cấp, admin (Phần chung C9).
// Màn nhỏ (dưới 1024px): menu, ô tìm kiếm, "Đăng nhập", "Đăng ký" gom vào nút ba gạch.
import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.js'
import { VAI_TRO, TEN_VAI_TRO } from '../../constants/vaiTro.js'
import { tenHienThi } from '../../utils/dinhDang.js'
import Logo from './Logo.jsx'
import AnhDaiDien from '../hien_thi/AnhDaiDien.jsx'
import './DauTrang.css'

const MENU_TAI_KHOAN = {
  [VAI_TRO.HOC_VIEN]: {
    muc: [
      ['Hồ sơ cá nhân', '/ho-so'],
      ['Khóa học của tôi', '/ho-so#khoa-hoc-cua-toi'],
      ['Lịch sử đơn hàng', '/ho-so#lich-su-don-hang'],
    ],
  },
  [VAI_TRO.NGUOI_CUNG_CAP]: {
    muc: [
      ['Hồ sơ cá nhân', '/ho-so'],
      ['Quản lý khóa học', '/ho-so#quan-ly-khoa-hoc'],
      ['Rút tiền', '/ho-so#rut-tien'],
    ],
  },
  [VAI_TRO.ADMIN]: {
    muc: [
      ['Trang quản trị', '/quan-tri/khoa-hoc'],
      ['Hồ sơ', '/ho-so'],
    ],
  },
}

const lopMucNav = ({ isActive }) => (isActive ? 'dt-dang-mo' : undefined)

// Bấm một mục trong menu xổ thì bỏ con trỏ khỏi menu để menu (mở bằng :focus-within) đóng lại
const boChon = () => document.activeElement?.blur()

function DauTrang({ danhMuc }) {
  const { nguoiDung, dangXuat } = useAuth()
  const navigate = useNavigate()
  const [moMenuDiDong, setMoMenuDiDong] = useState(false)
  const [moMenuTaiKhoan, setMoMenuTaiKhoan] = useState(false)
  const oTaiKhoan = useRef(null)

  const vaiTro = nguoiDung?.vai_tro
  const coGio = !nguoiDung || vaiTro === VAI_TRO.HOC_VIEN

  // Bấm một liên kết bất kỳ trên đầu trang (sang trang khác) thì đóng các menu đang mở
  function dongMenuKhiBamLienKet(e) {
    if (e.target.closest('a')) {
      setMoMenuDiDong(false)
      setMoMenuTaiKhoan(false)
    }
  }

  // Bấm ra ngoài menu ảnh đại diện thì đóng menu
  useEffect(() => {
    if (!moMenuTaiKhoan) return undefined
    const dong = (e) => {
      if (!oTaiKhoan.current?.contains(e.target)) setMoMenuTaiKhoan(false)
    }
    document.addEventListener('mousedown', dong)
    return () => document.removeEventListener('mousedown', dong)
  }, [moMenuTaiKhoan])

  function timKiem(e) {
    e.preventDefault()
    const chu = e.currentTarget.tu_khoa.value.trim()
    if (chu) {
      setMoMenuDiDong(false)
      navigate(`/khoa-hoc?tu_khoa=${encodeURIComponent(chu)}`)
    }
  }

  return (
    <header className="dau-trang" onClick={dongMenuKhiBamLienKet}>
      <Logo />

      <div className={`dt-mo-rong${moMenuDiDong ? ' mo' : ''}`}>
        <nav className="dt-nav">
          <div className="dt-danh-muc">
            <button type="button" className="dt-nut-danh-muc">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
              Danh mục
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
            </button>
            <div className="dt-xo">
              <div className="dt-xo-hop">
                <div className="dt-xo-tieu-de">Danh mục khóa học</div>
                {danhMuc.map((dm) => (
                  <Link key={dm.id} to={`/khoa-hoc?danh_muc=${dm.id}`} className="dt-xo-muc" onClick={boChon}>
                    {dm.ten}
                  </Link>
                ))}
                <Link to="/khoa-hoc" className="dt-xo-muc dt-xo-tat-ca" onClick={boChon}>
                  Xem tất cả khóa học
                </Link>
              </div>
            </div>
          </div>
          <NavLink to="/khoa-hoc" end className={lopMucNav}>Khóa học nổi bật</NavLink>
          {vaiTro === VAI_TRO.NGUOI_CUNG_CAP && (
            <NavLink to="/nguoi-cung-cap/tao-khoa-hoc" className={lopMucNav}>Tạo khóa học</NavLink>
          )}
          <NavLink to="/chinh-sach" className={lopMucNav}>Chính sách</NavLink>
        </nav>

        <form className="dt-tim" role="search" onSubmit={timKiem}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>
          <input name="tu_khoa" placeholder="Tìm khóa học" aria-label="Tìm khóa học" />
        </form>

        {!nguoiDung && (
          <div className="dt-khach">
            <Link to="/dang-nhap" className="dt-dang-nhap">Đăng nhập</Link>
            <Link to="/dang-ky" className="dt-dang-ky nut-sang">Đăng ký</Link>
          </div>
        )}
      </div>

      {coGio && (
        <Link to="/gio-hang" aria-label="Giỏ hàng" className="dt-tron">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 4h2l2.2 10.2a1 1 0 0 0 1 .8h8.4a1 1 0 0 0 1-.8L19 8H6" /><circle cx="9" cy="19.5" r="1.5" /><circle cx="17" cy="19.5" r="1.5" /></svg>
          {nguoiDung?.so_khoa_trong_gio > 0 && <span className="so-tron">{nguoiDung.so_khoa_trong_gio}</span>}
        </Link>
      )}

      {vaiTro === VAI_TRO.NGUOI_CUNG_CAP && (
        // Bảng thông báo mở khi bấm chuông do Phần 18 làm
        <button type="button" aria-label="Thông báo" className="dt-tron">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
          {nguoiDung.so_thong_bao_chua_doc > 0 && <span className="so-tron">{nguoiDung.so_thong_bao_chua_doc}</span>}
        </button>
      )}

      {nguoiDung && (
        <div className="dt-tai-khoan" ref={oTaiKhoan}>
          <button
            type="button"
            className="dt-nut-tai-khoan"
            aria-label="Tài khoản"
            aria-expanded={moMenuTaiKhoan}
            onClick={() => setMoMenuTaiKhoan((mo) => !mo)}
          >
            <AnhDaiDien nguoiDung={nguoiDung} />
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
          </button>
          {moMenuTaiKhoan && (
            <div className="dt-menu-tai-khoan">
              <div className="dt-menu-dau">
                <AnhDaiDien nguoiDung={nguoiDung} co={48} />
                <div>
                  <b>{tenHienThi(nguoiDung)}</b>
                  <span className={`nhan dt-nhan-vai-tro${vaiTro === VAI_TRO.ADMIN ? ' admin' : ''}`}>
                    {TEN_VAI_TRO[vaiTro]}
                  </span>
                </div>
              </div>
              {MENU_TAI_KHOAN[vaiTro].muc.map(([chu, duong]) => (
                <Link key={duong} to={duong}>{chu}</Link>
              ))}
              <button type="button" className="dt-dang-xuat" onClick={dangXuat}>Đăng xuất</button>
            </div>
          )}
        </div>
      )}

      <button
        type="button"
        className="dt-nut-ba-gach dt-tron"
        aria-label="Mở menu"
        aria-expanded={moMenuDiDong}
        onClick={() => setMoMenuDiDong((mo) => !mo)}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
      </button>
    </header>
  )
}

export default DauTrang
