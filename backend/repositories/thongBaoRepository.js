// Câu SQL của bảng thong_bao.
import pool from '../database/db.js';

export async function demChuaDoc(idNguoiCungCap) {
  const [[dong]] = await pool.query(
    'SELECT COUNT(*) AS so FROM thong_bao WHERE id_nguoi_cung_cap = ? AND da_doc = 0',
    [idNguoiCungCap],
  );
  return dong.so;
}
