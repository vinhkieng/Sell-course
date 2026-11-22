// Câu SQL dùng riêng cho khu quản trị.
import pool from '../database/db.js';
import { TRANG_THAI_RUT_TIEN } from '../constants/trangThai.js';

// Ba con số trên menu khu quản trị (Phần chung C9).
// Báo cáo khóa học gom theo mục bị báo cáo (Phần 20 mục 20.3): mỗi phiếu chỉ có một trong hai
// cột id_bai_hoc, id_khoa_hoc nên số mục chờ = số bài khác nhau + số khóa khác nhau.
export async function demChoXuLy() {
  const [[dong]] = await pool.query(
    `SELECT
       (SELECT COUNT(DISTINCT id_bai_hoc) + COUNT(DISTINCT id_khoa_hoc)
          FROM bao_cao_khoa_hoc WHERE bien_phap_xu_ly IS NULL) AS bao_cao_khoa_hoc,
       (SELECT COUNT(DISTINCT id_danh_gia)
          FROM bao_cao_danh_gia WHERE bien_phap_xu_ly IS NULL) AS bao_cao_danh_gia,
       (SELECT COUNT(*) FROM yeu_cau_rut_tien WHERE trang_thai = ?) AS yeu_cau_rut_tien`,
    [TRANG_THAI_RUT_TIEN.CHO_DUYET],
  );
  return dong;
}
