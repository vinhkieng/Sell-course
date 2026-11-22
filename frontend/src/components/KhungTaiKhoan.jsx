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

export default KhungTaiKhoan
