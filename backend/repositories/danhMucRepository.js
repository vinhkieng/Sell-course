// Câu SQL của bảng danh_muc.
// Cột ten dùng bảng so sánh utf8mb4_0900_ai_ci: so "WHERE ten = ?" không phân biệt hoa thường và dấu (Phần 6 mục 6.4).
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

// Mọi danh mục (id, tên) sắp theo tên (Phần 6 mục 6.6, dùng ở Phần 7)
export async function layTatCa() {
  const [rows] = await pool.query('SELECT id, ten FROM danh_muc ORDER BY ten, id');
  return rows;
}

// Một trang của bảng quản trị. Số khóa đếm cả khóa đang bán, bị ẩn, bị gỡ vĩnh viễn và đã xóa (Phần 6 mục 6.3)
export async function layTrangQuanTri(soDong, boQua) {
  const [rows] = await pool.query(
    `SELECT dm.id, dm.ten, COUNT(kh.id) AS so_khoa
       FROM danh_muc dm
       LEFT JOIN khoa_hoc kh ON kh.id_danh_muc = dm.id
      GROUP BY dm.id, dm.ten
      ORDER BY dm.ten, dm.id
      LIMIT ? OFFSET ?`,
    [soDong, boQua],
  );
  return rows;
}

export async function demTatCa() {
  const [[dong]] = await pool.query('SELECT COUNT(*) AS tong FROM danh_muc');
  return dong.tong;
}

// Danh mục trùng tên (theo cách so của cột ten), không có thì trả undefined
export async function timTheoTen(ten, conn = pool) {
  const [[dong]] = await conn.query('SELECT id, ten FROM danh_muc WHERE ten = ?', [ten]);
  return dong;
}

// Khóa các dòng danh mục trong giao dịch; trả các dòng còn tồn tại, sắp theo id
export async function khoaTheoIds(ids, conn) {
  const [rows] = await conn.query('SELECT id, ten FROM danh_muc WHERE id IN (?) ORDER BY id FOR UPDATE', [ids]);
  return rows;
}

export async function them(ten, conn = pool) {
  const [kq] = await conn.query('INSERT INTO danh_muc (ten) VALUES (?)', [ten]);
  return kq.insertId;
}

export async function doiTen(id, ten, conn) {
  await conn.query('UPDATE danh_muc SET ten = ? WHERE id = ?', [ten, id]);
}

export async function xoaTheoIds(ids, conn) {
  await conn.query('DELETE FROM danh_muc WHERE id IN (?)', [ids]);
}
