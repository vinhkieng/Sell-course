// Kiểm thử Phần 3 theo docs/kiem_thu/phan_03_dang_nhap.md (các trường hợp tự động).
// Giả địa chỉ IP bằng tiêu đề X-Forwarded-For (máy chủ tin máy trung gian loopback, Phần chung C4).
// Bộ đếm sai nằm trong bộ nhớ: mỗi trường hợp gửi sai dùng tên và địa chỉ IP riêng.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import jwt from 'jsonwebtoken';
import request from 'supertest';
import app from '../app.js';
import pool from '../database/db.js';
import { VAI_TRO } from '../constants/vaiTro.js';
import { hopThuGia } from '../lib/email.js';
import { ORIGIN_HOP_LE, ADMIN_KIEM_THU } from './duLieuKiemThu.js';
import { taoNguoiDung, cookieAdmin, taoDanhMuc, taoKhoaHoc } from './troGiup.js';

const SAI = 'Tên đăng nhập hoặc mật khẩu không đúng';
const GUI_QUA_NHIEU = 'Bạn đã yêu cầu gửi mã quá nhiều lần. Vui lòng thử lại sau.';
const SAI_QUA_NHIEU = 'Bạn đã nhập sai quá nhiều lần, vui lòng bấm Gửi lại mã.';

let hv01;
let phienCuHv01; // cookie phiên của hv01 lúc còn ở 127.0.0.1 (P03-01), dùng ở P03-12
let choHv01; // cookie tạm của hv01 ở P03-10, dùng ở P03-11

before(async () => {
  hv01 = await taoNguoiDung(VAI_TRO.HOC_VIEN, { tenDangNhap: 'hv01', matKhau: '123456', diaChiIp: null });
});

after(async () => {
  await pool.end();
});

const dangNhap = (ten, matKhau, ip = '127.0.0.1') =>
  request(app)
    .post('/api/tai-khoan/dang-nhap')
    .set('Origin', ORIGIN_HOP_LE)
    .set('X-Forwarded-For', ip)
    .send({ ten_dang_nhap: ten, mat_khau: matKhau });

const goiVoiCookie = (duong, cookie, duLieu = {}) =>
  request(app).post(duong).set('Origin', ORIGIN_HOP_LE).set('Cookie', cookie ?? '').send(duLieu);
const xacNhan = (cookie, ma) => goiVoiCookie('/api/tai-khoan/xac-nhan-dang-nhap', cookie, { ma });
const guiLai = (cookie) => goiVoiCookie('/api/tai-khoan/gui-lai-ma-dang-nhap', cookie);

// Dòng Set-Cookie đầy đủ của một cookie (bỏ qua dòng xóa cookie)
function dongCookie(res, ten) {
  return (res.headers['set-cookie'] ?? []).find((c) => c.startsWith(`${ten}=`) && !c.startsWith(`${ten}=;`));
}
// "ten=giá trị" để gửi lại trong tiêu đề Cookie
const cookie = (res, ten) => dongCookie(res, ten)?.split(';')[0];
const daXoaCookie = (res, ten) =>
  (res.headers['set-cookie'] ?? []).some((c) => c.startsWith(`${ten}=;`) && c.includes('Expires=Thu, 01 Jan 1970'));

const maTrongThuCuoi = () => hopThuGia.at(-1).noiDung.match(/là: (\d{6})\./)[1];
const maKhac = (ma) => String((Number(ma) + 1) % 1000000).padStart(6, '0');

async function dongXacMinh(idHocVien) {
  const [[dong]] = await pool.query('SELECT * FROM xac_minh_ip WHERE id_hoc_vien = ?', [idHocVien]);
  return dong;
}
async function diaChiIp(idHocVien) {
  const [[dong]] = await pool.query('SELECT dia_chi_ip FROM hoc_vien WHERE id = ?', [idHocVien]);
  return dong.dia_chi_ip;
}

