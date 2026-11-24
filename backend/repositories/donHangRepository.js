// Câu SQL của bảng don_hang. Các phần sau (Phần 13, 22) thêm vào đây.
import pool from '../database/db.js';

// Học viên đã có ít nhất một đơn, bất kỳ trạng thái (Phần 5 mục 5.4)
export async function hocVienCoDonHang(idHocVien) {
  const [[dong]] = await pool.query('SELECT EXISTS(SELECT 1 FROM don_hang WHERE id_hoc_vien = ?) AS co', [
    idHocVien,
  ]);
  return dong.co === 1;
}
