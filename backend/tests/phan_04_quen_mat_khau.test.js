// Kiểm thử Phần 4 theo docs/kiem_thu/phan_04_quen_mat_khau.md (các trường hợp tự động).
// Database ava_test dùng chung cho mọi file kiểm thử trong một lần chạy, nên tên tài khoản ở đây khác Phần 3
// (dùng "qmk01" thay cho "hv01" của danh sách); Gmail là <tên>@gmail.com.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import bcrypt from 'bcrypt';
import request from 'supertest';
import app from '../app.js';
import pool from '../database/db.js';
import { VAI_TRO } from '../constants/vaiTro.js';
import { hopThuGia } from '../lib/email.js';
import { ORIGIN_HOP_LE } from './duLieuKiemThu.js';
import { taoNguoiDung, cookieAdmin } from './troGiup.js';

const DA_GUI = 'Nếu Gmail này đã đăng ký, mã xác nhận đã được gửi. Vui lòng kiểm tra hộp thư.';
const MA_SAI = 'Mã xác nhận không đúng hoặc đã hết hạn';
const SAI_QUA_NHIEU = 'Bạn đã nhập sai quá nhiều lần, vui lòng gửi lại mã mới';

let qmk01;
let maQmk01;

before(async () => {
  qmk01 = await taoNguoiDung(VAI_TRO.HOC_VIEN, { tenDangNhap: 'qmk01', matKhau: '123456' });
});

after(async () => {
  await pool.end();
});

const goi = (duong, duLieu) => request(app).post(duong).set('Origin', ORIGIN_HOP_LE).send(duLieu);
const quenMatKhau = (gmail) => goi('/api/tai-khoan/quen-mat-khau', { gmail });
const guiLai = (gmail) => goi('/api/tai-khoan/gui-lai-ma-dat-lai', { gmail });
const datLai = (gmail, ma, matKhauMoi = '654321', nhapLai = matKhauMoi) =>
  goi('/api/tai-khoan/dat-lai-mat-khau', { gmail, ma, mat_khau_moi: matKhauMoi, nhap_lai: nhapLai });
const dangNhap = (ten, matKhau, ip = '127.0.0.1') =>
  request(app)
    .post('/api/tai-khoan/dang-nhap')
    .set('Origin', ORIGIN_HOP_LE)
    .set('X-Forwarded-For', ip)
    .send({ ten_dang_nhap: ten, mat_khau: matKhau });

const maTrongThuCuoi = () => hopThuGia.at(-1).noiDung.match(/là: (\d{6})\./)[1];
const maKhac = (ma) => String((Number(ma) + 1) % 1000000).padStart(6, '0');

async function cacMa(idNguoiDung) {
  const [rows] = await pool.query('SELECT * FROM ma_dat_lai_mat_khau WHERE id_nguoi_dung = ? ORDER BY id', [
    idNguoiDung,
  ]);
  return rows;
}
const maMoiNhat = async (idNguoiDung) => (await cacMa(idNguoiDung)).at(-1);
const lui = (idNguoiDung, giay) =>
  pool.query('UPDATE ma_dat_lai_mat_khau SET thoi_diem_gui = NOW() - INTERVAL ? SECOND WHERE id_nguoi_dung = ?', [
    giay,
    idNguoiDung,
  ]);
async function matKhauConLa(idNguoiDung, matKhau) {
  const [[nd]] = await pool.query('SELECT mat_khau_da_bam FROM nguoi_dung WHERE id = ?', [idNguoiDung]);
  return bcrypt.compare(matKhau, nd.mat_khau_da_bam);
}

// Tài khoản mới đã yêu cầu quên mật khẩu, trả cả mã trong thư
async function taoTaiKhoanCoMa(ten) {
  const nd = await taoNguoiDung(VAI_TRO.HOC_VIEN, { tenDangNhap: ten, matKhau: '123456' });
  assert.equal((await quenMatKhau(`${ten}@gmail.com`)).status, 200);
  return { nd, gmail: `${ten}@gmail.com`, ma: maTrongThuCuoi() };
}

