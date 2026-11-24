// Kiểm thử Phần 6 theo docs/kiem_thu/phan_06_quan_tri_danh_muc.md (các trường hợp tự động).
// Database ava_test dùng chung cho mọi file kiểm thử và Phần 1 đã tạo "Thiết Kế", nên P06-04 dùng
// "Thiết kế Đồ Họa" và P06-08 dùng "Món Ngon", "Món Ngon Gia Đình" thay cho dữ liệu ví dụ 6.5 lần hai.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../app.js';
import pool from '../database/db.js';
import { VAI_TRO } from '../constants/vaiTro.js';
import { TRANG_THAI_KHOA_HOC, BI_AN_BOI, HANH_DONG_LICH_SU } from '../constants/trangThai.js';
import { ORIGIN_HOP_LE } from './duLieuKiemThu.js';
import { taoNguoiDung, cookieAdmin, taoDanhMuc, taoKhoaHoc } from './troGiup.js';

const TEN_SAI =
  'Tên danh mục từ 2 đến 50 ký tự, gồm chữ có dấu hoặc không dấu, chữ số, khoảng trắng và các ký tự + # . / -';
const TEN_TRUNG = 'Tên danh mục đã tồn tại';
const GOP = HANH_DONG_LICH_SU.QUAN_TRI_VIEN_GOP_DANH_MUC;
const { DANG_BAN, BI_AN, BI_GO_VINH_VIEN } = TRANG_THAI_KHOA_HOC;

let admin, ncc, hv;

before(async () => {
  admin = await cookieAdmin();
  ncc = await taoNguoiDung(VAI_TRO.NGUOI_CUNG_CAP, { tenDangNhap: 'dmncc01', hoTen: 'Phạm Minh' });
  await pool.query("UPDATE nguoi_dung SET so_dien_thoai = '0933333333' WHERE id = ?", [ncc.id]);
  hv = await taoNguoiDung(VAI_TRO.HOC_VIEN, { tenDangNhap: 'dmhv01' });
});

after(async () => {
  await pool.end();
});

const goi = (phuongThuc, duongDan, cookie = admin.cookie) =>
  request(app)[phuongThuc](duongDan).set('Cookie', cookie).set('Origin', ORIGIN_HOP_LE);
const them = (ten) => goi('post', '/api/quan-tri/danh-muc').send({ ten });

const docDanhMuc = async (id) => (await pool.query('SELECT id, ten FROM danh_muc WHERE id = ?', [id]))[0][0];
const timTen = async (ten) => (await pool.query('SELECT id, ten FROM danh_muc WHERE ten = ?', [ten]))[0];
const danhMucCuaKhoa = async (id) =>
  (await pool.query('SELECT id_danh_muc FROM khoa_hoc WHERE id = ?', [id]))[0][0].id_danh_muc;
const lichSuGop = async (idKhoa) =>
  (
    await pool.query(
      'SELECT id_nguoi_dung, noi_dung_thay_doi, gia_tri_cu, gia_tri_moi FROM lich_su_khoa_hoc WHERE id_khoa_hoc = ? AND hanh_dong = ?',
      [idKhoa, GOP],
    )
  )[0];

// Dữ liệu ví dụ 6.5: danh mục giữ lại có khóa đã xóa và khóa bị gỡ; danh mục kia có hai khóa đang bán
async function taoViDuGop(idGiuLai, idKia) {
  const khoa = (idDanhMuc, tuyChon) => taoKhoaHoc(ncc.id_nguoi_cung_cap, idDanhMuc, tuyChon);
  return {
    banhMi: await khoa(idGiuLai, { daXoa: 1 }),
    monChay: await khoa(idGiuLai, { trangThai: BI_GO_VINH_VIEN, lyDoAn: 'Vi phạm bản quyền' }),
    comNha: await khoa(idKia),
    lau: await khoa(idKia),
  };
}

test('P06-01 Thêm danh mục và chuẩn hóa tên', async () => {
  const res = await them('  luyện   thi IELTS ');
  assert.equal(res.status, 201);
  assert.equal(res.body.ten, 'Luyện Thi IELTS');
  assert.equal((await docDanhMuc(res.body.id)).ten, 'Luyện Thi IELTS');
});

