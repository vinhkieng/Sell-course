// Câu SQL của bảng bai_hoc và cau_hoi_bai_tap. Các phần sau (Phần 8 trở đi) thêm vào đây.
import pool from '../database/db.js';
import { TRANG_THAI_KHOA_HOC } from '../constants/trangThai.js';

// Đã có bài nào trên AVA đang dùng file có mã băm này chưa. Cột ma_bam_dang_dung tự để trống với bài
// đã xóa và bài của khóa bị gỡ vĩnh viễn, nên các bài đó không chặn (Phần chung C3).
export async function coMaBamDangDung(maBam, conn = pool) {
  const [[dong]] = await conn.query('SELECT EXISTS(SELECT 1 FROM bai_hoc WHERE ma_bam_dang_dung = ?) AS co', [maBam]);
  return dong.co === 1;
}

// Dung lượng video và PDF đang tính vào hạn mức 5GB của một người cung cấp: bài chưa xóa thuộc khóa
// chưa xóa và chưa bị gỡ vĩnh viễn (Phần 7 mục 7.4). Bài trắc nghiệm không có dung lượng.
export async function dungLuongDaDung(idNguoiCungCap) {
  const [[dong]] = await pool.query(
    `SELECT COALESCE(SUM(bh.dung_luong), 0) AS tong
       FROM bai_hoc bh
       JOIN khoa_hoc kh ON kh.id = bh.id_khoa_hoc
      WHERE kh.id_nguoi_cung_cap = ? AND kh.da_xoa = 0 AND kh.trang_thai <> ? AND bh.da_xoa = 0`,
    [idNguoiCungCap, TRANG_THAI_KHOA_HOC.BI_GO_VINH_VIEN],
  );
  return Number(dong.tong);
}

// bai: { idKhoaHoc, ten, soThuTu, loai, duongDanFile, tenFile, dungLuong, thoiLuong, maBam, thoiGianLamBai }
export async function them(bai, conn) {
  const [kq] = await conn.query(
    `INSERT INTO bai_hoc
       (id_khoa_hoc, ten_bai_hoc, so_thu_tu, loai, duong_dan_file, ten_file, dung_luong, thoi_luong, ma_bam_file, thoi_gian_lam_bai)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      bai.idKhoaHoc,
      bai.ten,
      bai.soThuTu,
      bai.loai,
      bai.duongDanFile ?? null,
      bai.tenFile ?? null,
      bai.dungLuong ?? null,
      bai.thoiLuong ?? null,
      bai.maBam ?? null,
      bai.thoiGianLamBai ?? null,
    ],
  );
  return kq.insertId;
}

// Câu hỏi của một bài trắc nghiệm, đánh số 1, 2, 3 theo thứ tự trong mảng
export async function themCauHoi(idBaiHoc, cacCau, conn) {
  const giaTri = cacCau.map((cau, i) => [
    idBaiHoc,
    i + 1,
    cau.noi_dung,
    cau.lua_chon_a,
    cau.lua_chon_b,
    cau.lua_chon_c,
    cau.lua_chon_d,
    cau.dap_an_dung,
  ]);
  await conn.query(
    `INSERT INTO cau_hoi_bai_tap
       (id_bai_hoc, so_thu_tu, noi_dung, lua_chon_a, lua_chon_b, lua_chon_c, lua_chon_d, dap_an_dung)
     VALUES ?`,
    [giaTri],
  );
}
