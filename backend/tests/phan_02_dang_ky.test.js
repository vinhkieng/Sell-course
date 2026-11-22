// Kiểm thử Phần 2 theo docs/kiem_thu/phan_02_dang_ky.md (các trường hợp tự động).
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import bcrypt from 'bcrypt';
import request from 'supertest';
import app from '../app.js';
import pool from '../database/db.js';
import { VAI_TRO } from '../constants/vaiTro.js';
import { ORIGIN_HOP_LE } from './duLieuKiemThu.js';
import { taoNguoiDung } from './troGiup.js';

const TEN_SAI = 'Tên đăng nhập chỉ gồm chữ không dấu và số, không có khoảng trắng, dấu hay ký tự đặc biệt (4 đến 30 ký tự)';

after(async () => {
  await pool.end();
});

const dangKy = (duLieu) =>
  request(app).post('/api/tai-khoan/dang-ky').set('Origin', ORIGIN_HOP_LE).send(duLieu);

// Dữ liệu hợp lệ, mỗi lần gọi một tên và Gmail mới
let dem = 0;
function hopLe(them = {}) {
  dem += 1;
  return {
    ten_dang_nhap: `dangky${dem}`,
    gmail: `dangky${dem}@gmail.com`,
    mat_khau: '123456',
    xac_nhan_mat_khau: '123456',
    vai_tro: VAI_TRO.HOC_VIEN,
    dong_y: true,
    ...them,
  };
}

async function soNguoiDung() {
  const [[dong]] = await pool.query('SELECT COUNT(*) AS so FROM nguoi_dung');
  return dong.so;
}

async function docNguoiDung(tenDangNhap) {
  const [[nd]] = await pool.query('SELECT * FROM nguoi_dung WHERE ten_dang_nhap = ?', [tenDangNhap]);
  const [hv] = await pool.query('SELECT * FROM hoc_vien WHERE id_nguoi_dung = ?', [nd.id]);
  const [ncc] = await pool.query('SELECT * FROM nguoi_cung_cap WHERE id_nguoi_dung = ?', [nd.id]);
  return { nd, hv, ncc };
}

test('P02-01 Đăng ký học viên hợp lệ', async () => {
  const res = await dangKy({
    ten_dang_nhap: 'An01', gmail: 'an01@gmail.com', mat_khau: '123456', xac_nhan_mat_khau: '123456', vai_tro: 2, dong_y: true,
  });
  assert.equal(res.status, 201);
  const { nd, hv, ncc } = await docNguoiDung('An01');
  assert.equal(nd.ten_dang_nhap, 'An01');
  assert.equal(nd.vai_tro, 2);
  assert.equal(nd.khoa, 0);
  assert.match(nd.ma_gioi_thieu, /^[A-Z0-9]{8}$/);
  assert.equal(nd.ho_ten, null);
  assert.equal(nd.so_dien_thoai, null);
  assert.equal(nd.anh_dai_dien, null);
  assert.notEqual(nd.mat_khau_da_bam, '123456');
  assert.ok(await bcrypt.compare('123456', nd.mat_khau_da_bam));
  assert.equal(hv.length, 1);
  assert.equal(hv[0].dia_chi_ip, null);
  assert.equal(ncc.length, 0);
});

test('P02-02 Đăng ký người cung cấp hợp lệ', async () => {
  const res = await dangKy({
    ten_dang_nhap: 'Binh02', gmail: 'binh02@gmail.com', mat_khau: '654321', xac_nhan_mat_khau: '654321', vai_tro: 3, dong_y: true,
  });
  assert.equal(res.status, 201);
  const { nd, hv, ncc } = await docNguoiDung('Binh02');
  assert.equal(nd.vai_tro, 3);
  assert.equal(ncc.length, 1);
  assert.equal(ncc[0].ten_ngan_hang, null);
  assert.equal(ncc[0].so_tai_khoan, null);
  assert.equal(ncc[0].chu_tai_khoan, null);
  assert.equal(hv.length, 0);
});

test('P02-03 Mã giới thiệu không trùng', async () => {
  const cacMa = [];
  for (let i = 0; i < 5; i += 1) {
    const duLieu = hopLe();
    assert.equal((await dangKy(duLieu)).status, 201);
    cacMa.push((await docNguoiDung(duLieu.ten_dang_nhap)).nd.ma_gioi_thieu);
  }
  assert.equal(new Set(cacMa).size, 5);
  for (const ma of cacMa) assert.match(ma, /^[A-Z0-9]{8}$/);
});

test('P02-04 Trùng tên đăng nhập không phân biệt hoa thường', async () => {
  const truoc = await soNguoiDung();
  const res = await dangKy(hopLe({ ten_dang_nhap: 'an01' }));
  assert.equal(res.status, 409);
  assert.equal(res.body.cac_o.ten_dang_nhap, 'Tên đăng nhập đã được sử dụng');
  assert.equal(await soNguoiDung(), truoc);
});

test('P02-05 Gmail lưu chữ thường và trùng không phân biệt hoa thường', async () => {
  const lan1 = hopLe({ gmail: 'Abc@GMAIL.com' });
  assert.equal((await dangKy(lan1)).status, 201);
  assert.equal((await docNguoiDung(lan1.ten_dang_nhap)).nd.gmail, 'abc@gmail.com');

  const lan2 = await dangKy(hopLe({ gmail: 'abc@gmail.com' }));
  assert.equal(lan2.status, 409);
  assert.equal(lan2.body.cac_o.gmail, 'Gmail này đã được sử dụng');
});

test('P02-06 Tên đăng nhập lưu đúng như người dùng gõ', async () => {
  assert.equal((await dangKy(hopLe({ ten_dang_nhap: 'NguyenAn' }))).status, 201);
  assert.equal((await docNguoiDung('NguyenAn')).nd.ten_dang_nhap, 'NguyenAn');
});

