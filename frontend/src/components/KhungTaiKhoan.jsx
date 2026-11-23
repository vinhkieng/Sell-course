// Khung hai cột của các trang tài khoản (đăng ký, đăng nhập, xác nhận đăng nhập, quên và đặt lại mật khẩu):
// cột xanh bên trái có logo, câu lớn, câu nhỏ, năm; cột phải là thẻ trắng chứa form. Không có đầu trang, chân trang.
// Chữ ở cột xanh mỗi màn một câu nên truyền vào. Theo thiet_ke/dang_ky/dang_ky.html.
import Logo from './Logo.jsx'
import './KhungTaiKhoan.css'

const NAM_HIEN_TAI = new Date().getFullYear()

function KhungTaiKhoan({ cauLon, cauNho, children }) {
  return (
    <div className="khung-tai-khoan">
      <div className="tk-cot-xanh">
        <div className="tk-tron tk-tron-duoi" />
        <div className="tk-tron tk-tron-tren" />
        <Logo co={34} className="tk-logo" />
        <div className="tk-loi-chao">
          <h2>{cauLon}</h2>
          <p>{cauNho}</p>
        </div>
        <div className="tk-nam">© {NAM_HIEN_TAI} AVA</div>
      </div>
      <div className="tk-cot-phai">
        <div className="tk-the">{children}</div>
      </div>
    </div>
  )
}

// Dòng báo trong thẻ: 'loi' (đỏ, lỗi máy chủ), 'nhac' (vàng, ví dụ "Vui lòng đăng nhập để mua khóa học"),
// 'xanh' (gửi lại mã thành công). Theo thiet_ke/dang_nhap/.
const HINH_DONG_BAO = {
  loi: <path d="M12 7.5v5M12 16h.01" />,
  nhac: <path d="M12 11v5M12 8h.01" />,
  xanh: <path d="m8 12 3 3 5-6" />,
}

export function DongBao({ loai, children }) {
  return (
    <div className={`tk-dong-bao ${loai}`} role={loai === 'loi' ? 'alert' : 'status'}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        {HINH_DONG_BAO[loai]}
      </svg>
      {children}
    </div>
  )
}

export default KhungTaiKhoan
