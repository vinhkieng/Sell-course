// Chân trang chuẩn lấy từ màn Trang chủ, giống hệt ở mọi trang có chân trang (Phần chung C9)
import { Link } from 'react-router-dom'
import Logo from './Logo.jsx'
import './ChanTrang.css'

// Ba biểu tượng mạng xã hội chưa có địa chỉ: hiện biểu tượng, bấm không đi đâu
const MANG_XA_HOI = [
  <path key="f" d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />,
  <g key="i"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" /></g>,
  <g key="y"><path d="M22 8s-.2-1.6-.8-2.3c-.8-.8-1.7-.8-2.1-.9C16.2 4.6 12 4.6 12 4.6s-4.2 0-7.1.2c-.4.1-1.3.1-2.1.9C2.2 6.4 2 8 2 8s-.2 1.9-.2 3.8v1.8c0 1.9.2 3.8.2 3.8s.2 1.6.8 2.3c.8.8 1.8.8 2.3.9 1.7.2 6.9.2 6.9.2s4.2 0 7.1-.2c.4-.1 1.3-.1 2.1-.9.6-.7.8-2.3.8-2.3s.2-1.9.2-3.8v-1.8C22.2 9.9 22 8 22 8z" /><path d="m10 9 5 3-5 3z" /></g>,
]

// Năm hiện tại lấy một lần khi tải web
const NAM_HIEN_TAI = new Date().getFullYear()

// danhMuc: kết quả GET /api/danh-muc/menu; tenCong: tên cổng thanh toán (cong_thanh_toan.ten)
function ChanTrang({ danhMuc, tenCong }) {
  // Tối đa 5 danh mục nhiều khóa đang bán nhất, bằng số khóa thì xếp theo tên
  const top5 = [...danhMuc]
    .sort((a, b) => b.so_khoa - a.so_khoa || a.ten.localeCompare(b.ten, 'vi'))
    .slice(0, 5)

  return (
    <footer className="chan-trang">
      <div className="ct-tron ct-tron-phai" />
      <div className="ct-tron ct-tron-trai" />
      <div className="ct-ruot">
        <div className="ct-luoi">
          <div className="ct-gioi-thieu">
            <Logo co={34} className="ct-logo" />
            <p>Học từng bài, mỗi ngày tiến thêm một bước.</p>
            <div className="ct-mxh">
              {MANG_XA_HOI.map((hinh) => (
                <span key={hinh.key} className="ct-mxh-o" role="img" aria-label="Mạng xã hội">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{hinh}</svg>
                </span>
              ))}
            </div>
          </div>
          <div>
            <b className="ct-tieu-de">Danh mục</b>
            <div className="ct-cot">
              {top5.map((dm) => (
                <Link key={dm.id} to={`/khoa-hoc?danh_muc=${dm.id}`} className="ct-lien-ket">{dm.ten}</Link>
              ))}
            </div>
          </div>
          <div>
            <b className="ct-tieu-de">Về chúng tôi</b>
            <div className="ct-cot">
              <Link to="/chinh-sach#dieu-1" className="ct-lien-ket">Về AVA</Link>
              <Link to="/chinh-sach" className="ct-lien-ket">Chính sách và điều khoản</Link>
            </div>
          </div>
          <div>
            <b className="ct-tieu-de">Hỗ trợ</b>
            <div className="ct-cot">
              <a href="mailto:avahotro@gmail.com" className="ct-lien-ket">avahotro@gmail.com</a>
            </div>
          </div>
          <div>
            <b className="ct-tieu-de">Liên hệ hỗ trợ</b>
            <div className="ct-cot ct-lien-he">
              <span>Gmail: avahotro@gmail.com</span>
              <span>Điện thoại: 028 7300 8899</span>
              <span>Giờ làm việc: 8:00 - 17:00, thứ Hai đến thứ Sáu</span>
            </div>
          </div>
        </div>
        <div className="ct-cuoi">
          <span>© {NAM_HIEN_TAI} AVA. Bảo lưu mọi quyền.</span>
          {tenCong && <span>Thanh toán an toàn qua {tenCong}</span>}
        </div>
      </div>
    </footer>
  )
}

export default ChanTrang
