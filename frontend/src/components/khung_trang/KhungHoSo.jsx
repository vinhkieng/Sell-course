// Khung trang hồ sơ (Phần chung C2, Phần 5 mục 5.3): tiêu đề "Hồ sơ cá nhân", menu trái theo vai trò, các mục bên phải.
// Bấm một mục thì CuonTrang cuộn tới neo (Phần chung C7). Mục được tô là mục ứng với neo đang mở,
// không có neo thì "Thông tin cá nhân". Theo thiet_ke/ho_so/.
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.js'
import { VAI_TRO, TEN_VAI_TRO } from '../../constants/vaiTro.js'
import { tenHienThi } from '../../utils/dinhDang.js'
import AnhDaiDien from '../hien_thi/AnhDaiDien.jsx'
import './KhungHoSo.css'

const THONG_TIN = ['thong-tin-ca-nhan', 'Thông tin cá nhân']
const DOI_MAT_KHAU = ['doi-mat-khau', 'Đổi mật khẩu']

const MUC_HO_SO = {
  [VAI_TRO.HOC_VIEN]: [
    THONG_TIN,
    DOI_MAT_KHAU,
    ['khoa-hoc-cua-toi', 'Khóa học của tôi'],
    ['tien-do-hoc', 'Tiến độ học'],
    ['lich-su-don-hang', 'Lịch sử đơn hàng'],
  ],
  [VAI_TRO.NGUOI_CUNG_CAP]: [
    THONG_TIN,
    DOI_MAT_KHAU,
    ['quan-ly-khoa-hoc', 'Quản lý khóa học'],
    ['vi', 'Ví'],
    ['rut-tien', 'Rút tiền'],
  ],
  [VAI_TRO.ADMIN]: [THONG_TIN, ['thong-tin-hop-dong', 'Thông tin hợp đồng'], DOI_MAT_KHAU],
}

function KhungHoSo({ children }) {
  const { nguoiDung, dangXuat } = useAuth()
  const { hash } = useLocation()
  const neoDangMo = hash.slice(1) || THONG_TIN[0]

  return (
    <section className="khung-ho-so">
      <h1>Hồ sơ cá nhân</h1>
      <div className="khs-than">
        <aside className="hop khs-menu">
          <div className="khs-the">
            <AnhDaiDien nguoiDung={nguoiDung} co={88} />
            <b>{tenHienThi(nguoiDung)}</b>
            <span className={`nhan khs-vai-tro${nguoiDung.vai_tro === VAI_TRO.ADMIN ? ' admin' : ''}`}>
              {TEN_VAI_TRO[nguoiDung.vai_tro]}
            </span>
          </div>
          <div className="khs-nhom">Tài khoản</div>
          <nav>
            {MUC_HO_SO[nguoiDung.vai_tro].map(([neo, chu]) => (
              <Link key={neo} to={`/ho-so#${neo}`} className={neo === neoDangMo ? 'on' : undefined}>
                {chu}
              </Link>
            ))}
          </nav>
          <button type="button" className="khs-dang-xuat" onClick={dangXuat}>Đăng xuất</button>
        </aside>
        <div className="khs-cac-muc">{children}</div>
      </div>
    </section>
  )
}

export default KhungHoSo
