// Câu SQL kiểm tra hệ thống
import pool from '../database/db.js';

// Kiểm tra backend kết nối được MySQL (ném lỗi nếu không kết nối được)
// Ngày (yyyy-mm-dd) có trước hôm nay theo đồng hồ MySQL không (Phần chung C10)
export async function truocHomNay(ngay) {
  const [[dong]] = await pool.query('SELECT ? < CURDATE() AS truoc', [ngay]);
  return dong.truoc === 1;
}

export async function kiemTraKetNoiCsdl() {
  await pool.query('SELECT 1');
}
