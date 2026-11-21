// Nhóm kết nối MySQL dùng chung cho toàn backend (mysql2, câu SQL viết tay có tham số dấu ?).
import mysql from 'mysql2/promise';
import config from '../config.js';

const pool = mysql.createPool({
  ...config.db,
  charset: 'utf8mb4', // lưu đúng tiếng Việt có dấu
  decimalNumbers: true, // cột tiền DECIMAL trả về số, không trả về chuỗi
  timezone: '+07:00', // giờ Việt Nam (Phần chung C10)
  // Cột DATE (ví dụ ngày sinh) trả về chuỗi 'yyyy-mm-dd' để không bị lệch ngày khi đổi múi giờ
  dateStrings: ['DATE'],
  waitForConnections: true,
  connectionLimit: 10,
});

// Mỗi kết nối mới đều đặt giờ của MySQL về +07:00, để NOW() và cột DATETIME cùng một giờ (Phần chung C10)
pool.pool.on('connection', (ketNoi) => {
  ketNoi.query("SET time_zone = '+07:00'");
});

// Chạy nhiều câu SQL trong một giao dịch: lỗi ở bất kỳ câu nào thì hoàn tác tất cả (Phần chung C6).
// Cách dùng: await withTransaction(async (conn) => { await conn.query(...); ... })
export async function withTransaction(congViec) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const ketQua = await congViec(conn);
    await conn.commit();
    return ketQua;
  } catch (loi) {
    await conn.rollback();
    throw loi;
  } finally {
    conn.release();
  }
}

export default pool;
