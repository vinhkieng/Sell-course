// Kiểm thử hạ tầng của khung dự án (không phải kiểm thử chức năng): lệnh tạo admin (Phần chung C2).
// Lệnh npm test đã tạo sẵn admin kiểm thử trong ava_test trước khi chạy file này.
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import pool from '../database/db.js';
import { taoAdmin } from '../services/taoAdminService.js';
import { ADMIN_KIEM_THU } from './duLieuKiemThu.js';

after(async () => {
  await pool.end();
});

test('Seed tạo đúng 1 dòng nguoi_dung vai_tro 1 và 1 dòng quan_tri_vien với hợp đồng mẫu', async () => {
  const [admin] = await pool.query(
    'SELECT id, ten_dang_nhap, gmail, ma_gioi_thieu FROM nguoi_dung WHERE vai_tro = 1',
  );
  assert.equal(admin.length, 1);
  assert.equal(admin[0].ten_dang_nhap, ADMIN_KIEM_THU.tenDangNhap);
  assert.match(admin[0].ma_gioi_thieu, /^[A-Z0-9]{8}$/);

  const [hopDong] = await pool.query(
    `SELECT so_cccd, ngay_cap_cccd, noi_cap_cccd, so_hop_dong, ngay_bat_dau_lam
       FROM quan_tri_vien WHERE id_nguoi_dung = ?`,
    [admin[0].id],
  );
  assert.equal(hopDong.length, 1);
  assert.deepEqual(hopDong[0], {
    so_cccd: '079200001234',
    ngay_cap_cccd: '2021-05-01',
    noi_cap_cccd: 'Cục Cảnh sát quản lý hành chính về trật tự xã hội',
    so_hop_dong: 'HD-2026-001',
    ngay_bat_dau_lam: '2026-01-02',
  });
});

test('Chạy lại seed với tài khoản đã có thì bỏ qua, không thêm dòng', async () => {
  const ketQua = await taoAdmin({ ...ADMIN_KIEM_THU, gmail: 'ADMINKIEMTHU@gmail.com' });
  assert.equal(ketQua.daTao, false);
  const [[dem]] = await pool.query('SELECT COUNT(*) AS so FROM nguoi_dung WHERE vai_tro = 1');
  assert.equal(dem.so, 1);
});

test('Admin thứ hai dùng số mẫu tự tăng và Gmail lưu chữ thường', async () => {
  const ketQua = await taoAdmin({ tenDangNhap: 'adminhai', gmail: 'Admin.Hai@Gmail.com', matKhau: '654321' });
  assert.equal(ketQua.daTao, true);
  const [[dong]] = await pool.query(
    `SELECT nd.id, nd.gmail, qtv.so_cccd, qtv.so_hop_dong
       FROM nguoi_dung nd JOIN quan_tri_vien qtv ON qtv.id_nguoi_dung = nd.id
      WHERE nd.ten_dang_nhap = 'adminhai'`,
  );
  assert.equal(dong.gmail, 'admin.hai@gmail.com');
  assert.equal(dong.so_cccd, '079200001235');
  assert.equal(dong.so_hop_dong, 'HD-2026-002');

  // Dọn lại để các file kiểm thử sau vẫn chỉ có một admin
  await pool.query('DELETE FROM quan_tri_vien WHERE id_nguoi_dung = ?', [dong.id]);
  await pool.query('DELETE FROM nguoi_dung WHERE id = ?', [dong.id]);
});