// Học viên đã có địa chỉ 127.0.0.1, đăng nhập từ ipMoi để có một lượt chờ xác nhận
async function taoLuotCho(ten, ipMoi) {
  const hv = await taoNguoiDung(VAI_TRO.HOC_VIEN, { tenDangNhap: ten, matKhau: '123456' });
  const res = await dangNhap(ten, '123456', ipMoi);
  assert.equal(res.body.can_xac_nhan, true);
  return { hv, cho: cookie(res, 'ava_cho_xac_nhan'), ma: maTrongThuCuoi() };
}
const lui = (idHocVien, giay) =>
  pool.query('UPDATE xac_minh_ip SET thoi_diem_gui_ma = NOW() - INTERVAL ? SECOND WHERE id_hoc_vien = ?', [
    giay,
    idHocVien,
  ]);

test('P03-01 Học viên đăng nhập lần đầu', async () => {
  const soThu = hopThuGia.length;
  const res = await dangNhap('hv01', '123456');
  assert.equal(res.status, 200);
  assert.equal(res.body.id, hv01.id);
  assert.equal(res.body.vai_tro, 2);
  const phien = dongCookie(res, 'ava_phien');
  assert.ok(phien.includes('HttpOnly') && phien.includes('SameSite=Lax'));
  phienCuHv01 = cookie(res, 'ava_phien');
  assert.equal(await diaChiIp(hv01.id_hoc_vien), '127.0.0.1');
  assert.equal(hopThuGia.length, soThu);
});

test('P03-02 Tên đăng nhập không phân biệt hoa thường', async () => {
  const res = await dangNhap('HV01', '123456');
  assert.equal(res.status, 200);
  assert.ok(cookie(res, 'ava_phien'));
});

test('P03-03 Để trống và mật khẩu sai định dạng', async () => {
  await taoNguoiDung(VAI_TRO.NGUOI_CUNG_CAP, { tenDangNhap: 'hv03', matKhau: '123456' });
  const boDuLieu = [
    [{ ten_dang_nhap: '', mat_khau: '123456' }, 'ten_dang_nhap', 'Vui lòng nhập tên đăng nhập'],
    [{ ten_dang_nhap: 'hv03', mat_khau: '' }, 'mat_khau', 'Vui lòng nhập mật khẩu'],
    [{ ten_dang_nhap: 'hv03', mat_khau: '12345' }, 'mat_khau', 'Mật khẩu phải gồm đúng 6 chữ số'],
  ];
  // Gửi đủ 6 lần lỗi bước 1: nếu bị tính là lần sai thì lần đúng sau đó đã bị chặn
  for (let i = 0; i < 2; i += 1) {
    for (const [duLieu, o, cau] of boDuLieu) {
      const res = await request(app).post('/api/tai-khoan/dang-nhap').set('Origin', ORIGIN_HOP_LE).send(duLieu);
      assert.equal(res.status, 400);
      assert.equal(res.body.cac_o[o], cau);
    }
  }
  assert.equal((await dangNhap('hv03', '123456')).status, 200);
});

test('P03-04 Sai tên hoặc sai mật khẩu cùng một câu', async () => {
  for (const [ten, matKhau] of [['khongcoai', '123456'], ['hv01', '000000']]) {
    const res = await dangNhap(ten, matKhau, '10.0.4.1');
    assert.equal(res.status, 400);
    assert.equal(res.body.loi, SAI);
  }
});

test('P03-05 Sai 5 lần liên tiếp thì chặn tên 5 phút', async () => {
  await taoNguoiDung(VAI_TRO.HOC_VIEN, { tenDangNhap: 'hv05', matKhau: '123456', diaChiIp: '10.0.5.1' });
  for (let i = 0; i < 5; i += 1) assert.equal((await dangNhap('hv05', '000000', '10.0.5.1')).status, 400);
  const res = await dangNhap('hv05', '123456', '10.0.5.1');
  assert.equal(res.status, 429);
  assert.equal(res.body.loi, 'Bạn đã nhập sai nhiều lần, vui lòng thử lại sau 5 phút');
  assert.equal(cookie(res, 'ava_phien'), undefined);
});

test('P03-06 Chặn theo tên không phân biệt hoa thường', async () => {
  await taoNguoiDung(VAI_TRO.HOC_VIEN, { tenDangNhap: 'hv06', matKhau: '123456', diaChiIp: '10.0.6.1' });
  for (let i = 0; i < 3; i += 1) await dangNhap('HV06', '000000', '10.0.6.1');
  for (let i = 0; i < 2; i += 1) await dangNhap('hv06', '000000', '10.0.6.1');
  assert.equal((await dangNhap('hv06', '123456', '10.0.6.1')).status, 429);
});

