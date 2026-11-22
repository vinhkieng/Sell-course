// Câu SQL của bảng gio_hang.
import pool from '../database/db.js';

export async function demTheoHocVien(idHocVien) {
  const [[dong]] = await pool.query('SELECT COUNT(*) AS so FROM gio_hang WHERE id_hoc_vien = ?', [
    idHocVien,
  ]);
  return dong.so;
}
