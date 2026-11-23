// Câu SQL của bảng nguoi_dung và ba bảng con (hoc_vien, nguoi_cung_cap, quan_tri_vien).
// Tên bảng, tên cột đúng file database/AVA_CSDL_18-11.sql. Mọi giá trị truyền qua dấu ?.
// Tham số conn: truyền kết nối giao dịch khi cần, mặc định dùng nhóm kết nối chung.
import pool from '../database/db.js';

// Đọc người dùng kèm id bảng con và địa chỉ IP đã xác nhận của học viên (dùng khi kiểm phiên, Phần chung C4)
export async function timTheoId(id, conn = pool) {
  const [rows] = await conn.query(
    `SELECT nd.id, nd.ten_dang_nhap, nd.ho_ten, nd.gmail, nd.so_dien_thoai, nd.vai_tro,
            nd.ma_gioi_thieu, nd.anh_dai_dien, nd.khoa, nd.ly_do_khoa,
            hv.id AS id_hoc_vien, hv.dia_chi_ip,
            ncc.id AS id_nguoi_cung_cap,
            qtv.id AS id_quan_tri_vien
       FROM nguoi_dung nd
       LEFT JOIN hoc_vien hv ON hv.id_nguoi_dung = nd.id
       LEFT JOIN nguoi_cung_cap ncc ON ncc.id_nguoi_dung = nd.id
       LEFT JOIN quan_tri_vien qtv ON qtv.id_nguoi_dung = nd.id
      WHERE nd.id = ?`,
    [id],
  );
  return rows[0] ?? null;
}

// So không phân biệt chữ hoa chữ thường nhờ collation utf8mb4_unicode_ci của bảng
export async function timTheoTenDangNhapHoacGmail(tenDangNhap, gmail, conn = pool) {
  const [rows] = await conn.query(
    'SELECT id, ten_dang_nhap, gmail FROM nguoi_dung WHERE ten_dang_nhap = ? OR gmail = ?',
    [tenDangNhap, gmail],
  );
  return rows;
}

// Tài khoản để đăng nhập, tìm theo tên không phân biệt hoa thường (Phần 3 mục 3.4 bước 3)
export async function timDeDangNhap(tenDangNhap) {
  const [rows] = await pool.query(
    `SELECT nd.id, nd.ten_dang_nhap, nd.vai_tro, nd.gmail, nd.mat_khau_da_bam, nd.khoa, nd.ly_do_khoa,
            hv.id AS id_hoc_vien, hv.dia_chi_ip
       FROM nguoi_dung nd
       LEFT JOIN hoc_vien hv ON hv.id_nguoi_dung = nd.id
      WHERE nd.ten_dang_nhap = ?`,
    [tenDangNhap],
  );
  return rows[0] ?? null;
}

// Địa chỉ IP đã xác nhận của học viên (Phần 3 mục 3.4)
export async function capNhatDiaChiIp(idHocVien, ip, conn = pool) {
  await conn.query('UPDATE hoc_vien SET dia_chi_ip = ? WHERE id = ?', [ip, idHocVien]);
}

export async function maGioiThieuDaCo(ma, conn = pool) {
  const [rows] = await conn.query('SELECT 1 FROM nguoi_dung WHERE ma_gioi_thieu = ? LIMIT 1', [ma]);
  return rows.length > 0;
}

export async function themNguoiDung(
  { tenDangNhap, gmail, matKhauDaBam, vaiTro, maGioiThieu, hoTen = null },
  conn = pool,
) {
  const [ketQua] = await conn.query(
    `INSERT INTO nguoi_dung (ten_dang_nhap, ho_ten, gmail, mat_khau_da_bam, vai_tro, ma_gioi_thieu)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [tenDangNhap, hoTen, gmail, matKhauDaBam, vaiTro, maGioiThieu],
  );
  return ketQua.insertId;
}

// Học viên mới chưa có địa chỉ IP đã xác nhận (Phần 2 mục 2.5)
export async function themHocVien(idNguoiDung, conn = pool) {
  await conn.query('INSERT INTO hoc_vien (id_nguoi_dung) VALUES (?)', [idNguoiDung]);
}

// Người cung cấp mới chưa có thông tin ngân hàng (Phần 2 mục 2.5)
export async function themNguoiCungCap(idNguoiDung, conn = pool) {
  await conn.query('INSERT INTO nguoi_cung_cap (id_nguoi_dung) VALUES (?)', [idNguoiDung]);
}
