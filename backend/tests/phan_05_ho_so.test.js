// Kiểm thử Phần 5 theo docs/kiem_thu/phan_05_ho_so.md (các trường hợp tự động).
// Database ava_test dùng chung cho mọi file kiểm thử, nên tên tài khoản ở đây là "hs01", "hs02",
// "hsncc01", "hsncc02" thay cho "hv01", "hv02", "ncc01", "ncc02" của danh sách.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import request from 'supertest';
import app from '../app.js';
import pool from '../database/db.js';
import config from '../config.js';
import { VAI_TRO } from '../constants/vaiTro.js';
import { TRANG_THAI_DON_HANG } from '../constants/trangThai.js';
import { hopThuGia } from '../lib/email.js';
import { ORIGIN_HOP_LE } from './duLieuKiemThu.js';
import { taoNguoiDung, cookieAdmin, taoDanhMuc, taoKhoaHoc } from './troGiup.js';

const HO_TEN_SAI = 'Họ tên từ 2 đến 100 ký tự, chỉ gồm chữ và dấu cách';
const SDT_SAI = 'Số điện thoại gồm 10 chữ số, bắt đầu bằng số 0';
const CO_DON = 'Bạn đã có đơn hàng nên cần giữ họ tên và số điện thoại.';
const DA_DANG = 'Đã đăng khóa học nên không đổi được họ tên và số điện thoại.';
const ANH_SAI = 'Ảnh phải là jpg hoặc png, tối đa 2MB';

// Ảnh mẫu: PNG 1x1 và JPG nhỏ thật, file chữ đổi đuôi, PNG lớn hơn 2MB
const PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
  'base64',
);
const JPG = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01, 0xff, 0xd9]);
const CHU_DOI_DUOI = Buffer.from('Đây là file chữ, không phải ảnh');
const PNG_QUA_LON = Buffer.concat([PNG, Buffer.alloc(2 * 1024 * 1024)]);

let hs01, hs02, hsncc01, hsncc02, admin;

before(async () => {
  hs01 = await taoNguoiDung(VAI_TRO.HOC_VIEN, { tenDangNhap: 'hs01' });
  hs02 = await taoNguoiDung(VAI_TRO.HOC_VIEN, { tenDangNhap: 'hs02', hoTen: 'Lê Hồng' });
  await pool.query("UPDATE nguoi_dung SET so_dien_thoai = '0911111111' WHERE id = ?", [hs02.id]);
  await pool.query('INSERT INTO don_hang (id_hoc_vien, id_cong_thanh_toan, tong_tien, trang_thai) VALUES (?, 1, 100000, ?)', [
    hs02.id_hoc_vien,
    TRANG_THAI_DON_HANG.HET_HAN,
  ]);
  hsncc01 = await taoNguoiDung(VAI_TRO.NGUOI_CUNG_CAP, { tenDangNhap: 'hsncc01' });
  hsncc02 = await taoNguoiDung(VAI_TRO.NGUOI_CUNG_CAP, { tenDangNhap: 'hsncc02', hoTen: 'Trần Bình' });
  await pool.query("UPDATE nguoi_dung SET so_dien_thoai = '0987654321' WHERE id = ?", [hsncc02.id]);
  await taoKhoaHoc(hsncc02.id_nguoi_cung_cap, await taoDanhMuc('Hồ Sơ Thử'), { daXoa: 1 });
  admin = await cookieAdmin();
});

after(async () => {
  // Xóa ảnh đại diện do kiểm thử tải lên (database ava_test chỉ có dữ liệu kiểm thử)
  const [cacAnh] = await pool.query('SELECT anh_dai_dien FROM nguoi_dung WHERE anh_dai_dien IS NOT NULL');
  for (const { anh_dai_dien: anh } of cacAnh) {
    await fs.rm(path.join(config.thuMucLuuTru, 'anh_dai_dien', path.basename(anh)), { force: true });
  }
  await pool.end();
});

const xem = (cookie) => request(app).get('/api/ho-so').set('Cookie', cookie);
const capNhat = (cookie, duLieu) =>
  request(app).put('/api/ho-so').set('Origin', ORIGIN_HOP_LE).set('Cookie', cookie).send(duLieu);
const guiAnh = (cookie, noiDung, tenFile) =>
  request(app)
    .post('/api/ho-so/anh-dai-dien')
    .set('Origin', ORIGIN_HOP_LE)
    .set('Cookie', cookie)
    .attach('anh', noiDung, tenFile);
