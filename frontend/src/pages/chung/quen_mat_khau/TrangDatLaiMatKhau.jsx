// Trang đặt lại mật khẩu /dat-lai-mat-khau (Phần 4 mục 4.3), theo thiet_ke/quen_mat_khau/dat_lai_mat_khau.html.
// Gmail đã nhập và thời điểm hết đếm ngược lấy từ state của bộ chuyển trang, không có thì từ sessionStorage;
// cả hai đều không có thì về /quen-mat-khau.
import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../hooks/useAuth.js'
import { useThongBao } from '../../../hooks/useThongBao.js'
import { useDemNguoc } from '../../../hooks/useDemNguoc.js'
import { datLaiMatKhau, guiLaiMaDatLai } from '../../../api/taiKhoan.js'
import { docLuotCho, luuLuotCho, xoaLuotCho, LUOT_DAT_LAI_MAT_KHAU as KHOA } from '../../../utils/luotChoMa.js'
import KhungTaiKhoan, { DongBao } from '../../../components/khung_trang/KhungTaiKhoan.jsx'
import ONhap from '../../../components/bieu_mau/ONhap.jsx'
import './TrangDatLaiMatKhau.css'

const MA_SAI = 'Mã xác nhận không đúng hoặc đã hết hạn'
const sauSo = (chu) => chu.replace(/\D/g, '').slice(0, 6)

// Kiểm trước khi gửi, chỉ dùng câu có trong Phần 4 mục 4.7
function kiemTra({ ma, mat_khau_moi, nhap_lai }) {
  const loi = {}
  if (!/^\d{6}$/.test(ma)) loi.ma = MA_SAI
  if (!/^\d{6}$/.test(mat_khau_moi)) loi.mat_khau_moi = 'Mật khẩu phải gồm đúng 6 chữ số'
  if (!nhap_lai || nhap_lai !== mat_khau_moi) loi.nhap_lai = 'Mật khẩu nhập lại không khớp'
  return loi
}

function TrangDatLaiMatKhau() {
  const { nguoiDung, dangTai } = useAuth()
  const navigate = useNavigate()
  const { state } = useLocation()
  const hienThongBao = useThongBao()
  const [luot, setLuot] = useState(() => (state?.gmail ? state : docLuotCho(KHOA)))
  const [form, setForm] = useState({ ma: '', mat_khau_moi: '', nhap_lai: '' })
  const [loi, setLoi] = useState({})
  const [dangGui, setDangGui] = useState(false)
  const conLai = useDemNguoc(luot?.het_dem_luc ?? 0)

  if (dangTai) return null
  if (nguoiDung) return <Navigate to="/" replace />
  if (!luot) return <Navigate to="/quen-mat-khau" replace />

  const doi = (ten, giaTri) => setForm((cu) => ({ ...cu, [ten]: giaTri }))

  async function guiDatLai(e) {
    e.preventDefault()
    const loiTruoc = kiemTra(form)
    setLoi(loiTruoc)
    if (Object.keys(loiTruoc).length > 0) return

    setDangGui(true)
    try {
      await datLaiMatKhau({ gmail: luot.gmail, ...form })
      xoaLuotCho(KHOA)
      hienThongBao('Đặt lại mật khẩu thành công, vui lòng đăng nhập')
      navigate('/', { replace: true })
    } catch (loiGoi) {
      if (Object.keys(loiGoi.cacO).length > 0) setLoi(loiGoi.cacO)
      else hienThongBao(loiGoi.message, 'loi')
      setDangGui(false)
    }
  }

  // Gửi lại thành công: chỉ đếm lại 60 giây và xóa chữ đỏ dưới ô mã
  async function guiLai() {
    try {
      await guiLaiMaDatLai(luot.gmail)
      setLuot(luuLuotCho(KHOA, luot.gmail, 60))
      setLoi((cu) => ({ ...cu, ma: undefined }))
    } catch (loiGoi) {
      if (loiGoi.them.giay_cho_gui_lai) {
        setLuot(luuLuotCho(KHOA, luot.gmail, loiGoi.them.giay_cho_gui_lai))
        setLoi((cu) => ({ ...cu, ma: loiGoi.message }))
      } else {
        hienThongBao(loiGoi.message, 'loi')
      }
    }
  }

  return (
    <KhungTaiKhoan
      cauLon="Gần xong rồi."
      cauNho="Nhập mã xác nhận và chọn mật khẩu mới cho tài khoản của bạn."
    >
      <form className="trang-dat-lai" onSubmit={guiDatLai} noValidate>
        <h1>Đặt lại mật khẩu</h1>
        <DongBao loai="thong-tin">
          Nếu Gmail này đã đăng ký, mã xác nhận đã được gửi. Vui lòng kiểm tra hộp thư.
        </DongBao>
        <div className="tdl-gmail">
          Gmail bạn đã nhập: <b>{luot.gmail}</b>{' '}
          <Link to="/quen-mat-khau" onClick={() => xoaLuotCho(KHOA)}>Nhập lại Gmail</Link>
        </div>

        <ONhap
          nhan="Mã xác nhận"
          loi={loi.ma}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          placeholder="Nhập mã gồm 6 chữ số"
          value={form.ma}
          onChange={(e) => doi('ma', sauSo(e.target.value))}
        />
        <ONhap
          nhan="Mật khẩu mới"
          loi={loi.mat_khau_moi}
          goiY="Mật khẩu gồm 6 chữ số"
          type="password"
          inputMode="numeric"
          autoComplete="new-password"
          placeholder="Mật khẩu mới"
          value={form.mat_khau_moi}
          onChange={(e) => doi('mat_khau_moi', sauSo(e.target.value))}
        />
        <ONhap
          nhan="Nhập lại mật khẩu mới"
          loi={loi.nhap_lai}
          type="password"
          inputMode="numeric"
          autoComplete="new-password"
          placeholder="Nhập lại mật khẩu mới"
          value={form.nhap_lai}
          onChange={(e) => doi('nhap_lai', sauSo(e.target.value))}
        />

        <button type="submit" className="tk-nut" disabled={dangGui}>Đặt lại mật khẩu</button>
        <div className="tdl-gui-lai">
          Chưa nhận được mã?{' '}
          {conLai > 0 ? (
            <span className="tdl-cho" aria-disabled="true">
              Gửi lại mã (<b>{conLai}s</b>)
            </span>
          ) : (
            <button type="button" onClick={guiLai}>Gửi lại mã</button>
          )}
        </div>
      </form>
    </KhungTaiKhoan>
  )
}

export default TrangDatLaiMatKhau
