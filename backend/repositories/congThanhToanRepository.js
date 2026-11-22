// Câu SQL của bảng cong_thanh_toan.
import pool from '../database/db.js';

// Cổng mặc định là dòng id = 1 (Phần 1 mục 1.4)
export async function layMacDinh() {
  const [rows] = await pool.query('SELECT ten FROM cong_thanh_toan WHERE id = 1');
  return rows[0] ?? null;
}
