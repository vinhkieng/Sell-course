// Mục "Quản lý khóa học" ở hồ sơ người cung cấp (Phần 7 mục 7.3, thiet_ke/ho_so/ho_so_nguoi_cung_cap.html).
// Thiếu họ tên hoặc số điện thoại thì nút "+ Tạo khóa học mới" mờ kèm dòng nhắc. Danh sách khóa do Phần 8 làm.
import { Link } from 'react-router-dom'

function HoSoQuanLyKhoaHoc({ hoSo }) {
  const thieuThongTin = !hoSo.ho_ten || !hoSo.so_dien_thoai
  return (
    <section id="quan-ly-khoa-hoc" className="hop ho-so-muc">
      <div className="hs-dau-muc">
        <h2>Quản lý khóa học</h2>
        {thieuThongTin ? (
          <button type="button" className="nut-dam" disabled>+ Tạo khóa học mới</button>
        ) : (
          <Link to="/nguoi-cung-cap/tao-khoa-hoc" className="nut-dam">+ Tạo khóa học mới</Link>
        )}
      </div>
      {thieuThongTin && (
        <p className="hs-ghi-chu">Hãy cập nhật họ tên và số điện thoại trong hồ sơ trước khi tạo khóa học.</p>
      )}
    </section>
  )
}

export default HoSoQuanLyKhoaHoc
