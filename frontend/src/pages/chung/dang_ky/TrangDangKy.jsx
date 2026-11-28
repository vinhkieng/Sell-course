// Trang đăng ký /dang-ky (Phần 2), theo thiet_ke/dang_ky/.
// Khác thiết kế theo đặc tả 2.3: ô đồng ý mặc định không tích, vai trò mặc định chưa chọn.
import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../hooks/useAuth.js'
import { useThongBao } from '../../../hooks/useThongBao.js'
import { dangKy } from '../../../api/taiKhoan.js'
import { kiemTraDangKy } from '../../../utils/kiemTraDangKy.js'
import { VAI_TRO } from '../../../constants/vaiTro.js'
import KhungTaiKhoan from '../../../components/khung_trang/KhungTaiKhoan.jsx'
import ONhap from '../../../components/bieu_mau/ONhap.jsx'
import './TrangDangKy.css'

const CHON_VAI_TRO = [
  [VAI_TRO.HOC_VIEN, 'Học viên', 'Tôi muốn mua và học khóa học'],
  [VAI_TRO.NGUOI_CUNG_CAP, 'Người cung cấp khóa học', 'Tôi muốn đăng khóa học và nhận doanh thu'],
]

// Chỉ giữ chữ số, tối đa 6 (Phần 2 mục 2.3)
const chiChuSo = (chu) => chu.replace(/\D/g, '').slice(0, 6)

function TrangDangKy() {
  const { nguoiDung, dangTai } = useAuth()
  const navigate = useNavigate()
  const hienThongBao = useThongBao()
  const [form, setForm] = useState({
    ten_dang_nhap: '',
    gmail: '',
    mat_khau: '',
    xac_nhan_mat_khau: '',
    vai_tro: null,
    dong_y: false,
  })
  const [loi, setLoi] = useState({})
  const [dangGui, setDangGui] = useState(false)

  if (dangTai) return null
  // Người đã đăng nhập mở trang đăng ký thì về trang chủ (Phần 2 mục 2.1)
  if (nguoiDung) return <Navigate to="/" replace />

  const doi = (ten, giaTri) => setForm((cu) => ({ ...cu, [ten]: giaTri }))

  async function guiDangKy(e) {
    e.preventDefault()
    const loiTruoc = kiemTraDangKy(form)
    setLoi(loiTruoc)
    if (Object.keys(loiTruoc).length > 0) return

    setDangGui(true)
    try {
      await dangKy(form)
      hienThongBao('Đăng ký thành công, vui lòng đăng nhập.')
      navigate('/dang-nhap')
    } catch (loiMayChu) {
      if (Object.keys(loiMayChu.cacO).length > 0) setLoi(loiMayChu.cacO)
      else hienThongBao(loiMayChu.message, 'loi')
      setDangGui(false)
    }
  }

  const vaiTroDaChon = CHON_VAI_TRO.find(([so]) => so === form.vai_tro)

  return (
    <KhungTaiKhoan
      cauLon="Bắt đầu hành trình học của bạn."
      cauNho="Tạo tài khoản miễn phí và chọn khóa học đầu tiên của bạn."
    >
      <form className="trang-dang-ky" onSubmit={guiDangKy} noValidate>
        <div>
          <h1>Tạo tài khoản</h1>
          <p className="tk-the-mo-ta">Điền thông tin bên dưới để bắt đầu học.</p>
        </div>

        <ONhap
          nhan="Tên đăng nhập"
          loi={loi.ten_dang_nhap}
          goiY="4 đến 30 ký tự, chỉ gồm chữ không dấu và số, không có khoảng trắng, dấu hay ký tự đặc biệt"
          type="text"
          maxLength={30}
          autoCapitalize="none"
          autoComplete="username"
          placeholder="Chọn tên đăng nhập"
          value={form.ten_dang_nhap}
          onChange={(e) => doi('ten_dang_nhap', e.target.value)}
        />
        <ONhap
          nhan="Gmail"
          loi={loi.gmail}
          type="email"
          autoComplete="email"
          placeholder="ten@gmail.com"
          value={form.gmail}
          onChange={(e) => doi('gmail', e.target.value)}
        />
        <ONhap
          nhan="Mật khẩu"
          loi={loi.mat_khau}
          goiY="Mật khẩu gồm 6 chữ số"
          type="password"
          inputMode="numeric"
          autoComplete="new-password"
          placeholder="Tạo mật khẩu"
          value={form.mat_khau}
          onChange={(e) => doi('mat_khau', chiChuSo(e.target.value))}
        />
        <ONhap
          nhan="Xác nhận mật khẩu"
          loi={loi.xac_nhan_mat_khau}
          type="password"
          inputMode="numeric"
          autoComplete="new-password"
          placeholder="Nhập lại mật khẩu"
          value={form.xac_nhan_mat_khau}
          onChange={(e) => doi('xac_nhan_mat_khau', chiChuSo(e.target.value))}
        />

        <div className={`tk-o${loi.vai_tro ? ' co-loi' : ''}`}>
          Vai trò
          {/* Menu xổ mở khi rê chuột hoặc khi được chọn bằng bàn phím, bấm (như thiết kế) */}
          <div className="tdk-vai-tro" tabIndex={0}>
            <div className="tk-o-nhap tdk-vai-tro-hien">
              {vaiTroDaChon ? vaiTroDaChon[1] : <span className="tdk-vai-tro-goi-y">Chọn vai trò của bạn</span>}
            </div>
            <div className="tdk-vai-tro-xo" role="radiogroup" aria-label="Vai trò">
              {CHON_VAI_TRO.map(([so, ten, moTa]) => (
                <label key={so} className={form.vai_tro === so ? 'da-chon' : undefined}>
                  <input
                    type="radio"
                    name="vai_tro"
                    checked={form.vai_tro === so}
                    onChange={() => {
                      doi('vai_tro', so)
                      document.activeElement?.blur()
                    }}
                  />
                  <b>{ten}</b>
                  <span>{moTa}</span>
                </label>
              ))}
            </div>
          </div>
          {loi.vai_tro && <span className="tk-goi-y loi">{loi.vai_tro}</span>}
        </div>

        <div className="tdk-dong-y">
          <label>
            <input type="checkbox" checked={form.dong_y} onChange={(e) => doi('dong_y', e.target.checked)} />
            <span>
              Tôi đã đọc và đồng ý với{' '}
              <a href="/chinh-sach" target="_blank" rel="noopener">Chính sách và điều khoản</a> của AVA
            </span>
          </label>
          {loi.dong_y && <span className="tk-goi-y loi">{loi.dong_y}</span>}
        </div>

        <button type="submit" className="tk-nut" disabled={dangGui}>Đăng ký</button>
        <div className="tk-chuyen">
          Đã có tài khoản? <Link to="/dang-nhap">Đăng nhập</Link>
        </div>
      </form>
    </KhungTaiKhoan>
  )
}

export default TrangDangKy
