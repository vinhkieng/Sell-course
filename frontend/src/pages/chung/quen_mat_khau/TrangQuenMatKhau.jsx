// Trang quên mật khẩu /quen-mat-khau (Phần 4 mục 4.3), theo thiet_ke/quen_mat_khau/quen_mat_khau.html.
import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../hooks/useAuth.js'
import { useThongBao } from '../../../hooks/useThongBao.js'
import { quenMatKhau } from '../../../api/taiKhoan.js'
import { luuLuotCho, LUOT_DAT_LAI_MAT_KHAU } from '../../../utils/luotChoMa.js'
import KhungTaiKhoan from '../../../components/KhungTaiKhoan.jsx'
import ONhap from '../../../components/ONhap.jsx'
import './TrangQuenMatKhau.css'

const GMAIL_SAI = 'Gmail không đúng định dạng. Ví dụ: ten@gmail.com'

function TrangQuenMatKhau() {
  const { nguoiDung, dangTai } = useAuth()
  const navigate = useNavigate()
  const hienThongBao = useThongBao()
  const [gmail, setGmail] = useState('')
  const [loi, setLoi] = useState('')
  const [dangGui, setDangGui] = useState(false)

  if (dangTai) return null
  if (nguoiDung) return <Navigate to="/" replace />

  async function guiMa(e) {
    e.preventDefault()
    // Đổi chữ thường trước khi kiểm như máy chủ; để trống cũng báo câu này (Phần 4 mục 4.3, 4.7)
    const thu = gmail.trim().toLowerCase()
    if (!/^[a-z0-9]+(\.[a-z0-9]+)*@gmail\.com$/.test(thu)) {
      setLoi(GMAIL_SAI)
      return
    }

    setDangGui(true)
    try {
      await quenMatKhau(thu)
      navigate('/dat-lai-mat-khau', { state: luuLuotCho(LUOT_DAT_LAI_MAT_KHAU, thu, 60) })
    } catch (loiGoi) {
      if (loiGoi.cacO.gmail) setLoi(loiGoi.cacO.gmail)
      else hienThongBao(loiGoi.message, 'loi')
      setDangGui(false)
    }
  }

  return (
    <KhungTaiKhoan cauLon="Quên mật khẩu? Không sao." cauNho="Chỉ mất một phút để lấy lại tài khoản của bạn.">
      <form className="trang-quen-mat-khau" onSubmit={guiMa} noValidate>
        <div>
          <h1>Quên mật khẩu</h1>
          <p className="tk-the-mo-ta">Nhập Gmail đã đăng ký, chúng tôi sẽ gửi mã xác nhận</p>
        </div>
        <ONhap
          nhan="Gmail"
          loi={loi}
          type="email"
          autoComplete="email"
          placeholder="ten@gmail.com"
          value={gmail}
          onChange={(e) => setGmail(e.target.value)}
        />
        <button type="submit" className="tk-nut" disabled={dangGui}>Gửi mã</button>
        <div className="tqmk-quay-lai">
          <Link to="/dang-nhap">Quay lại đăng nhập</Link>
        </div>
      </form>
    </KhungTaiKhoan>
  )
}

export default TrangQuenMatKhau
