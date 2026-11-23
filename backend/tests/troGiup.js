// Hàm tạo dữ liệu nhanh cho kiểm thử, các phần sau dùng lại.
import bcrypt from 'bcrypt';
import pool from '../database/db.js';
import { TEN_COOKIE_PHIEN, taoMaPhien } from '../lib/token.js';
import { sinhMaGioiThieu } from '../lib/maGioiThieu.js';
import { VAI_TRO } from '../constants/vaiTro.js';
import { TRANG_THAI_KHOA_HOC } from '../constants/trangThai.js';

let dem = 0;

// Tạo nguoi_dung kèm dòng bảng con. Trả { id, vai_tro, id_hoc_vien | id_nguoi_cung_cap, cookie }.
// matKhau: mật khẩu thật (băm bcrypt) khi cần đăng nhập bằng API; Gmail mặc định là <tên viết thường>@gmail.com.
// Học viên có địa chỉ IP đã xác nhận diaChiIp (mặc định 127.0.0.1, null là chưa đăng nhập lần nào); phiên mang 127.0.0.1.
export async function taoNguoiDung(
  vaiTro,
  { hoTen = null, tenDangNhap, matKhau, diaChiIp = '127.0.0.1' } = {},
) {
  dem += 1;
  const ten = tenDangNhap ?? `kiemthu${Date.now() % 1e6}${dem}`;
  const matKhauDaBam = matKhau ? await bcrypt.hash(matKhau, 4) : 'khongdung';
  const [kq] = await pool.query(
    `INSERT INTO nguoi_dung (ten_dang_nhap, ho_ten, gmail, mat_khau_da_bam, vai_tro, ma_gioi_thieu)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [ten, hoTen, `${ten.toLowerCase()}@gmail.com`, matKhauDaBam, vaiTro, sinhMaGioiThieu()],
  );
  const nguoiDung = { id: kq.insertId, vai_tro: vaiTro };
  if (vaiTro === VAI_TRO.HOC_VIEN) {
    const [hv] = await pool.query('INSERT INTO hoc_vien (id_nguoi_dung, dia_chi_ip) VALUES (?, ?)', [
      nguoiDung.id,
      diaChiIp,
    ]);
    nguoiDung.id_hoc_vien = hv.insertId;
  } else if (vaiTro === VAI_TRO.NGUOI_CUNG_CAP) {
    const [ncc] = await pool.query('INSERT INTO nguoi_cung_cap (id_nguoi_dung) VALUES (?)', [
      nguoiDung.id,
    ]);
    nguoiDung.id_nguoi_cung_cap = ncc.insertId;
  }
  nguoiDung.cookie = `${TEN_COOKIE_PHIEN}=${taoMaPhien(nguoiDung, '127.0.0.1')}`;
  return nguoiDung;
}

// Cookie phiên của admin kiểm thử do npm test tạo sẵn
export async function cookieAdmin() {
  const [[admin]] = await pool.query(
    'SELECT nd.id, nd.vai_tro, qtv.id AS id_quan_tri_vien FROM nguoi_dung nd JOIN quan_tri_vien qtv ON qtv.id_nguoi_dung = nd.id WHERE nd.vai_tro = ? LIMIT 1',
    [VAI_TRO.ADMIN],
  );
  return { ...admin, cookie: `${TEN_COOKIE_PHIEN}=${taoMaPhien(admin)}` };
}

export async function taoDanhMuc(ten) {
  const [kq] = await pool.query('INSERT INTO danh_muc (ten) VALUES (?)', [ten]);
  return kq.insertId;
}

// Khóa học tối thiểu đủ ràng buộc trong file SQL. Mặc định "Đang bán", chưa xóa.
export async function taoKhoaHoc(
  idNguoiCungCap,
  idDanhMuc,
  { trangThai = TRANG_THAI_KHOA_HOC.DANG_BAN, biAnBoi = null, lyDoAn = null, daXoa = 0 } = {},
) {
  const [kq] = await pool.query(
    `INSERT INTO khoa_hoc (id_nguoi_cung_cap, id_danh_muc, ten_khoa_hoc, mo_ta, gia_ban, trang_thai, bi_an_boi, ly_do_an, da_xoa)
     VALUES (?, ?, 'Khóa kiểm thử', 'Mô tả', 100000, ?, ?, ?, ?)`,
    [idNguoiCungCap, idDanhMuc, trangThai, biAnBoi, lyDoAn, daXoa],
  );
  return kq.insertId;
}