test('P03-07 Đăng nhập đúng đặt lại số lần sai về 0', async () => {
  await taoNguoiDung(VAI_TRO.HOC_VIEN, { tenDangNhap: 'hv07', matKhau: '123456', diaChiIp: '10.0.7.1' });
  for (let i = 0; i < 4; i += 1) await dangNhap('hv07', '000000', '10.0.7.1');
  assert.equal((await dangNhap('hv07', '123456', '10.0.7.1')).status, 200);
  for (let i = 0; i < 4; i += 1) await dangNhap('hv07', '000000', '10.0.7.1');
  assert.equal((await dangNhap('hv07', '123456', '10.0.7.1')).status, 200);
});

test('P03-08 Chặn theo địa chỉ IP', async () => {
  await taoNguoiDung(VAI_TRO.NGUOI_CUNG_CAP, { tenDangNhap: 'hv08', matKhau: '123456' });
  for (let i = 0; i < 20; i += 1) {
    assert.equal((await dangNhap(`khongco${i}`, '000000', '10.9.9.9')).status, 400);
  }
  const biChan = await dangNhap('hv08', '123456', '10.9.9.9');
  assert.equal(biChan.status, 429);
  assert.equal(biChan.body.loi, 'Bạn đã nhập sai nhiều lần, vui lòng thử lại sau 15 phút');
  assert.equal((await dangNhap('hv08', '123456', '10.9.9.8')).status, 200);
});

test('P03-09 Tài khoản bị khóa, mật khẩu đúng', async () => {
  const hv = await taoNguoiDung(VAI_TRO.HOC_VIEN, { tenDangNhap: 'hv09', matKhau: '123456' });
  const admin = await cookieAdmin();
  await pool.query(
    "UPDATE nguoi_dung SET khoa = 1, ly_do_khoa = 'Chia sẻ tài khoản', id_quan_tri_vien = ? WHERE id = ?",
    [admin.id_quan_tri_vien, hv.id],
  );
  const sai = await dangNhap('hv09', '000000', '10.0.9.1');
  assert.equal(sai.status, 400);
  assert.equal(sai.body.loi, SAI);

  const dung = await dangNhap('hv09', '123456', '10.0.9.1');
  assert.equal(dung.status, 401);
  assert.equal(dung.body.ma, 'TAI_KHOAN_BI_KHOA');
  assert.equal(
    dung.body.loi,
    'Tài khoản đã bị khóa. Lý do: Chia sẻ tài khoản. Liên hệ hỗ trợ nếu bạn cho rằng có nhầm lẫn.',
  );
  assert.equal(cookie(dung, 'ava_phien'), undefined);
});

test('P03-10 Học viên đăng nhập từ địa chỉ mới phải xác nhận', async () => {
  const soThu = hopThuGia.length;
  const res = await dangNhap('hv01', '123456', '192.168.1.20');
  assert.equal(res.status, 200);
  assert.deepEqual(res.body, { can_xac_nhan: true, gmail_che: 'h***@gmail.com', giay_cho_gui_lai: 60 });
  assert.equal(cookie(res, 'ava_phien'), undefined);
  const cho = dongCookie(res, 'ava_cho_xac_nhan');
  assert.ok(cho.startsWith('ava_cho_xac_nhan=s%3A') && cho.includes('HttpOnly'), 'cookie có chữ ký, httpOnly');
  choHv01 = cookie(res, 'ava_cho_xac_nhan');

  const [dong] = (await pool.query('SELECT * FROM xac_minh_ip WHERE id_hoc_vien = ?', [hv01.id_hoc_vien]))[0];
  assert.equal(dong.dia_chi_ip_moi, '192.168.1.20');
  assert.equal(dong.so_lan_nhap_ma_sai, 0);

  assert.equal(hopThuGia.length, soThu + 1);
  const thu = hopThuGia.at(-1);
  assert.equal(thu.den, 'hv01@gmail.com');
  assert.equal(thu.tieuDe, 'Mã xác nhận đăng nhập AVA');
  const ma = maTrongThuCuoi();
  assert.equal(
    thu.noiDung,
    `Có người vừa đăng nhập tài khoản AVA của bạn từ một địa chỉ mạng mới. Mã xác nhận của bạn là: ${ma}. Mã có hiệu lực trong 10 phút. Nếu không phải bạn, hãy đổi mật khẩu ngay.`,
  );
  assert.notEqual(dong.ma_xac_minh_da_bam, ma);
});