test('P04-01 Gmail có tài khoản đang hoạt động', async () => {
  const soThu = hopThuGia.length;
  const res = await quenMatKhau('qmk01@gmail.com');
  assert.equal(res.status, 200);
  assert.deepEqual(res.body, { thong_bao: DA_GUI });

  const ma = await cacMa(qmk01.id);
  assert.equal(ma.length, 1);
  assert.equal(ma[0].so_lan_sai, 0);
  assert.equal(ma[0].da_dung, 0);

  assert.equal(hopThuGia.length, soThu + 1);
  const thu = hopThuGia.at(-1);
  assert.equal(thu.den, 'qmk01@gmail.com');
  assert.equal(thu.tieuDe, 'Mã đặt lại mật khẩu AVA');
  maQmk01 = maTrongThuCuoi();
  assert.equal(
    thu.noiDung,
    `Mã xác nhận để đặt lại mật khẩu tài khoản AVA của bạn là: ${maQmk01}. Mã có hiệu lực trong 10 phút. Nếu bạn không yêu cầu đặt lại mật khẩu, hãy bỏ qua email này.`,
  );
  assert.notEqual(ma[0].ma_6_so_da_bam, maQmk01);
});

test('P04-02 Gmail không có tài khoản', async () => {
  const [[{ so: truoc }]] = await pool.query('SELECT COUNT(*) AS so FROM ma_dat_lai_mat_khau');
  const soThu = hopThuGia.length;
  const res = await quenMatKhau('khongcoai@gmail.com');
  assert.equal(res.status, 200);
  assert.deepEqual(res.body, { thong_bao: DA_GUI });
  const [[{ so: sau }]] = await pool.query('SELECT COUNT(*) AS so FROM ma_dat_lai_mat_khau');
  assert.equal(sau, truoc);
  assert.equal(hopThuGia.length, soThu);
});

test('P04-03 Gmail của tài khoản bị khóa', async () => {
  const admin = await cookieAdmin();
  const khoa = (id) =>
    pool.query("UPDATE nguoi_dung SET khoa = 1, ly_do_khoa = 'Vi phạm điều khoản', id_quan_tri_vien = ? WHERE id = ?", [
      admin.id_quan_tri_vien,
      id,
    ]);

  // Đã khóa thì không tạo mã, không gửi
  const hvkhoa = await taoNguoiDung(VAI_TRO.HOC_VIEN, { tenDangNhap: 'hvkhoa', matKhau: '123456' });
  await khoa(hvkhoa.id);
  const soThu = hopThuGia.length;
  const res = await quenMatKhau('hvkhoa@gmail.com');
  assert.equal(res.status, 200);
  assert.deepEqual(res.body, { thong_bao: DA_GUI });
  assert.equal((await cacMa(hvkhoa.id)).length, 0);
  assert.equal(hopThuGia.length, soThu);

  // Bị khóa sau khi đã nhận mã thì không đặt lại được, mật khẩu giữ nguyên, không tăng số lần sai
  const { nd, gmail, ma } = await taoTaiKhoanCoMa('hvkhoa2');
  await khoa(nd.id);
  const datLaiRes = await datLai(gmail, ma);
  assert.equal(datLaiRes.status, 400);
  assert.equal(datLaiRes.body.cac_o.ma, MA_SAI);
  assert.ok(await matKhauConLa(nd.id, '123456'));
  assert.equal((await maMoiNhat(nd.id)).so_lan_sai, 0);
});

test('P04-04 Gmail sai định dạng', async () => {
  for (const gmail of ['hv01', 'hv01@yahoo.com', 'hv..01@gmail.com']) {
    const res = await quenMatKhau(gmail);
    assert.equal(res.status, 400, gmail);
    assert.equal(res.body.cac_o.gmail, 'Gmail không đúng định dạng. Ví dụ: ten@gmail.com', gmail);
  }
});

test('P04-05 Bấm "Gửi mã" lần hai trong 60 giây', async () => {
  const soThu = hopThuGia.length;
  const res = await quenMatKhau('qmk01@gmail.com');
  assert.equal(res.status, 200);
  assert.deepEqual(res.body, { thong_bao: DA_GUI });
  assert.equal((await cacMa(qmk01.id)).length, 1);
  assert.equal(hopThuGia.length, soThu);
});

test('P04-06 Đặt lại mật khẩu thành công', async () => {
  const res = await datLai('qmk01@gmail.com', maQmk01, '654321', '654321');
  assert.equal(res.status, 200);
  assert.equal((await maMoiNhat(qmk01.id)).da_dung, 1);

  assert.equal((await dangNhap('qmk01', '654321')).status, 200);
  const cu = await dangNhap('qmk01', '123456');
  assert.equal(cu.status, 400);
  assert.equal(cu.body.loi, 'Tên đăng nhập hoặc mật khẩu không đúng');

  const dungLai = await datLai('qmk01@gmail.com', maQmk01, '111111');
  assert.equal(dungLai.status, 400);
  assert.equal(dungLai.body.cac_o.ma, MA_SAI);
});