test('P06-02 Trùng không phân biệt hoa thường và dấu', async () => {
  assert.equal((await them('Nấu Ăn')).status, 201);
  const [[{ truoc }]] = await pool.query('SELECT COUNT(*) AS truoc FROM danh_muc');
  for (const ten of ['LUYEN THI ielts', 'nau an']) {
    const res = await them(ten);
    assert.equal(res.status, 409, ten);
    assert.equal(res.body.loi, TEN_TRUNG);
    assert.equal(res.body.cac_o.ten, TEN_TRUNG);
  }
  const [[{ sau }]] = await pool.query('SELECT COUNT(*) AS sau FROM danh_muc');
  assert.equal(sau, truoc);
});

test('P06-03 Tên sai luật', async () => {
  const cacTenSai = ['A', 'a'.repeat(51), 'Lập trình @Web', 'Thiết kế_UI', '中文 Cơ Bản', 'Tiếng Ж', 'Mañana'];
  for (const ten of cacTenSai) {
    const res = await them(ten);
    assert.equal(res.status, 400, ten);
    assert.equal(res.body.cac_o.ten, TEN_SAI, ten);
  }
  assert.equal((await timTen('Mañana')).length, 0);
  for (const ten of ['C++', 'UI/UX', '3D', 'C#', 'Đồ Họa']) {
    const res = await them(ten);
    assert.equal(res.status, 201, ten);
    assert.equal(res.body.ten, ten);
  }
});

test('P06-04 Sửa tên, kể cả đổi hoa thường của chính nó', async () => {
  const id = await taoDanhMuc('Thiết kế Đồ Họa');
  const khoa = await taoKhoaHoc(ncc.id_nguoi_cung_cap, id);
  const res = await goi('put', `/api/quan-tri/danh-muc/${id}`).send({ ten: 'thiết kế đồ họa' });
  assert.equal(res.status, 200);
  assert.equal((await docDanhMuc(id)).ten, 'Thiết Kế Đồ Họa');
  const [[{ so }]] = await pool.query('SELECT COUNT(*) AS so FROM lich_su_khoa_hoc WHERE id_khoa_hoc = ?', [khoa]);
  assert.equal(so, 0);

  const trung = await goi('put', `/api/quan-tri/danh-muc/${id}`).send({ ten: 'luyen thi ielts' });
  assert.equal(trung.status, 409);
  assert.equal(trung.body.cac_o.ten, TEN_TRUNG);
  assert.equal((await docDanhMuc(id)).ten, 'Thiết Kế Đồ Họa');
});

let idX;

test('P06-05 Số khóa đếm cả bốn loại', async () => {
  idX = await taoDanhMuc('Đếm Khóa X');
  const khoa = (tuyChon) => taoKhoaHoc(ncc.id_nguoi_cung_cap, idX, tuyChon);
  await khoa({ trangThai: DANG_BAN });
  await khoa({ trangThai: BI_AN, biAnBoi: BI_AN_BOI.TU_AN });
  await khoa({ trangThai: BI_GO_VINH_VIEN, lyDoAn: 'Vi phạm' });
  await khoa({ daXoa: 1 });

  // Đủ hơn 20 danh mục để có trang thứ hai
  let [[{ tong }]] = await pool.query('SELECT COUNT(*) AS tong FROM danh_muc');
  for (let i = tong + 1; i <= 25; i += 1) await taoDanhMuc(`Phân Trang ${i}`);
  [[{ tong }]] = await pool.query('SELECT COUNT(*) AS tong FROM danh_muc');

  const trang1 = await goi('get', '/api/quan-tri/danh-muc');
  assert.equal(trang1.status, 200);
  assert.equal(trang1.body.tong, tong);
  assert.equal(trang1.body.trang, 1);
  assert.equal(trang1.body.danh_sach.length, 20);
  const trang2 = await goi('get', '/api/quan-tri/danh-muc?trang=2');
  assert.equal(trang2.body.danh_sach.length, tong - 20);

  // Sắp theo tên theo cách so của MySQL
  const [theoTen] = await pool.query('SELECT id FROM danh_muc ORDER BY ten, id');
  const cacId = [...trang1.body.danh_sach, ...trang2.body.danh_sach].map((d) => d.id);
  assert.deepEqual(cacId, theoTen.map((d) => d.id));

  const dongX = [...trang1.body.danh_sach, ...trang2.body.danh_sach].find((d) => d.id === idX);
  assert.equal(dongX.so_khoa, 4);

  assert.equal((await goi('get', '/api/quan-tri/danh-muc?trang=0')).status, 400);
});