test('P02-07 Để trống các ô bắt buộc', async () => {
  const truoc = await soNguoiDung();
  const res = await dangKy({ ten_dang_nhap: '', gmail: '', mat_khau: '', xac_nhan_mat_khau: '', dong_y: false });
  assert.equal(res.status, 400);
  assert.deepEqual(res.body.cac_o, {
    ten_dang_nhap: 'Vui lòng nhập tên đăng nhập',
    gmail: 'Vui lòng nhập Gmail',
    mat_khau: 'Vui lòng nhập mật khẩu',
    xac_nhan_mat_khau: 'Vui lòng nhập lại mật khẩu',
    vai_tro: 'Vui lòng chọn vai trò',
    dong_y: 'Vui lòng đồng ý với Chính sách và điều khoản',
  });
  assert.equal(await soNguoiDung(), truoc);
});

test('P02-08 Tên đăng nhập sai định dạng', async () => {
  for (const ten of ['abc', 'a'.repeat(31), 'an 01', 'an_01', 'ân01', 'an@01']) {
    const res = await dangKy(hopLe({ ten_dang_nhap: ten }));
    assert.equal(res.status, 400, ten);
    assert.equal(res.body.cac_o.ten_dang_nhap, TEN_SAI, ten);
  }
  // Biên đúng: 4 và 30 ký tự
  assert.equal((await dangKy(hopLe({ ten_dang_nhap: 'abcd' }))).status, 201);
  assert.equal((await dangKy(hopLe({ ten_dang_nhap: 'b'.repeat(30) }))).status, 201);
});

test('P02-09 Gmail sai đuôi và sai phần trước @', async () => {
  for (const gmail of ['an01@yahoo.com', 'an01']) {
    const res = await dangKy(hopLe({ gmail }));
    assert.equal(res.status, 400, gmail);
    assert.equal(res.body.cac_o.gmail, 'Gmail phải có đuôi @gmail.com', gmail);
  }
  for (const gmail of ['.an01@gmail.com', 'an..01@gmail.com', 'an_01@gmail.com']) {
    const res = await dangKy(hopLe({ gmail }));
    assert.equal(res.status, 400, gmail);
    assert.equal(res.body.cac_o.gmail, 'Gmail không đúng định dạng. Ví dụ: ten@gmail.com', gmail);
  }
});

test('P02-10 Mật khẩu sai định dạng và không khớp', async () => {
  for (const matKhau of ['12345', '1234567', '12345a']) {
    const res = await dangKy(hopLe({ mat_khau: matKhau, xac_nhan_mat_khau: matKhau }));
    assert.equal(res.status, 400, matKhau);
    assert.equal(res.body.cac_o.mat_khau, 'Mật khẩu phải gồm đúng 6 chữ số', matKhau);
  }
  const res = await dangKy(hopLe({ mat_khau: '123456', xac_nhan_mat_khau: '123457' }));
  assert.equal(res.status, 400);
  assert.equal(res.body.cac_o.xac_nhan_mat_khau, 'Mật khẩu nhập lại không khớp');
});

test('P02-11 Không tích ô đồng ý', async () => {
  const truoc = await soNguoiDung();
  const res = await dangKy(hopLe({ dong_y: false }));
  assert.equal(res.status, 400);
  assert.equal(res.body.cac_o.dong_y, 'Vui lòng đồng ý với Chính sách và điều khoản');
  assert.equal(await soNguoiDung(), truoc);
});

test('P02-12 Không đăng ký được admin hoặc vai trò lạ', async () => {
  const truoc = await soNguoiDung();
  const [[{ so: soAdmin }]] = await pool.query('SELECT COUNT(*) AS so FROM nguoi_dung WHERE vai_tro = 1');
  for (const vaiTro of [1, 4]) {
    const res = await dangKy(hopLe({ vai_tro: vaiTro }));
    assert.equal(res.status, 400, String(vaiTro));
    assert.equal(res.body.cac_o.vai_tro, 'Vui lòng chọn vai trò');
  }
  assert.equal(await soNguoiDung(), truoc);
  const [[{ so: soAdminSau }]] = await pool.query('SELECT COUNT(*) AS so FROM nguoi_dung WHERE vai_tro = 1');
  assert.equal(soAdminSau, soAdmin);
});

test('P02-13 Người đã đăng nhập không đăng ký được', async () => {
  const hv = await taoNguoiDung(VAI_TRO.HOC_VIEN);
  const truoc = await soNguoiDung();
  const res = await dangKy(hopLe()).set('Cookie', hv.cookie);
  assert.equal(res.status, 403);
  assert.equal(await soNguoiDung(), truoc);
});

test('P02-14 Gom nhiều lỗi cùng lúc', async () => {
  const res = await dangKy({
    ten_dang_nhap: 'ab', gmail: 'x@yahoo.com', mat_khau: '1', xac_nhan_mat_khau: '1', dong_y: true,
  });
  assert.equal(res.status, 400);
  for (const o of ['ten_dang_nhap', 'gmail', 'mat_khau', 'vai_tro']) assert.ok(res.body.cac_o[o], o);
});

test('P02-16 Thiếu tiêu đề Origin', async () => {
  const truoc = await soNguoiDung();
  const khongOrigin = await request(app).post('/api/tai-khoan/dang-ky').send(hopLe());
  assert.equal(khongOrigin.status, 403);
  const originLa = await request(app)
    .post('/api/tai-khoan/dang-ky')
    .set('Origin', 'http://trang-la.vn')
    .send(hopLe());
  assert.equal(originLa.status, 403);
  assert.equal(await soNguoiDung(), truoc);
});
