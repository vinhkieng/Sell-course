// Kiểm thử Phần 1 theo docs/kiem_thu/phan_01_khung_trang_chinh_sach_loi.md (các trường hợp tự động).
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import request from 'supertest';
import app from '../app.js';
import pool from '../database/db.js';
import config from '../config.js';
import { chepChinhSachMacDinh } from '../lib/khoiDong.js';
import { VAI_TRO } from '../constants/vaiTro.js';
import { BI_AN_BOI, LOAI_THONG_BAO, TRANG_THAI_KHOA_HOC, TRANG_THAI_RUT_TIEN } from '../constants/trangThai.js';
import { taoNguoiDung, cookieAdmin, taoDanhMuc, taoKhoaHoc } from './troGiup.js';

let hocVien, nguoiCungCap, admin, dm;

// Cookie ava_phien bị xóa: phản hồi đặt lại cookie rỗng đã hết hạn
function daXoaCookie(res) {
  return (res.headers['set-cookie'] ?? []).some(
    (c) => c.startsWith('ava_phien=;') && c.includes('Expires=Thu, 01 Jan 1970'),
  );
}

before(async () => {
  // Bắt đầu từ file chinh_sach.json mới chép từ file mặc định
  await fs.rm(config.duongDanChinhSach, { force: true });
  await chepChinhSachMacDinh();

  admin = await cookieAdmin();
  nguoiCungCap = await taoNguoiDung(VAI_TRO.NGUOI_CUNG_CAP);
  hocVien = await taoNguoiDung(VAI_TRO.HOC_VIEN);

  // Dữ liệu của P01-07, dùng chung cho P01-02, P01-03
  dm = {
    thietKe: await taoDanhMuc('Thiết Kế'),
    lapTrinh: await taoDanhMuc('Lập Trình'),
    marketing: await taoDanhMuc('Marketing'),
    ngoaiNgu: await taoDanhMuc('Ngoại Ngữ'),
  };
  const ncc = nguoiCungCap.id_nguoi_cung_cap;
  await taoKhoaHoc(ncc, dm.thietKe);
  const lt1 = await taoKhoaHoc(ncc, dm.lapTrinh);
  const lt2 = await taoKhoaHoc(ncc, dm.lapTrinh);
  await taoKhoaHoc(ncc, dm.marketing, { trangThai: TRANG_THAI_KHOA_HOC.BI_AN, biAnBoi: BI_AN_BOI.TU_AN });
  await taoKhoaHoc(ncc, dm.ngoaiNgu, { daXoa: 1 });

  // P01-02: học viên có 2 dòng giỏ hàng
  await pool.query('INSERT INTO gio_hang (id_hoc_vien, id_khoa_hoc) VALUES (?, ?), (?, ?)', [
    hocVien.id_hoc_vien, lt1, hocVien.id_hoc_vien, lt2,
  ]);
  // P01-03: 3 thông báo, 2 chưa đọc
  for (const daDoc of [0, 0, 1]) {
    await pool.query(
      'INSERT INTO thong_bao (id_nguoi_cung_cap, loai, id_khoa_hoc, noi_dung, da_doc) VALUES (?, ?, ?, ?, ?)',
      [ncc, LOAI_THONG_BAO.KHOA_HOC_BI_AN, lt1, 'Khóa học bị ẩn', daDoc],
    );
  }
  // P01-09: 1 yêu cầu chờ duyệt, 1 đã chuyển
  await pool.query(
    `INSERT INTO yeu_cau_rut_tien (id_nguoi_cung_cap, so_tien, ten_ngan_hang, so_tai_khoan, chu_tai_khoan, trang_thai, id_quan_tri_vien, ngay_xu_ly)
     VALUES (?, 100000, 'VCB', '123456789', 'A', ?, NULL, NULL), (?, 100000, 'VCB', '123456789', 'A', ?, ?, NOW())`,
    [ncc, TRANG_THAI_RUT_TIEN.CHO_DUYET, ncc, TRANG_THAI_RUT_TIEN.DA_CHUYEN, admin.id_quan_tri_vien],
  );
});

after(async () => {
  await pool.end();
});

test('P01-01 Khách gọi GET /api/tai-khoan/toi', async () => {
  const res = await request(app).get('/api/tai-khoan/toi');
  assert.equal(res.status, 200);
  assert.deepEqual(res.body, { dang_nhap: false });
});

test('P01-02 Học viên gọi GET /api/tai-khoan/toi', async () => {
  const res = await request(app).get('/api/tai-khoan/toi').set('Cookie', hocVien.cookie);
  assert.equal(res.status, 200);
  assert.equal(res.body.id, hocVien.id);
  assert.equal(res.body.vai_tro, 2);
  assert.equal(typeof res.body.ten_dang_nhap, 'string');
  assert.ok('ho_ten' in res.body && 'anh_dai_dien' in res.body);
  assert.equal(res.body.so_khoa_trong_gio, 2);
});

