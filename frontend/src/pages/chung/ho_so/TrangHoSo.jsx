// Trang hồ sơ /ho-so (Phần 5), theo thiet_ke/ho_so/.
// Học viên, người cung cấp: khung công khai, có chân trang. Admin: đầu trang "Quản trị", không chân trang (Phần chung C9).
import { useEffect, useState } from 'react'
import { useAuth } from '../../../hooks/useAuth.js'
import { useThongBao } from '../../../hooks/useThongBao.js'
import { layHoSo } from '../../../api/hoSo.js'
import { VAI_TRO } from '../../../constants/vaiTro.js'
import KhungCongKhai from '../../../components/khung_trang/KhungCongKhai.jsx'
import DauTrangQuanTri from '../../../components/khung_trang/DauTrangQuanTri.jsx'
import KhungHoSo from '../../../components/khung_trang/KhungHoSo.jsx'
import HoSoThongTinCaNhan from './HoSoThongTinCaNhan.jsx'
import HoSoDoiMatKhau from './HoSoDoiMatKhau.jsx'
import HoSoHopDong from './HoSoHopDong.jsx'
import HoSoQuanLyKhoaHoc from './HoSoQuanLyKhoaHoc.jsx'
import './TrangHoSo.css'

// tạm: các mục của phần sau mới có khung và tiêu đề; Phần 13, 14, 17 thay bằng mục thật
const MUC_PHAN_SAU = {
  [VAI_TRO.HOC_VIEN]: [
    ['khoa-hoc-cua-toi', 'Khóa học của tôi'],
    ['tien-do-hoc', 'Tiến độ học'],
    ['lich-su-don-hang', 'Lịch sử đơn hàng'],
  ],
  [VAI_TRO.NGUOI_CUNG_CAP]: [
    ['vi', 'Ví'],
    ['rut-tien', 'Rút tiền'],
  ],
  [VAI_TRO.ADMIN]: [],
}

function TrangHoSo() {
  const { nguoiDung } = useAuth()
  const hienThongBao = useThongBao()
  const [hoSo, setHoSo] = useState(null)

  useEffect(() => {
    layHoSo().then(setHoSo, (loi) => hienThongBao(loi.message, 'loi'))
  }, [hienThongBao])

  const laAdmin = nguoiDung.vai_tro === VAI_TRO.ADMIN
  const noiDung = (
    <KhungHoSo>
      {hoSo && (
        <>
          <HoSoThongTinCaNhan hoSo={hoSo} setHoSo={setHoSo} />
          {laAdmin && <HoSoHopDong hoSo={hoSo} />}
          <HoSoDoiMatKhau />
          {nguoiDung.vai_tro === VAI_TRO.NGUOI_CUNG_CAP && <HoSoQuanLyKhoaHoc hoSo={hoSo} />}
          {MUC_PHAN_SAU[nguoiDung.vai_tro].map(([neo, tieuDe]) => (
            <section key={neo} id={neo} className="hop ho-so-muc">
              <h2>{tieuDe}</h2>
            </section>
          ))}
        </>
      )}
    </KhungHoSo>
  )

  if (laAdmin) {
    return (
      <>
        <DauTrangQuanTri />
        {noiDung}
      </>
    )
  }
  return <KhungCongKhai>{noiDung}</KhungCongKhai>
}

export default TrangHoSo
