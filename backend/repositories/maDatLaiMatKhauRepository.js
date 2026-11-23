// Câu SQL của bảng ma_dat_lai_mat_khau (Phần 4). So thời gian bằng NOW() của MySQL (Phần chung C10).
import pool from '../database/db.js';
import { HIEU_LUC_MA_XAC_NHAN_PHUT, GIAY_CHO_GUI_LAI_MA } from '../constants/nghiepVu.js';

// Còn mấy giây mới được gửi mã tiếp, tính từ mã gửi gần nhất của tài khoản (0 là gửi được)
export async function giayChoGuiLai(idNguoiDung) {
  const [[dong]] = await pool.query(
    `SELECT COALESCE(GREATEST(0, ? - TIMESTAMPDIFF(SECOND, MAX(thoi_diem_gui), NOW())), 0) AS giay
       FROM ma_dat_lai_mat_khau WHERE id_nguoi_dung = ?`,
    [GIAY_CHO_GUI_LAI_MA, idNguoiDung],
  );
  return dong.giay;
}

// Mã mới được gửi thì mọi mã cũ chưa dùng hết hiệu lực (Phần 4 mục 4.4): đặt da_dung = 1, giữ dòng làm dấu vết
export async function huyMaChuaDung(idNguoiDung, conn = pool) {
  await conn.query('UPDATE ma_dat_lai_mat_khau SET da_dung = 1 WHERE id_nguoi_dung = ? AND da_dung = 0', [
    idNguoiDung,
  ]);
}

export async function themMa(idNguoiDung, maDaBam, conn = pool) {
  await conn.query(
    'INSERT INTO ma_dat_lai_mat_khau (id_nguoi_dung, ma_6_so_da_bam, thoi_diem_gui) VALUES (?, ?, NOW())',
    [idNguoiDung, maDaBam],
  );
}

// Mã mới nhất chưa dùng, khóa dòng để hai lần bấm cùng lúc không dùng một mã hai lần. Gọi trong giao dịch.
export async function khoaMaMoiNhatChuaDung(idNguoiDung, conn) {
  const [rows] = await conn.query(
    `SELECT id, ma_6_so_da_bam, so_lan_sai, thoi_diem_gui < NOW() - INTERVAL ? MINUTE AS da_het_han
       FROM ma_dat_lai_mat_khau
      WHERE id_nguoi_dung = ? AND da_dung = 0
      ORDER BY id DESC LIMIT 1
      FOR UPDATE`,
    [HIEU_LUC_MA_XAC_NHAN_PHUT, idNguoiDung],
  );
  return rows[0] ?? null;
}

// Ghi số lần sai; đủ số lần tối đa thì hủy mã luôn
export async function ghiLanSai(id, soLanSai, huyMa, conn = pool) {
  await conn.query('UPDATE ma_dat_lai_mat_khau SET so_lan_sai = ?, da_dung = ? WHERE id = ?', [
    soLanSai,
    huyMa ? 1 : 0,
    id,
  ]);
}

export async function danhDauDaDung(id, conn = pool) {
  await conn.query('UPDATE ma_dat_lai_mat_khau SET da_dung = 1 WHERE id = ?', [id]);
}