const doiMatKhau = (cookie, hienTai, moi, xacNhan) =>
  request(app)
    .post('/api/ho-so/doi-mat-khau')
    .set('Origin', ORIGIN_HOP_LE)
    .set('Cookie', cookie)
    .send({ mat_khau_hien_tai: hienTai, mat_khau_moi: moi, xac_nhan: xacNhan });

// Dữ liệu gửi lên lấy từ hồ sơ đang lưu, đè thêm các ô muốn đổi
async function hoSoKem(cookie, them) {
  const hs = (await xem(cookie)).body;
  return {
    ho_ten: hs.ho_ten ?? '',
    gmail: hs.gmail,
    so_dien_thoai: hs.so_dien_thoai ?? '',
    nghe_nghiep: hs.nghe_nghiep ?? '',
    ngay_sinh: hs.ngay_sinh ?? '',
    ...them,
  };
}
async function dongNguoiDung(id) {
  const [[nd]] = await pool.query('SELECT ho_ten, gmail, so_dien_thoai, anh_dai_dien FROM nguoi_dung WHERE id = ?', [id]);
  return nd;
}

test('P05-01 Xem hồ sơ theo vai trò', async () => {
  const hv = (await xem(hs01.cookie)).body;
  assert.ok('nghe_nghiep' in hv && 'ngay_sinh' in hv);
  assert.equal(hv.so_cccd, undefined);

  const ncc = (await xem(hsncc02.cookie)).body;
  assert.equal(ncc.da_dang_khoa_hoc, true);
  assert.equal(ncc.so_cccd, undefined);

  const qtv = (await xem(admin.cookie)).body;
  assert.equal(qtv.so_cccd, '079200001234');
  assert.equal(qtv.ngay_cap_cccd, '2021-05-01');
  assert.equal(qtv.noi_cap_cccd, 'Cục Cảnh sát quản lý hành chính về trật tự xã hội');
  assert.equal(qtv.so_hop_dong, 'HD-2026-001');
  assert.equal(qtv.ngay_bat_dau_lam, '2026-01-02');

  assert.equal((await request(app).get('/api/ho-so')).status, 401);
});

test('P05-02 Cập nhật thông tin hợp lệ', async () => {
  const soThu = hopThuGia.length;
  const res = await capNhat(hs01.cookie, {
    ho_ten: '  Nguyễn   Văn  An ',
    gmail: 'HS01Moi@Gmail.com',
    so_dien_thoai: '0912345678',
    nghe_nghiep: 'Sinh viên',
    ngay_sinh: '2004-03-15',
  });
  assert.equal(res.status, 200);
  assert.equal(res.body.ho_ten, 'Nguyễn Văn An');
  assert.equal(res.body.gmail, 'hs01moi@gmail.com');
  assert.equal(res.body.ngay_sinh, '2004-03-15');
  const nd = await dongNguoiDung(hs01.id);
  assert.equal(nd.ho_ten, 'Nguyễn Văn An');
  assert.equal(nd.gmail, 'hs01moi@gmail.com');
  assert.equal(hopThuGia.length, soThu);
});

test('P05-03 Họ tên, số điện thoại, ngày sinh, nghề nghiệp sai', async () => {
  const [[{ mai }]] = await pool.query("SELECT DATE_FORMAT(CURDATE() + INTERVAL 1 DAY, '%Y-%m-%d') AS mai");
  const cacBo = [
    [{ ho_ten: 'A' }, 'ho_ten', HO_TEN_SAI],
    [{ ho_ten: 'An123' }, 'ho_ten', HO_TEN_SAI],
    [{ so_dien_thoai: '1912345678' }, 'so_dien_thoai', SDT_SAI],
    [{ so_dien_thoai: '091234567' }, 'so_dien_thoai', SDT_SAI],
    [{ ngay_sinh: '2026-02-30' }, 'ngay_sinh', 'Ngày sinh không hợp lệ'],
    [{ ngay_sinh: mai }, 'ngay_sinh', 'Ngày sinh không hợp lệ'],
    [{ ngay_sinh: '1899-12-31' }, 'ngay_sinh', 'Ngày sinh không hợp lệ'],
    [{ nghe_nghiep: 'a'.repeat(101) }, 'nghe_nghiep', 'Nghề nghiệp tối đa 100 ký tự'],
  ];
  for (const [them, o, cau] of cacBo) {
    const res = await capNhat(hs01.cookie, await hoSoKem(hs01.cookie, them));
    assert.equal(res.status, 400, JSON.stringify(them));
    assert.equal(res.body.cac_o[o], cau, JSON.stringify(them));
  }
  const bien = await capNhat(hs01.cookie, await hoSoKem(hs01.cookie, { ngay_sinh: '1900-01-01' }));
  assert.equal(bien.status, 200);
  assert.equal(bien.body.ngay_sinh, '1900-01-01');
});