test('P03-11 Nhập đúng mã', async () => {
  const res = await xacNhan(choHv01, maTrongThuCuoi());
  assert.equal(res.status, 200);
  assert.equal(res.body.id, hv01.id);
  assert.ok(cookie(res, 'ava_phien'));
  assert.equal(await diaChiIp(hv01.id_hoc_vien), '192.168.1.20');
  assert.equal(await dongXacMinh(hv01.id_hoc_vien), undefined);
  assert.ok(daXoaCookie(res, 'ava_cho_xac_nhan'));
});

test('P03-12 Phiên ở nơi cũ bị đẩy ra', async () => {
  const res = await request(app).get('/api/tai-khoan/toi').set('Cookie', phienCuHv01);
  assert.equal(res.status, 401);
  assert.equal(res.body.ma, 'DANG_NHAP_NOI_KHAC');
});

test('P03-13 Mã sai, sai đủ 5 lần', async () => {
  const { hv, cho, ma } = await taoLuotCho('hv13', '192.168.1.21');
  for (let lan = 1; lan <= 4; lan += 1) {
    const res = await xacNhan(cho, maKhac(ma));
    assert.equal(res.status, 400);
    assert.equal(res.body.cac_o.ma, 'Mã xác nhận không đúng.');
    assert.equal((await dongXacMinh(hv.id_hoc_vien)).so_lan_nhap_ma_sai, lan);
  }
  assert.equal((await xacNhan(cho, maKhac(ma))).body.cac_o.ma, SAI_QUA_NHIEU);
  const maDung = await xacNhan(cho, ma);
  assert.equal(maDung.body.cac_o.ma, SAI_QUA_NHIEU);
  assert.equal(cookie(maDung, 'ava_phien'), undefined);
  // Sai mã không tính vào bộ đếm sai mật khẩu: đăng nhập từ địa chỉ cũ vẫn được
  assert.equal((await dangNhap('hv13', '123456')).status, 200);
});

test('P03-14 Mã hết hạn sau 10 phút', async () => {
  const { hv, cho, ma } = await taoLuotCho('hv14', '192.168.1.22');
  await lui(hv.id_hoc_vien, 11 * 60);
  const res = await xacNhan(cho, ma);
  assert.equal(res.status, 400);
  assert.equal(res.body.cac_o.ma, 'Mã đã hết hạn, vui lòng bấm Gửi lại mã.');
  assert.equal(cookie(res, 'ava_phien'), undefined);
});

test('P03-15 Không có cookie tạm', async () => {
  const khongCo = await xacNhan(null, '123456');
  assert.equal(khongCo.status, 400);
  assert.equal(khongCo.body.ma, 'KHONG_CO_LUOT_CHO_XAC_NHAN');

  const { cho } = await taoLuotCho('hv15', '192.168.1.23');
  const suaChuKy = `${cho.slice(0, -2)}xx`;
  const biSua = await xacNhan(suaChuKy, '123456');
  assert.equal(biSua.status, 400);
  assert.equal(biSua.body.ma, 'KHONG_CO_LUOT_CHO_XAC_NHAN');
});

test('P03-16 Gửi lại mã trước 60 giây', async () => {
  const { cho } = await taoLuotCho('hv16', '192.168.1.24');
  const soThu = hopThuGia.length;
  const res = await guiLai(cho);
  assert.equal(res.status, 429);
  assert.ok(res.body.giay_cho_gui_lai > 0 && res.body.giay_cho_gui_lai <= 60);
  assert.equal(hopThuGia.length, soThu);
});

