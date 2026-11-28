// Mục "Đổi mật khẩu" của trang hồ sơ (Phần 5 mục 5.3, 5.4). Kiểu ở TrangHoSo.css.
import { useState } from 'react'
import { useThongBao } from '../../../hooks/useThongBao.js'
import { doiMatKhau } from '../../../api/hoSo.js'
import { kiemTraDoiMatKhau } from '../../../utils/kiemTraHoSo.js'
import ONhap from '../../../components/bieu_mau/ONhap.jsx'

const RONG = { mat_khau_hien_tai: '', mat_khau_moi: '', xac_nhan: '' }
const chiChuSo = (chu) => chu.replace(/\D/g, '').slice(0, 6)

function HoSoDoiMatKhau() {
  const hienThongBao = useThongBao()
  const [form, setForm] = useState(RONG)
  const [loi, setLoi] = useState({})
  const [dangGui, setDangGui] = useState(false)

  const doi = (ten) => (e) => setForm((cu) => ({ ...cu, [ten]: chiChuSo(e.target.value) }))
  const oMatKhau = { type: 'password', inputMode: 'numeric', autoComplete: 'off' }

  async function gui(e) {
    e.preventDefault()
    const loiTruoc = kiemTraDoiMatKhau(form)
    setLoi(loiTruoc)
    if (Object.keys(loiTruoc).length > 0) return

    setDangGui(true)
    try {
      await doiMatKhau(form)
      setForm(RONG)
      hienThongBao('Đã đổi mật khẩu')
    } catch (loiGoi) {
      if (Object.keys(loiGoi.cacO).length > 0) setLoi(loiGoi.cacO)
      else hienThongBao(loiGoi.message, 'loi')
    } finally {
      setDangGui(false)
    }
  }

  return (
    <section id="doi-mat-khau" className="hop ho-so-muc">
      <h2>Đổi mật khẩu</h2>
      <form onSubmit={gui} noValidate>
        <div className="hs-luoi hs-luoi-dau">
          <ONhap
            nhan="Mật khẩu hiện tại"
            loi={loi.mat_khau_hien_tai}
            placeholder="Mật khẩu hiện tại"
            value={form.mat_khau_hien_tai}
            onChange={doi('mat_khau_hien_tai')}
            {...oMatKhau}
          />
          <ONhap
            nhan="Mật khẩu mới"
            loi={loi.mat_khau_moi}
            goiY="Mật khẩu gồm 6 chữ số"
            placeholder="Mật khẩu mới"
            value={form.mat_khau_moi}
            onChange={doi('mat_khau_moi')}
            {...oMatKhau}
          />
          <ONhap
            nhan="Xác nhận mật khẩu mới"
            loi={loi.xac_nhan}
            goiY="Mật khẩu gồm 6 chữ số"
            placeholder="Nhập lại mật khẩu mới"
            value={form.xac_nhan}
            onChange={doi('xac_nhan')}
            {...oMatKhau}
          />
        </div>
        <div className="hs-hang-nut">
          <button type="submit" className="hs-nut-chinh" disabled={dangGui}>Đổi mật khẩu</button>
        </div>
      </form>
    </section>
  )
}

export default HoSoDoiMatKhau
