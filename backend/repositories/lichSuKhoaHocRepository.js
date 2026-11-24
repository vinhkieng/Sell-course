// Câu SQL của bảng lich_su_khoa_hoc (Phần chung C15). Chỉ thêm dòng, không bao giờ sửa hay xóa.
import pool from '../database/db.js';

// cacDong: [{ idKhoaHoc, idNguoiDung, hanhDong, idBaiHoc, noiDung, giaTriCu, giaTriMoi, duongDanFileCu, ghiChu }]
// (từ idBaiHoc trở đi không bắt buộc). Ghi tất cả trong một câu INSERT; conn là kết nối của giao dịch đang chạy.
export async function ghiLichSu(cacDong, conn = pool) {
  if (cacDong.length === 0) return;
  const giaTri = cacDong.map((d) => [
    d.idKhoaHoc,
    d.idBaiHoc ?? null,
    d.idNguoiDung,
    d.hanhDong,
    d.noiDung ?? null,
    d.giaTriCu ?? null,
    d.giaTriMoi ?? null,
    d.duongDanFileCu ?? null,
    d.ghiChu ?? null,
  ]);
  await conn.query(
    `INSERT INTO lich_su_khoa_hoc
       (id_khoa_hoc, id_bai_hoc, id_nguoi_dung, hanh_dong, noi_dung_thay_doi, gia_tri_cu, gia_tri_moi, duong_dan_file_cu, ghi_chu)
     VALUES ?`,
    [giaTri],
  );
}
