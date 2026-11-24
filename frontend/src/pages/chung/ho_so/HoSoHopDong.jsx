// Mục "Thông tin hợp đồng" của hồ sơ admin, chỉ xem (Phần 5 mục 5.3). Kiểu ở TrangHoSo.css.
import { dinhDangNgay } from '../../../utils/dinhDang.js'

function HoSoHopDong({ hoSo }) {
  const cacDong = [
    ['Số CCCD', hoSo.so_cccd],
    ['Ngày cấp', dinhDangNgay(hoSo.ngay_cap_cccd)],
    ['Nơi cấp', hoSo.noi_cap_cccd],
    ['Số hợp đồng', hoSo.so_hop_dong],
    ['Ngày bắt đầu làm', dinhDangNgay(hoSo.ngay_bat_dau_lam)],
  ]
  return (
    <section id="thong-tin-hop-dong" className="hop ho-so-muc">
      <h2 className="hs-tieu-de-sat">Thông tin hợp đồng</h2>
      {cacDong.map(([nhan, giaTri]) => (
        <div key={nhan} className="hs-hop-dong-dong">
          <span>{nhan}</span>
          <b>{giaTri}</b>
        </div>
      ))}
      <p className="hs-hop-dong-ghi-chu">
        Thông tin hợp đồng chỉ để xem. Cần thay đổi thì liên hệ bộ phận quản lý nhân sự.
      </p>
    </section>
  )
}

export default HoSoHopDong
