// Câu SQL kiểm tra hệ thống
import pool from '../database/db.js';

// Kiểm tra backend kết nối được MySQL (ném lỗi nếu không kết nối được)
export async function kiemTraKetNoiCsdl() {
  await pool.query('SELECT 1');
}
