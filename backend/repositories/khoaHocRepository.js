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

// Số khóa của một danh mục, đếm cả khóa bị ẩn, bị gỡ vĩnh viễn và đã xóa (Phần 6 mục 6.3)
export async function demTheoDanhMuc(idDanhMuc, conn = pool) {
  const [[dong]] = await conn.query('SELECT COUNT(*) AS so FROM khoa_hoc WHERE id_danh_muc = ?', [idDanhMuc]);
  return dong.so;
}

// Khóa (mọi trạng thái, kể cả đã xóa) thuộc các danh mục, khóa dòng trong giao dịch gộp (Phần 6 mục 6.5)
export async function khoaTheoDanhMuc(idsDanhMuc, conn) {
  const [rows] = await conn.query(
    'SELECT id, id_danh_muc FROM khoa_hoc WHERE id_danh_muc IN (?) ORDER BY id FOR UPDATE',
    [idsDanhMuc],
  );
  return rows;
}

export async function chuyenDanhMuc(tuIdsDanhMuc, denIdDanhMuc, conn) {
  await conn.query('UPDATE khoa_hoc SET id_danh_muc = ? WHERE id_danh_muc IN (?)', [denIdDanhMuc, tuIdsDanhMuc]);
}