test('P04-07 Mật khẩu mới sai định dạng hoặc không khớp', async () => {
  const { nd, gmail, ma } = await taoTaiKhoanCoMa('qmk07');
  const saiDinhDang = await datLai(gmail, ma, '12345', '12345');
  assert.equal(saiDinhDang.status, 400);
  assert.equal(saiDinhDang.body.cac_o.mat_khau_moi, 'Mật khẩu phải gồm đúng 6 chữ số');

  const khongKhop = await datLai(gmail, ma, '654321', '654320');
  assert.equal(khongKhop.status, 400);
  assert.equal(khongKhop.body.cac_o.nhap_lai, 'Mật khẩu nhập lại không khớp');

  assert.equal((await maMoiNhat(nd.id)).so_lan_sai, 0);
});

test('P04-08 Mã sai và sai đủ 5 lần', async () => {
  const { nd, gmail, ma } = await taoTaiKhoanCoMa('qmk08');
  for (let lan = 1; lan <= 4; lan += 1) {
    const res = await datLai(gmail, maKhac(ma));
    assert.equal(res.status, 400);
    assert.equal(res.body.cac_o.ma, MA_SAI);
    assert.equal((await maMoiNhat(nd.id)).so_lan_sai, lan);
  }
  const lan5 = await datLai(gmail, maKhac(ma));
  assert.equal(lan5.body.cac_o.ma, SAI_QUA_NHIEU);
  assert.equal((await maMoiNhat(nd.id)).da_dung, 1);

  assert.equal((await datLai(gmail, ma)).body.cac_o.ma, MA_SAI);
  assert.ok(await matKhauConLa(nd.id, '123456'));
});

test('P04-09 Mã quá 10 phút', async () => {
  const { nd, gmail, ma } = await taoTaiKhoanCoMa('qmk09');
  await lui(nd.id, 11 * 60);
  const res = await datLai(gmail, ma);
  assert.equal(res.status, 400);
  assert.equal(res.body.cac_o.ma, MA_SAI);
  assert.ok(await matKhauConLa(nd.id, '123456'));
});

test('P04-10 Gửi lại mã', async () => {
  const { nd, gmail, ma: maCu } = await taoTaiKhoanCoMa('qmk10');

  const som = await guiLai(gmail);
  assert.equal(som.status, 429);
  assert.ok(som.body.giay_cho_gui_lai > 0 && som.body.giay_cho_gui_lai <= 60);

  await lui(nd.id, 61);
  const soThu = hopThuGia.length;
  const res = await guiLai(gmail);
  assert.equal(res.status, 200);
  assert.equal(hopThuGia.length, soThu + 1);
  const maMoi = maTrongThuCuoi();
  const cacDong = await cacMa(nd.id);
  assert.equal(cacDong.length, 2);
  assert.equal(cacDong[0].da_dung, 1, 'mã cũ bị hủy');

  if (maMoi !== maCu) assert.equal((await datLai(gmail, maCu)).body.cac_o.ma, MA_SAI);
  assert.equal((await datLai(gmail, maMoi)).status, 200);
  assert.ok(await matKhauConLa(nd.id, '654321'));
});

test('P04-11 Gửi lại mã với Gmail không có tài khoản', async () => {
  const soThu = hopThuGia.length;
  for (let i = 0; i < 2; i += 1) {
    const res = await guiLai('khongcoai@gmail.com');
    assert.equal(res.status, 200);
    assert.deepEqual(res.body, { thong_bao: DA_GUI });
  }
  assert.equal(hopThuGia.length, soThu);
});

test('P04-12 Đặt lại mật khẩu gỡ tạm chặn đăng nhập', async () => {
  // Học viên đã xác nhận địa chỉ 10.4.12.1 để đăng nhập từ đó không bị hỏi mã
  await taoNguoiDung(VAI_TRO.HOC_VIEN, { tenDangNhap: 'hv12', matKhau: '123456', diaChiIp: '10.4.12.1' });
  for (let i = 0; i < 5; i += 1) await dangNhap('hv12', '000000', '10.4.12.1');
  assert.equal((await dangNhap('hv12', '123456', '10.4.12.1')).status, 429, 'đang bị chặn');

  await quenMatKhau('hv12@gmail.com');
  assert.equal((await datLai('hv12@gmail.com', maTrongThuCuoi(), '654321')).status, 200);
  assert.equal((await dangNhap('hv12', '654321', '10.4.12.1')).status, 200);
});