test('P01-03 Người cung cấp gọi GET /api/tai-khoan/toi', async () => {
  const res = await request(app).get('/api/tai-khoan/toi').set('Cookie', nguoiCungCap.cookie);
  assert.equal(res.status, 200);
  assert.equal(res.body.vai_tro, 3);
  assert.equal(res.body.so_thong_bao_chua_doc, 2);
});

test('P01-04 Tài khoản bị khóa bị đẩy ra ở đường công khai', async () => {
  const hv = await taoNguoiDung(VAI_TRO.HOC_VIEN);
  await pool.query(
    "UPDATE nguoi_dung SET khoa = 1, ly_do_khoa = 'Chia sẻ tài khoản', id_quan_tri_vien = ? WHERE id = ?",
    [admin.id_quan_tri_vien, hv.id],
  );
  for (const duong of ['/api/tai-khoan/toi', '/api/chinh-sach']) {
    const res = await request(app).get(duong).set('Cookie', hv.cookie);
    assert.equal(res.status, 401);
    assert.equal(res.body.ma, 'TAI_KHOAN_BI_KHOA');
    assert.equal(res.body.ly_do_khoa, 'Chia sẻ tài khoản');
    assert.ok(daXoaCookie(res));
  }
});

test('P01-05 Học viên đăng nhập nơi khác bị đẩy ra', async () => {
  const hv = await taoNguoiDung(VAI_TRO.HOC_VIEN);
  await pool.query("UPDATE hoc_vien SET dia_chi_ip = '10.0.0.9' WHERE id = ?", [hv.id_hoc_vien]);
  const res = await request(app).get('/api/tai-khoan/toi').set('Cookie', hv.cookie);
  assert.equal(res.status, 401);
  assert.equal(res.body.ma, 'DANG_NHAP_NOI_KHAC');
  assert.ok(daXoaCookie(res));
});

test('P01-07 Menu danh mục chỉ gồm danh mục có khóa đang bán', async () => {
  const res = await request(app).get('/api/danh-muc/menu');
  assert.equal(res.status, 200);
  assert.deepEqual(res.body, [
    { id: dm.lapTrinh, ten: 'Lập Trình', so_khoa: 2 },
    { id: dm.thietKe, ten: 'Thiết Kế', so_khoa: 1 },
  ]);
});

test('P01-08 Tên cổng thanh toán mặc định', async () => {
  const res = await request(app).get('/api/cong-thanh-toan/mac-dinh');
  assert.equal(res.status, 200);
  assert.equal(res.body.ten, 'VNPay');
});

test('P01-09 Số cho menu khu quản trị', async () => {
  const resAdmin = await request(app).get('/api/quan-tri/so-cho-xu-ly').set('Cookie', admin.cookie);
  assert.equal(resAdmin.status, 200);
  assert.deepEqual(resAdmin.body, { bao_cao_khoa_hoc: 0, bao_cao_danh_gia: 0, yeu_cau_rut_tien: 1 });

  const resHv = await request(app).get('/api/quan-tri/so-cho-xu-ly').set('Cookie', hocVien.cookie);
  assert.equal(resHv.status, 403);
  const resKhach = await request(app).get('/api/quan-tri/so-cho-xu-ly');
  assert.equal(resKhach.status, 401);
});

test('P01-10 Đọc chính sách ban đầu', async () => {
  const res = await request(app).get('/api/chinh-sach');
  assert.equal(res.status, 200);
  assert.equal(res.body.cac_dieu.length, 12);
  assert.equal(res.body.cac_dieu[0].so, 1);
  assert.equal(res.body.cac_dieu[0].ten, 'Giới thiệu và phạm vi áp dụng');
  assert.equal(res.body.cac_dieu[11].ten, 'Cập nhật điều khoản');
  assert.equal(res.body.cap_nhat_luc, null);
});

test('P01-11 Máy chủ chép file chính sách mặc định khi chưa có', async () => {
  const macDinh = await fs.readFile(config.duongDanChinhSachMacDinh, 'utf8');
  await fs.rm(config.duongDanChinhSach, { force: true });

  assert.equal(await chepChinhSachMacDinh(), true);
  assert.equal(await fs.readFile(config.duongDanChinhSach, 'utf8'), macDinh);

  await fs.writeFile(config.duongDanChinhSach, '{"da_sua":true}');
  assert.equal(await chepChinhSachMacDinh(), false);
  assert.equal(await fs.readFile(config.duongDanChinhSach, 'utf8'), '{"da_sua":true}');

  // Trả lại file mặc định cho các file kiểm thử sau
  await fs.rm(config.duongDanChinhSach);
  await chepChinhSachMacDinh();
});
