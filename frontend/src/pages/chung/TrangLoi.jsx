// Trang lỗi 403 và 404 (Phần 1 mục 1.3), theo thiet_ke/chinh_sach_loi/loi_403.html, loi_404.html
import { Link } from 'react-router-dom'
import './TrangLoi.css'

const NOI_DUNG = {
  403: ['Bạn không có quyền truy cập', 'Tài khoản của bạn không được dùng chức năng này.'],
  404: ['Không tìm thấy trang', 'Trang bạn tìm không tồn tại hoặc bạn không có quyền xem.'],
}

function TrangLoi({ ma }) {
  const [tieuDe, moTa] = NOI_DUNG[ma]
  return (
    <main className="trang-loi">
      <div className="hop trang-loi-hop">
        <div className="trang-loi-tron vang" />
        <div className="trang-loi-tron xanh" />
        <div className="trang-loi-ruot">
          <p className="trang-loi-so">{ma}</p>
          <h1>{tieuDe}</h1>
          <p className="trang-loi-mo-ta">{moTa}</p>
          <Link to="/" className="trang-loi-nut nut-sang">Về trang chủ</Link>
        </div>
      </div>
    </main>
  )
}

export default TrangLoi
