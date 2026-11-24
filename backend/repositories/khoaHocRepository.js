// Câu SQL của bảng khoa_hoc. Các phần sau (Phần 7 trở đi) thêm vào đây.
import pool from '../database/db.js';

// Người cung cấp đã từng đăng khóa học, kể cả khóa đã xóa (Phần 5 mục 5.3)
export async function nguoiCungCapDaDangKhoa(idNguoiCungCap) {
  const [[dong]] = await pool.query(
    'SELECT EXISTS(SELECT 1 FROM khoa_hoc WHERE id_nguoi_cung_cap = ?) AS co',
    [idNguoiCungCap],
  );
  return dong.co === 1;
}
