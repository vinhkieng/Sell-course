// Trang đăng nhập /dang-nhap (Phần 3), theo thiet_ke/dang_nhap/.
// Nhận ?quay_lai=<đường dẫn nội bộ> và ?tu=mua. Câu báo khi bị đẩy ra (tài khoản bị khóa, đăng nhập nơi khác)
// đến qua state.cauBao của bộ chuyển trang (Phần 1) và hiện thành dòng đỏ phía trên nút.
import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../../hooks/useAuth.js'
import { dangNhap } from '../../../api/taiKhoan.js'
import { trangSauDangNhap } from '../../../utils/trangSauDangNhap.js'
import { luuLuotCho, LUOT_XAC_NHAN_DANG_NHAP } from '../../../utils/luotChoMa.js'
import KhungTaiKhoan, { DongBao } from '../../../components/KhungTaiKhoan.jsx'
import ONhap from '../../../components/ONhap.jsx'
import './TrangDangNhap.css'

// Kiểm trước hai ô (Phần 3 mục 3.4 bước 1, 3.7)
function kiemTraHaiO({ ten_dang_nhap, mat_khau }) {
  const loi = {}
  if (!ten_dang_nhap.trim()) loi.ten_dang_nhap = 'Vui lòng nhập tên đăng nhập'
  if (!mat_khau) loi.mat_khau = 'Vui lòng nhập mật khẩu'
  else if (!/^\d{6}$/.test(mat_khau)) loi.mat_khau = 'Mật khẩu phải gồm đúng 6 chữ số'
  return loi
}

function TrangDangNhap() {
  const { nguoiDung, dangTai, setNguoiDung } = useAuth()
  const navigate = useNavigate()
  const { state, search } = useLocation()
  const [thamSo] = useSearchParams()
  const [form, setForm] = useState({ ten_dang_nhap: '', mat_khau: '' })
  const [loi, setLoi] = useState({})
  const [loiMayChu, setLoiMayChu] = useState(state?.cauBao ?? '')
  const [dangGui, setDangGui] = useState(false)

  if (dangTai) return null
  // Người đã đăng nhập mở trang đăng nhập thì về trang chủ (Phần 3 mục 3.1)
  if (nguoiDung) return <Navigate to="/" replace />

  async function guiDangNhap(e) {
    e.preventDefault()
    const loiTruoc = kiemTraHaiO(form)
    setLoi(loiTruoc)
    setLoiMayChu('')
    if (Object.keys(loiTruoc).length > 0) return

    setDangGui(true)
    try {
      const kq = await dangNhap(form)
      if (kq.can_xac_nhan) {
        // Giữ nguyên quay_lai và tu=mua để dùng sau khi xác nhận xong
        navigate(`/xac-nhan-dang-nhap${search}`, {
          state: luuLuotCho(LUOT_XAC_NHAN_DANG_NHAP, kq.gmail_che, kq.giay_cho_gui_lai),
        })
        return
      }
      navigate(trangSauDangNhap(thamSo.get('quay_lai'), kq.vai_tro), { replace: true })
      setNguoiDung(kq)
    } catch (loiGoi) {
      if (Object.keys(loiGoi.cacO).length > 0) setLoi(loiGoi.cacO)
      else setLoiMayChu(loiGoi.message)
      setDangGui(false)
    }
  }

  const doi = (ten, giaTri) => setForm((cu) => ({ ...cu, [ten]: giaTri }))

  return (
    <KhungTaiKhoan cauLon="Chào mừng bạn quay lại." cauNho="Tiếp tục lộ trình học của bạn từ bài đang dở.">
      <form className="trang-dang-nhap" onSubmit={guiDangNhap} noValidate>
        <div>
          <h1>Đăng nhập</h1>
          <p className="tk-the-mo-ta">Nhập tên đăng nhập và mật khẩu để vào học.</p>
        </div>
        {thamSo.get('tu') === 'mua' && <DongBao loai="nhac">Vui lòng đăng nhập để mua khóa học</DongBao>}

        <ONhap
          nhan="Tên đăng nhập"
          loi={loi.ten_dang_nhap}
          type="text"
          autoCapitalize="none"
          autoComplete="username"
          placeholder="Tên đăng nhập của bạn"
          value={form.ten_dang_nhap}
          onChange={(e) => doi('ten_dang_nhap', e.target.value)}
        />
        <ONhap
          nhan="Mật khẩu"
          loi={loi.mat_khau}
          type="password"
          inputMode="numeric"
          autoComplete="current-password"
          placeholder="Mật khẩu"
          value={form.mat_khau}
          onChange={(e) => doi('mat_khau', e.target.value.replace(/\D/g, '').slice(0, 6))}
        />
        <div className="tdn-quen">
          <Link to="/quen-mat-khau">Quên mật khẩu?</Link>
        </div>

        {loiMayChu && <DongBao loai="loi">{loiMayChu}</DongBao>}
        <button type="submit" className="tk-nut" disabled={dangGui}>Đăng nhập</button>
        <div className="tk-chuyen">
          Chưa có tài khoản? <Link to="/dang-ky">Đăng ký</Link>
        </div>
      </form>
    </KhungTaiKhoan>
  )
}

export default TrangDangNhap