test('P05-04 Gmail sai hoặc trùng', async () => {
  const cacBo = [
    ['', 400, 'Vui lòng nhập Gmail'],
    ['hv01@yahoo.com', 400, 'Gmail phải có đuôi @gmail.com'],
    ['hv..01@gmail.com', 400, 'Gmail không đúng định dạng. Ví dụ: ten@gmail.com'],
    ['HS02@GMAIL.COM', 409, 'Gmail này đã được sử dụng'],
  ];
  for (const [gmail, maTrangThai, cau] of cacBo) {
    const res = await capNhat(hs01.cookie, await hoSoKem(hs01.cookie, { gmail }));
    assert.equal(res.status, maTrangThai, gmail);
    assert.equal(res.body.cac_o.gmail, cau, gmail);
  }
});

test('P05-05 Học viên có đơn không xóa trống họ tên, số điện thoại', async () => {
  for (const them of [{ so_dien_thoai: '' }, { ho_ten: '' }]) {
    const res = await capNhat(hs02.cookie, await hoSoKem(hs02.cookie, them));
    assert.equal(res.status, 400);
    assert.equal(res.body.loi, CO_DON);
  }
  const nd = await dongNguoiDung(hs02.id);
  assert.equal(nd.ho_ten, 'Lê Hồng');
  assert.equal(nd.so_dien_thoai, '0911111111');
});

test('P05-06 Học viên chưa có đơn, người cung cấp, admin được để trống', async () => {
  for (const nguoi of [hs01, hsncc01, admin]) {
    // Có họ tên và số điện thoại trước, rồi xóa trống
    assert.equal((await capNhat(nguoi.cookie, await hoSoKem(nguoi.cookie, { ho_ten: 'Phạm Minh', so_dien_thoai: '0900000001' }))).status, 200);
    const res = await capNhat(nguoi.cookie, await hoSoKem(nguoi.cookie, { ho_ten: '', so_dien_thoai: '' }));
    assert.equal(res.status, 200);
    const nd = await dongNguoiDung(nguoi.id);
    assert.equal(nd.ho_ten, null);
    assert.equal(nd.so_dien_thoai, null);
  }
});

test('P05-07 Người cung cấp đã đăng khóa không đổi họ tên, số điện thoại', async () => {
  for (const them of [{ ho_ten: 'Trần Bình An' }, { so_dien_thoai: '0987000000' }]) {
    const res = await capNhat(hsncc02.cookie, await hoSoKem(hsncc02.cookie, them));
    assert.equal(res.status, 400);
    assert.equal(res.body.loi, DA_DANG);
  }
  let nd = await dongNguoiDung(hsncc02.id);
  assert.equal(nd.ho_ten, 'Trần Bình');
  assert.equal(nd.so_dien_thoai, '0987654321');

  const doiGmail = await capNhat(hsncc02.cookie, await hoSoKem(hsncc02.cookie, { gmail: 'hsncc02moi@gmail.com' }));
  assert.equal(doiGmail.status, 200);
  nd = await dongNguoiDung(hsncc02.id);
  assert.equal(nd.gmail, 'hsncc02moi@gmail.com');
});

test('P05-08 Đổi ảnh đại diện hợp lệ', async () => {
  const lan1 = await guiAnh(hs01.cookie, PNG, 'a.png');
  assert.equal(lan1.status, 200);
  const anh1 = (await dongNguoiDung(hs01.id)).anh_dai_dien;
  assert.match(anh1, /^anh_dai_dien\/[0-9a-f-]{36}\.png$/);

  const lan2 = await guiAnh(hs01.cookie, JPG, 'b.jpg');
  assert.equal(lan2.status, 200);
  const anh2 = (await dongNguoiDung(hs01.id)).anh_dai_dien;
  assert.match(anh2, /^anh_dai_dien\/[0-9a-f-]{36}\.jpg$/);
  assert.equal(lan2.body.anh_dai_dien, `/api/anh/${anh2}`);

  await assert.rejects(fs.access(path.join(config.thuMucLuuTru, anh1)), 'file ảnh cũ đã bị xóa');
  const layAnh = await request(app).get(`/api/anh/${anh2}`);
  assert.equal(layAnh.status, 200);
});

