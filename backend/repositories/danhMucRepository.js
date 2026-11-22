// Câu SQL của bảng danh_muc.
import pool from '../database/db.js';
import { TRANG_THAI_KHOA_HOC } from '../constants/trangThai.js';

// Danh mục có ít nhất một khóa "Đang bán" chưa xóa, kèm số khóa đó, sắp theo tên (Phần 1 mục 1.4, Phần chung C9)
export async function layMenu() {
  const [rows] = await pool.query(
    `SELECT dm.id, dm.ten, COUNT(*) AS so_khoa
       FROM danh_muc dm
       JOIN khoa_hoc kh ON kh.id_danh_muc = dm.id
      WHERE kh.trang_thai = ? AND kh.da_xoa = 0
      GROUP BY dm.id, dm.ten
      ORDER BY dm.ten`,
    [TRANG_THAI_KHOA_HOC.DANG_BAN],
  );
  return rows;
}