test('P06-06 Xóa danh mục', async () => {
  const conKhoa = await goi('delete', `/api/quan-tri/danh-muc/${idX}`);
  assert.equal(conKhoa.status, 409);
  assert.equal(conKhoa.body.loi, 'Danh mục đang có 4 khóa học');
  assert.equal(conKhoa.body.so_khoa, 4);
  assert.ok(await docDanhMuc(idX));

  const idY = await taoDanhMuc('Xóa Được Y');
  assert.equal((await goi('delete', `/api/quan-tri/danh-muc/${idY}`)).status, 200);
  assert.equal(await docDanhMuc(idY), undefined);

  const lanHai = await goi('delete', `/api/quan-tri/danh-muc/${idY}`);
  assert.equal(lanHai.status, 404);
  assert.equal(lanHai.body.loi, 'Danh mục không còn tồn tại.');
});

test('P06-07 Gộp vào tên của một danh mục đang tích', async () => {
  const [nauAn] = await timTen('Nấu Ăn'); // tạo ở P06-02
  const idGiaDinh = await taoDanhMuc('Nấu Ăn Gia Đình');
  const k = await taoViDuGop(nauAn.id, idGiaDinh);

  const res = await goi('post', '/api/quan-tri/danh-muc/gop').send({ ids: [nauAn.id, idGiaDinh], ten_moi: 'nấu ăn' });
  assert.equal(res.status, 200);
  assert.deepEqual(res.body, { id: nauAn.id, ten: 'Nấu Ăn' });
  assert.equal((await docDanhMuc(nauAn.id)).ten, 'Nấu Ăn');
  assert.equal(await docDanhMuc(idGiaDinh), undefined);
  for (const idKhoa of Object.values(k)) assert.equal(await danhMucCuaKhoa(idKhoa), nauAn.id);

  for (const idKhoa of [k.comNha, k.lau]) {
    assert.deepEqual(await lichSuGop(idKhoa), [
      { id_nguoi_dung: admin.id, noi_dung_thay_doi: null, gia_tri_cu: 'Nấu Ăn Gia Đình', gia_tri_moi: 'Nấu Ăn' },
    ]);
  }
  // Khóa vốn đã thuộc "Nấu Ăn" không có dòng lịch sử nào
  for (const idKhoa of [k.banhMi, k.monChay]) {
    const [cacDong] = await pool.query('SELECT id FROM lich_su_khoa_hoc WHERE id_khoa_hoc = ?', [idKhoa]);
    assert.equal(cacDong.length, 0);
  }
});

test('P06-08 Gộp thành tên mới hoàn toàn', async () => {
  const idMonNgon = await taoDanhMuc('Món Ngon');
  const idGiaDinh = await taoDanhMuc('Món Ngon Gia Đình');
  const k = await taoViDuGop(idMonNgon, idGiaDinh);

  const res = await goi('post', '/api/quan-tri/danh-muc/gop').send({ ids: [idMonNgon, idGiaDinh], ten_moi: 'Ẩm Thực' });
  assert.equal(res.status, 200);
  assert.equal(res.body.ten, 'Ẩm Thực');
  const idMoi = res.body.id;
  assert.equal((await docDanhMuc(idMoi)).ten, 'Ẩm Thực');
  assert.equal(await docDanhMuc(idMonNgon), undefined);
  assert.equal(await docDanhMuc(idGiaDinh), undefined);

  const tenCu = { banhMi: 'Món Ngon', monChay: 'Món Ngon', comNha: 'Món Ngon Gia Đình', lau: 'Món Ngon Gia Đình' };
  for (const [ten, idKhoa] of Object.entries(k)) {
    assert.equal(await danhMucCuaKhoa(idKhoa), idMoi);
    assert.deepEqual(await lichSuGop(idKhoa), [
      { id_nguoi_dung: admin.id, noi_dung_thay_doi: null, gia_tri_cu: tenCu[ten], gia_tri_moi: 'Ẩm Thực' },
    ]);
  }
});