test('P05-09 Ảnh sai loại hoặc quá 2MB', async () => {
  const truoc = (await dongNguoiDung(hs01.id)).anh_dai_dien;
  const fileGia = await guiAnh(hs01.cookie, CHU_DOI_DUOI, 'gia.png');
  assert.equal(fileGia.status, 400);
  assert.equal(fileGia.body.cac_o.anh_dai_dien, ANH_SAI);

  const quaLon = await guiAnh(hs01.cookie, PNG_QUA_LON, 'lon.png');
  assert.equal(quaLon.status, 413);
  assert.equal(quaLon.body.cac_o.anh_dai_dien, ANH_SAI);

  assert.equal((await dongNguoiDung(hs01.id)).anh_dai_dien, truoc);
});

test('P05-10 Đường lấy ảnh chỉ cho hai thư mục và tên đúng mẫu', async () => {
  for (const duong of [
    '/api/anh/anh_dai_dien/abc.png',
    '/api/anh/video/3f2a1b4c-1d2e-4f3a-8b9c-0d1e2f3a4b5c.mp4',
    '/api/anh/anh_dai_dien/..%2F..%2Fconfig.js',
  ]) {
    assert.equal((await request(app).get(duong)).status, 404, duong);
  }
});

test('P05-11 Đổi mật khẩu thành công', async () => {
  await taoNguoiDung(VAI_TRO.HOC_VIEN, { tenDangNhap: 'hs11', matKhau: '123456' });
  const dangNhap = (matKhau) =>
    request(app).post('/api/tai-khoan/dang-nhap').set('Origin', ORIGIN_HOP_LE).send({ ten_dang_nhap: 'hs11', mat_khau: matKhau });
  const layCookie = (res) => res.headers['set-cookie'].find((c) => c.startsWith('ava_phien=')).split(';')[0];
  const phien1 = layCookie(await dangNhap('123456'));
  const phien2 = layCookie(await dangNhap('123456'));

  assert.equal((await doiMatKhau(phien1, '123456', '654321', '654321')).status, 200);
  const toi = await request(app).get('/api/tai-khoan/toi').set('Cookie', phien2);
  assert.equal(toi.status, 200);
  assert.equal(toi.body.dang_nhap, true);
  assert.equal((await dangNhap('654321')).status, 200);
});

test('P05-12 Đổi mật khẩu sai', async () => {
  const hv = await taoNguoiDung(VAI_TRO.HOC_VIEN, { tenDangNhap: 'hs12', matKhau: '123456' });
  const trong = await doiMatKhau(hv.cookie, '', '', '');
  assert.equal(trong.status, 400);
  assert.deepEqual(trong.body.cac_o, {
    mat_khau_hien_tai: 'Vui lòng nhập mật khẩu',
    mat_khau_moi: 'Vui lòng nhập mật khẩu',
    xac_nhan: 'Vui lòng nhập lại mật khẩu',
  });
  assert.equal((await doiMatKhau(hv.cookie, '123456', '12345', '12345')).body.cac_o.mat_khau_moi, 'Mật khẩu phải gồm đúng 6 chữ số');
  assert.equal((await doiMatKhau(hv.cookie, '123456', '654321', '654320')).body.cac_o.xac_nhan, 'Mật khẩu nhập lại không khớp');
  for (let i = 0; i < 6; i += 1) {
    const sai = await doiMatKhau(hv.cookie, '000000', '654321', '654321');
    assert.equal(sai.status, 400, 'không bị chặn 429');
    assert.equal(sai.body.cac_o.mat_khau_hien_tai, 'Mật khẩu hiện tại không đúng');
  }
  assert.equal(
    (await doiMatKhau(hv.cookie, '123456', '123456', '123456')).body.cac_o.mat_khau_moi,
    'Mật khẩu mới trùng với mật khẩu cũ, vui lòng nhập mật khẩu khác',
  );
});

test('P05-13 Admin không sửa được hợp đồng', async () => {
  const res = await capNhat(admin.cookie, {
    ...(await hoSoKem(admin.cookie, {})),
    so_cccd: '079299999999',
    so_hop_dong: 'HD-2099-999',
  });
  assert.equal(res.status, 200);
  const [[hd]] = await pool.query('SELECT so_cccd, so_hop_dong FROM quan_tri_vien WHERE id = ?', [admin.id_quan_tri_vien]);
  assert.equal(hd.so_cccd, '079200001234');
  assert.equal(hd.so_hop_dong, 'HD-2026-001');
});
