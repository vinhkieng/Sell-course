// Câu SQL của bảng xac_minh_ip: mã xác nhận đăng nhập từ địa chỉ mạng mới (Phần 3).
// Mỗi học viên tối đa một dòng (uq_xac_minh_ip_id_hoc_vien). So thời gian bằng NOW() của MySQL (Phần chung C10).
import pool from '../database/db.js';
import { HIEU_LUC_MA_XAC_NHAN_PHUT, GIAY_CHO_GUI_LAI_MA } from '../constants/nghiepVu.js';

// Ghi mã mới: chưa có dòng thì thêm, đã có thì ghi đè (mã cũ hết hiệu lực, số lần sai về 0)
export async function ghiMa(idHocVien, maDaBam, diaChiIpMoi, conn = pool) {
  await conn.query(
    `INSERT INTO xac_minh_ip (id_hoc_vien, ma_xac_minh_da_bam, dia_chi_ip_moi, thoi_diem_gui_ma, so_lan_nhap_ma_sai)
     VALUES (?, ?, ?, NOW(), 0) AS moi
     ON DUPLICATE KEY UPDATE ma_xac_minh_da_bam = moi.ma_xac_minh_da_bam,
                             dia_chi_ip_moi = moi.dia_chi_ip_moi,
                             thoi_diem_gui_ma = moi.thoi_diem_gui_ma,
                             so_lan_nhap_ma_sai = 0`,
    [idHocVien, maDaBam, diaChiIpMoi],
  );
}

// Dòng của học viên kèm Gmail, id người dùng, mã đã quá 10 phút chưa, còn mấy giây mới được gửi lại
export async function timTheoHocVien(idHocVien) {
  const [rows] = await pool.query(
    `SELECT x.ma_xac_minh_da_bam, x.dia_chi_ip_moi, x.so_lan_nhap_ma_sai,
            x.thoi_diem_gui_ma < NOW() - INTERVAL ? MINUTE AS da_het_han,
            GREATEST(0, ? - TIMESTAMPDIFF(SECOND, x.thoi_diem_gui_ma, NOW())) AS giay_cho_gui_lai,
            nd.id AS id_nguoi_dung, nd.gmail
       FROM xac_minh_ip x
       JOIN hoc_vien hv ON hv.id = x.id_hoc_vien
       JOIN nguoi_dung nd ON nd.id = hv.id_nguoi_dung
      WHERE x.id_hoc_vien = ?`,
    [HIEU_LUC_MA_XAC_NHAN_PHUT, GIAY_CHO_GUI_LAI_MA, idHocVien],
  );
  return rows[0] ?? null;
}

export async function tangLanSai(idHocVien) {
  await pool.query('UPDATE xac_minh_ip SET so_lan_nhap_ma_sai = so_lan_nhap_ma_sai + 1 WHERE id_hoc_vien = ?', [
    idHocVien,
  ]);
}

export async function xoaTheoHocVien(idHocVien, conn = pool) {
  await conn.query('DELETE FROM xac_minh_ip WHERE id_hoc_vien = ?', [idHocVien]);
}