test('P03-17 Gửi lại mã hợp lệ', async () => {
  const { hv, cho, ma: maCu } = await taoLuotCho('hv17', '192.168.1.25');
  await xacNhan(cho, maKhac(maCu)); // một lần sai để thấy số lần sai về 0 sau khi gửi lại
  await lui(hv.id_hoc_vien, 61);
  const soThu = hopThuGia.length;

  const res = await guiLai(cho);
  assert.equal(res.status, 200);
  assert.deepEqual(res.body, { gmail_che: 'h***@gmail.com', giay_cho_gui_lai: 60 });
  assert.equal(hopThuGia.length, soThu + 1);
  assert.equal((await dongXacMinh(hv.id_hoc_vien)).so_lan_nhap_ma_sai, 0);
  const maMoi = maTrongThuCuoi();

  if (maMoi !== maCu) {
    assert.equal((await xacNhan(cho, maCu)).body.cac_o.ma, 'Mã xác nhận không đúng.');
  }
  const dung = await xacNhan(cho, maMoi);
  assert.equal(dung.status, 200);
  assert.ok(cookie(dung, 'ava_phien'));
});

test('P03-18 Gửi mã tối đa 5 lần trong 1 giờ', async () => {
  const { hv, cho } = await taoLuotCho('hv18', '192.168.1.26'); // lần gửi 1
  for (let lan = 2; lan <= 5; lan += 1) {
    await lui(hv.id_hoc_vien, 61);
    assert.equal((await guiLai(cho)).status, 200, `lần gửi ${lan}`);
  }
  await lui(hv.id_hoc_vien, 61);
  const soThu = hopThuGia.length;
  const lan6 = await guiLai(cho);
  assert.equal(lan6.status, 429);
  assert.equal(lan6.body.loi, GUI_QUA_NHIEU);

  const dangNhapLai = await dangNhap('hv18', '123456', '192.168.1.27');
  assert.equal(dangNhapLai.status, 429);
  assert.equal(dangNhapLai.body.loi, GUI_QUA_NHIEU);
  assert.equal(hopThuGia.length, soThu);
});

test('P03-19 Người cung cấp và admin không bị hỏi mã', async () => {
  await taoNguoiDung(VAI_TRO.NGUOI_CUNG_CAP, { tenDangNhap: 'ncc01', matKhau: '123456' });
  const soThu = hopThuGia.length;
  for (const [ten, matKhau] of [['ncc01', '123456'], [ADMIN_KIEM_THU.tenDangNhap, ADMIN_KIEM_THU.matKhau]]) {
    for (const ip of ['127.0.0.1', '192.168.1.30']) {
      const res = await dangNhap(ten, matKhau, ip);
      assert.equal(res.status, 200, `${ten} ${ip}`);
      assert.ok(cookie(res, 'ava_phien'));
    }
  }
  assert.equal(hopThuGia.length, soThu);
});

test('P03-20 Đăng xuất', async () => {
  const hv = await taoNguoiDung(VAI_TRO.HOC_VIEN);
  const ncc = await taoNguoiDung(VAI_TRO.NGUOI_CUNG_CAP);
  const khoa = await taoKhoaHoc(ncc.id_nguoi_cung_cap, await taoDanhMuc('Đăng Xuất Thử'));
  await pool.query('INSERT INTO gio_hang (id_hoc_vien, id_khoa_hoc) VALUES (?, ?)', [hv.id_hoc_vien, khoa]);

  const res = await goiVoiCookie('/api/tai-khoan/dang-xuat', hv.cookie);
  assert.equal(res.status, 200);
  assert.ok(daXoaCookie(res, 'ava_phien'));
  assert.deepEqual((await request(app).get('/api/tai-khoan/toi')).body, { dang_nhap: false });
  const [gio] = await pool.query('SELECT 1 FROM gio_hang WHERE id_hoc_vien = ?', [hv.id_hoc_vien]);
  assert.equal(gio.length, 1);
});

test('P03-21 Phiên hết hạn sau 7 ngày', async () => {
  const res = await dangNhap('ncc01', '123456');
  const { iat, exp } = jwt.decode(cookie(res, 'ava_phien').split('=')[1]);
  assert.equal(exp - iat, 7 * 24 * 60 * 60);
  assert.ok(dongCookie(res, 'ava_phien').includes(`Max-Age=${7 * 24 * 60 * 60}`));
});
