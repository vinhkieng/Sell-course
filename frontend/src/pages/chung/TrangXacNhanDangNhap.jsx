// Trang "Xác nhận đăng nhập" /xac-nhan-dang-nhap (Phần 3 mục 3.3), theo thiet_ke/dang_nhap/xac_nhan_dang_nhap.html.
// Gmail đã che và thời điểm hết đếm ngược lấy từ state của bộ chuyển trang, không có thì từ sessionStorage;
// cả hai đều không có thì về /dang-nhap. Giữ nguyên ?quay_lai và ?tu=mua để dùng sau khi xác nhận xong.
import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.js'
import { useDemNguoc } from '../../hooks/useDemNguoc.js'
import { xacNhanDangNhap, guiLaiMaDangNhap } from '../../api/taiKhoan.js'
import { trangSauDangNhap } from '../../utils/trangSauDangNhap.js'
import { docLuotCho, luuLuotCho, xoaLuotCho, LUOT_XAC_NHAN_DANG_NHAP as KHOA } from '../../utils/luotChoMa.js'
import KhungTaiKhoan, { DongBao } from '../../components/KhungTaiKhoan.jsx'
import './TrangXacNhanDangNhap.css'

function TrangXacNhanDangNhap() {
  const { nguoiDung, dangTai, setNguoiDung } = useAuth()
  const navigate = useNavigate()
  const { state, search } = useLocation()
  const [thamSo] = useSearchParams()
  const [luot, setLuot] = useState(() => (state?.gmail ? state : docLuotCho(KHOA)))
  const [ma, setMa] = useState('')
  const [loi, setLoi] = useState('')
  const [daGuiLai, setDaGuiLai] = useState('')
  const [dangGui, setDangGui] = useState(false)
  const conLai = useDemNguoc(luot?.het_dem_luc ?? 0)

  if (dangTai) return null
  if (nguoiDung) return <Navigate to="/" replace />
  // Không có lượt đăng nhập đang chờ xác nhận (Phần 3 mục 3.3)
  if (!luot) return <Navigate to={`/dang-nhap${search}`} replace />

  // Cookie tạm không còn hoặc đã hết hạn: bỏ lượt chờ, về trang đăng nhập
  function veDangNhap() {
    xoaLuotCho(KHOA)
    navigate(`/dang-nhap${search}`, { replace: true })
  }

  async function guiMa(e) {
    e.preventDefault()
    setDangGui(true)
    try {
      const kq = await xacNhanDangNhap(ma)
      xoaLuotCho(KHOA)
      navigate(trangSauDangNhap(thamSo.get('quay_lai'), kq.vai_tro), { replace: true })
      setNguoiDung(kq)
    } catch (loiGoi) {
      if (loiGoi.ma === 'KHONG_CO_LUOT_CHO_XAC_NHAN') return veDangNhap()
      setLoi(loiGoi.cacO.ma ?? loiGoi.message)
      setDaGuiLai('')
      setDangGui(false)
    }
  }

  async function guiLai() {
    try {
      const kq = await guiLaiMaDangNhap()
      setLuot(luuLuotCho(KHOA, kq.gmail_che, kq.giay_cho_gui_lai))
      setDaGuiLai(`Đã gửi mã mới tới Gmail ${kq.gmail_che}.`)
      setLoi('')
    } catch (loiGoi) {
      if (loiGoi.ma === 'KHONG_CO_LUOT_CHO_XAC_NHAN') return veDangNhap()
      // Bấm sớm: máy chủ trả số giây còn lại, đếm ngược theo số đó
      if (loiGoi.them.giay_cho_gui_lai) setLuot(luuLuotCho(KHOA, luot.gmail, loiGoi.them.giay_cho_gui_lai))
      setLoi(loiGoi.message)
      setDaGuiLai('')
    }
  }

  return (
    <KhungTaiKhoan cauLon="Chào mừng bạn quay lại." cauNho="Tiếp tục lộ trình học của bạn từ bài đang dở.">
      <form className="trang-xac-nhan" onSubmit={guiMa} noValidate>
        <div>
          <h1>Xác nhận đăng nhập</h1>
          <p className="tk-the-mo-ta">
            Bạn đang đăng nhập từ một địa chỉ mạng mới. Chúng tôi đã gửi mã gồm 6 chữ số tới Gmail {luot.gmail}.
            Vui lòng nhập mã để tiếp tục.
          </p>
        </div>

        <label className={`tk-o${loi ? ' co-loi' : ''}`}>
          <span>
            Mã xác nhận<i className="txn-bat-buoc">*</i>
          </span>
          <input
            className="tk-o-nhap"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="Nhập mã gồm 6 chữ số"
            value={ma}
            onChange={(e) => setMa(e.target.value.replace(/\D/g, '').slice(0, 6))}
          />
          {loi && <span className="tk-goi-y loi">{loi}</span>}
        </label>

        {daGuiLai && <DongBao loai="xanh">{daGuiLai}</DongBao>}
        {/* Nút mờ khi chưa đủ 6 chữ số (Phần 3 mục 3.3) */}
        <button type="submit" className="tk-nut" disabled={ma.length < 6 || dangGui}>Xác nhận</button>

        <div className="txn-lien-ket">
          {conLai > 0 ? (
            <span className="txn-cho" aria-disabled="true">Gửi lại mã sau {conLai} giây</span>
          ) : (
            <button type="button" className="txn-gui-lai" onClick={guiLai}>Gửi lại mã</button>
          )}
          <Link to={`/dang-nhap${search}`} onClick={() => xoaLuotCho(KHOA)}>Quay lại đăng nhập</Link>
        </div>
      </form>
    </KhungTaiKhoan>
  )
}

export default TrangXacNhanDangNhap
