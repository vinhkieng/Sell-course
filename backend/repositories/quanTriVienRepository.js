// Câu SQL của bảng quan_tri_vien (thông tin hợp đồng của admin).
// Số CCCD không bao giờ được ghi vào nhật ký (Phần chung C2).
import pool from '../database/db.js';

export async function soCccdDaCo(soCccd, conn = pool) {
  const [rows] = await conn.query('SELECT 1 FROM quan_tri_vien WHERE so_cccd = ? LIMIT 1', [soCccd]);
  return rows.length > 0;
}

export async function soHopDongDaCo(soHopDong, conn = pool) {
  const [rows] = await conn.query('SELECT 1 FROM quan_tri_vien WHERE so_hop_dong = ? LIMIT 1', [
    soHopDong,
  ]);
  return rows.length > 0;
}

export async function themQuanTriVien(
  { idNguoiDung, soCccd, ngayCapCccd, noiCapCccd, soHopDong, ngayBatDauLam },
  conn = pool,
) {
  const [ketQua] = await conn.query(
    `INSERT INTO quan_tri_vien (id_nguoi_dung, so_cccd, ngay_cap_cccd, noi_cap_cccd, so_hop_dong, ngay_bat_dau_lam)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [idNguoiDung, soCccd, ngayCapCccd, noiCapCccd, soHopDong, ngayBatDauLam],
  );
  return ketQua.insertId;
}