test('P06-09 Gộp bị từ chối', async () => {
  const a = await taoDanhMuc('Gộp Thử A');
  const b = await taoDanhMuc('Gộp Thử B');
  await taoDanhMuc('Gộp Thử C');
  const khoaA = await taoKhoaHoc(ncc.id_nguoi_cung_cap, a);
  const [[{ truoc }]] = await pool.query('SELECT COUNT(*) AS truoc FROM danh_muc');
  const gop = (duLieu) => goi('post', '/api/quan-tri/danh-muc/gop').send(duLieu);

  const trungC = await gop({ ids: [a, b], ten_moi: 'gop thu c' });
  assert.equal(trungC.status, 409);
  assert.equal(trungC.body.cac_o.ten_moi, TEN_TRUNG);

  assert.equal((await gop({ ids: [a], ten_moi: 'Gộp Mới' })).status, 400);
  assert.equal((await gop({ ids: [a, a], ten_moi: 'Gộp Mới' })).status, 400);
  const tenSai = await gop({ ids: [a, b], ten_moi: 'A' });
  assert.equal(tenSai.status, 400);
  assert.equal(tenSai.body.cac_o.ten_moi, TEN_SAI);
  const khongCon = await gop({ ids: [a, 999999], ten_moi: 'Gộp Mới' });
  assert.equal(khongCon.status, 404);
  assert.equal(khongCon.body.loi, 'Danh mục không còn tồn tại.');

  // Không danh mục nào thay đổi, không làm dở
  const [[{ sau }]] = await pool.query('SELECT COUNT(*) AS sau FROM danh_muc');
  assert.equal(sau, truoc);
  assert.equal((await docDanhMuc(a)).ten, 'Gộp Thử A');
  assert.equal((await docDanhMuc(b)).ten, 'Gộp Thử B');
  assert.equal(await danhMucCuaKhoa(khoaA), a);
  assert.equal((await timTen('Gộp Mới')).length, 0);
});

test('P06-10 Chỉ admin dùng được', async () => {
  const cacDuong = [
    ['get', '/api/quan-tri/danh-muc'],
    ['post', '/api/quan-tri/danh-muc', { ten: 'Không Được' }],
    ['put', `/api/quan-tri/danh-muc/${idX}`, { ten: 'Không Được' }],
    ['delete', `/api/quan-tri/danh-muc/${idX}`],
    ['post', '/api/quan-tri/danh-muc/gop', { ids: [idX, idX + 1], ten_moi: 'Không Được' }],
  ];
  for (const [phuongThuc, duongDan, duLieu] of cacDuong) {
    for (const [cookie, maTrangThai] of [[hv.cookie, 403], [ncc.cookie, 403], ['', 401]]) {
      const res = await goi(phuongThuc, duongDan, cookie).send(duLieu);
      assert.equal(res.status, maTrangThai, `${phuongThuc} ${duongDan}`);
    }
  }
  assert.equal((await timTen('Không Được')).length, 0);
  assert.ok(await docDanhMuc(idX));
});

test('P06-11 Danh sách danh mục cho người đã đăng nhập', async () => {
  await taoDanhMuc('Zz Không Khóa');
  const res = await goi('get', '/api/danh-muc', ncc.cookie);
  assert.equal(res.status, 200);
  const [theoTen] = await pool.query('SELECT id, ten FROM danh_muc ORDER BY ten, id');
  assert.deepEqual(res.body, theoTen);
  assert.ok(res.body.some((d) => d.ten === 'Zz Không Khóa'));
  assert.deepEqual(Object.keys(res.body[0]).sort(), ['id', 'ten']);

  assert.equal((await goi('get', '/api/danh-muc', '')).status, 401);
});
