// Kiểm thử Phần 7 theo docs/kiem_thu/phan_07_tao_khoa_hoc.md (các trường hợp tự động).
// Database ava_test dùng chung cho mọi file kiểm thử, nên tên tài khoản ở đây là "tkncc01", "tkncc02"...
// thay cho "ncc01", "ncc02" của danh sách. "tkncc03" là người cung cấp thứ hai đã điền đủ hồ sơ (P07-10, 17, 18),
// "tkncc04" chỉ dùng cho hạn mức 5GB (P07-08).
// File mẫu tạo ngay trong bộ nhớ (Buffer), không có file mẫu nào nằm trong dự án; file gửi lên nằm ở thư mục
// lưu file của kiểm thử (THU_MUC_LUU_TRU, ngoài dự án, npm test xóa khi chạy xong).
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createHash, randomBytes, randomUUID } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import request from 'supertest';
import app from '../app.js';
import pool from '../database/db.js';
import config from '../config.js';
import { VAI_TRO } from '../constants/vaiTro.js';
import { TRANG_THAI_KHOA_HOC, LOAI_BAI_HOC, HANH_DONG_LICH_SU } from '../constants/trangThai.js';
import { donFileTamQuaHan, thuMucTam } from '../services/fileTamService.js';
import { ORIGIN_HOP_LE } from './duLieuKiemThu.js';
import { taoNguoiDung, cookieAdmin, taoDanhMuc, taoKhoaHoc } from './troGiup.js';

const VIDEO_SAI = 'File phải là video .mp4 và không quá 300MB';
const PDF_SAI = 'File phải là .pdf và không quá 20MB';
const ANH_SAI = 'Ảnh phải là jpg hoặc png, tối đa 2MB';
const THOI_LUONG_SAI = 'Video phải dài từ 1 giây đến 6 giờ.';
const FILE_DA_CO = 'File này đã có trên AVA';
const HET_DUNG_LUONG = 'Bạn đã dùng hết 5GB dung lượng.';
const QUA_DAI = 'Nội dung quá dài.';
const { VIDEO, TAI_LIEU, TRAC_NGHIEM } = LOAI_BAI_HOC;
const ANH_BIA = 'Ảnh bìa';

let ncc01, ncc02, ncc03, ncc04, hv, admin, idLapTrinh;

before(async () => {
  const taoNcc = async (ten, soDienThoai) => {
    const nd = await taoNguoiDung(VAI_TRO.NGUOI_CUNG_CAP, { tenDangNhap: ten, hoTen: 'Ngô Văn Bảy' });
    if (soDienThoai) await pool.query('UPDATE nguoi_dung SET so_dien_thoai = ? WHERE id = ?', [soDienThoai, nd.id]);
    return nd;
  };
  ncc01 = await taoNcc('tkncc01', '0901000001');
  ncc02 = await taoNcc('tkncc02', null); // chưa có số điện thoại
  ncc03 = await taoNcc('tkncc03', '0901000003');
  ncc04 = await taoNcc('tkncc04', '0901000004');
  hv = await taoNguoiDung(VAI_TRO.HOC_VIEN, { tenDangNhap: 'tkhv01' });
  admin = await cookieAdmin();
  // Phần 1 đã tạo "Lập Trình" trong ava_test; chạy riêng file này thì tạo mới
  const [[coSan]] = await pool.query("SELECT id FROM danh_muc WHERE ten = 'Lập Trình'");
  idLapTrinh = coSan?.id ?? (await taoDanhMuc('Lập Trình'));
});

after(async () => {
  await pool.end();
});

// File mẫu: mấy byte đầu đúng kiểu, thêm byte ngẫu nhiên để mỗi file có mã băm khác nhau
const ngauNhien = () => randomBytes(16);
const fileVideo = () => Buffer.concat([Buffer.from([0, 0, 0, 0x18]), Buffer.from('ftypmp42'), ngauNhien()]);
const filePdf = () => Buffer.concat([Buffer.from('%PDF-1.4\n'), ngauNhien()]);
const fileJpg = () => Buffer.concat([Buffer.from([0xff, 0xd8, 0xff, 0xe0]), ngauNhien()]);
const filePng = () => Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), ngauNhien()]);
const fileZip = () => Buffer.concat([Buffer.from([0x50, 0x4b, 0x03, 0x04]), ngauNhien()]); // .zip và .docx
const bam = (buf) => createHash('sha256').update(buf).digest('hex');

// Gửi một file tạm. Ô "loai" gửi trước ô "file" như trang làm.
function taiFile(nd, buf, ten, loai, { thoiLuong, soBai, dangDung } = {}) {
  const yc = request(app)
    .post('/api/nguoi-cung-cap/file-tam')
    .set('Cookie', nd.cookie)
    .set('Origin', ORIGIN_HOP_LE)
    .field('loai', loai);
  if (thoiLuong !== undefined) yc.field('thoi_luong', String(thoiLuong));
  if (soBai !== undefined) yc.field('so_bai_hien_co', String(soBai));
  if (dangDung) yc.field('ma_file_tam_dang_dung', JSON.stringify(dangDung));
  return yc.attach('file', buf, ten);
}
const taiVideo = (nd, buf = fileVideo(), tuyChon = {}) => taiFile(nd, buf, 'video.mp4', VIDEO, { thoiLuong: 125, ...tuyChon });
const taiPdf = (nd, buf = filePdf(), tuyChon = {}) => taiFile(nd, buf, 'tai-lieu.pdf', TAI_LIEU, tuyChon);

const dang = (nd, duLieu) =>
  request(app).post('/api/nguoi-cung-cap/khoa-hoc').set('Cookie', nd.cookie).set('Origin', ORIGIN_HOP_LE).send(duLieu);

const nCau = (n) =>
  Array.from({ length: n }, (_, i) => ({
    noi_dung: `Câu hỏi số ${i + 1}?`,
    lua_chon_a: 'Đáp án A',
    lua_chon_b: 'Đáp án B',
    lua_chon_c: 'Đáp án C',
    lua_chon_d: 'Đáp án D',
    dap_an_dung: 'B',
  }));

// "Khóa mẫu" của danh sách kiểm thử: bài 1 video, bài 2 tài liệu, bài 3 trắc nghiệm 5 câu, 15 phút
async function khoaMau(nd, { anhBia = false, video = fileVideo(), pdf = filePdf() } = {}) {
  const v = await taiVideo(nd, video);
  const t = await taiPdf(nd, pdf);
  assert.equal(v.status, 201, JSON.stringify(v.body));
  assert.equal(t.status, 201, JSON.stringify(t.body));
  let maAnh = null;
  if (anhBia) {
    const a = await taiFile(nd, fileJpg(), 'bia.jpg', ANH_BIA);
    assert.equal(a.status, 201);
    maAnh = a.body.ma_file_tam;
  }
  return {
    thong_tin: {
      ten_khoa_hoc: 'Vẽ minh họa với Procreate',
      mo_ta: 'Khóa học vẽ minh họa từ cơ bản.',
      id_danh_muc: idLapTrinh,
      gia_ban: 349000,
      hoc_duoc_gi: 'Vẽ phác thảo\nTô màu',
      yeu_cau: '',
      danh_cho_ai: 'Người mới bắt đầu',
      ma_file_tam_anh_bia: maAnh,
    },
    bai_hoc: [
      { ten_bai_hoc: 'Giới thiệu khóa học', so_thu_tu: 1, loai: VIDEO, ma_file_tam: v.body.ma_file_tam },
      { ten_bai_hoc: 'Bảng phím tắt', so_thu_tu: 2, loai: TAI_LIEU, ma_file_tam: t.body.ma_file_tam },
      { ten_bai_hoc: 'Kiểm tra cuối khóa', so_thu_tu: 3, loai: TRAC_NGHIEM, thoi_gian_lam_bai: 15, cau_hoi: nCau(5) },
    ],
    cam_ket: true,
  };
}

// Số dòng các bảng mà việc đăng khóa ghi vào: dùng để kiểm "không ghi gì"
const demBang = async () =>
  (
    await pool.query(
      `SELECT (SELECT COUNT(*) FROM khoa_hoc) AS khoa, (SELECT COUNT(*) FROM bai_hoc) AS bai,
              (SELECT COUNT(*) FROM cau_hoi_bai_tap) AS cau, (SELECT COUNT(*) FROM lich_su_khoa_hoc) AS lich_su,
              (SELECT COUNT(*) FROM danh_muc) AS danh_muc`,
    )
  )[0][0];

const tonTai = (duongDan) =>
  fs.access(duongDan).then(
    () => true,
    () => false,
  );
const fileTamCon = async (nd, ma) => {
  const cacTen = await fs.readdir(thuMucTam(nd.id_nguoi_cung_cap)).catch(() => []);
  return cacTen.filter((t) => t.startsWith(`${ma}.`)).sort();
};

// Ghi thẳng một bài video vào database (bài sẵn có trên AVA), không qua API
async function themBaiThang(idKhoa, { maBam = bam(ngauNhien()), dungLuong = 1000, daXoa = 0, khongChan = 0, soThuTu = 1 } = {}) {
  await pool.query(
    `INSERT INTO bai_hoc (id_khoa_hoc, ten_bai_hoc, so_thu_tu, loai, duong_dan_file, ten_file, dung_luong, thoi_luong,
                          ma_bam_file, da_xoa, khong_chan_ma_bam)
     VALUES (?, 'Bài có sẵn', ?, ?, ?, 'co-san.mp4', ?, 60, ?, ?, ?)`,
    [idKhoa, soThuTu, VIDEO, `video/${randomUUID()}.mp4`, dungLuong, maBam, daXoa, khongChan],
  );
}

test('P07-01 Tải file tạm hợp lệ', async () => {
  const truoc = await demBang();
  const res = await taiFile(ncc01, fileVideo(), 'giới thiệu khóa học.mp4', VIDEO, { thoiLuong: 125 });
  assert.equal(res.status, 201);
  const { ma_file_tam: ma } = res.body;
  assert.match(ma, /^[0-9a-f-]{36}$/);
  assert.deepEqual(res.body, { ma_file_tam: ma, ten_file: 'giới thiệu khóa học.mp4', dung_luong: 28, thoi_luong: 125 });

  assert.deepEqual(await fileTamCon(ncc01, ma), [`${ma}.json`, `${ma}.mp4`]);
  const moTa = JSON.parse(await fs.readFile(path.join(thuMucTam(ncc01.id_nguoi_cung_cap), `${ma}.json`), 'utf8'));
  assert.equal(moTa.ten_file, 'giới thiệu khóa học.mp4');
  assert.equal(moTa.dung_luong, 28);
  assert.match(moTa.ma_bam, /^[0-9a-f]{64}$/);
  assert.equal(moTa.loai, VIDEO);
  assert.equal(moTa.thoi_luong, 125);
  assert.ok(!Number.isNaN(Date.parse(moTa.thoi_diem_tai)));
  assert.deepEqual(await demBang(), truoc);
});

test('P07-02 File sai loại theo byte đầu', async () => {
  const cacBo = [
    [fileZip(), 'bai-giang.mp4', VIDEO, VIDEO_SAI, { thoiLuong: 60 }],
    [fileZip(), 'bai-giang.docx', TAI_LIEU, PDF_SAI, {}],
    [filePdf(), 'bia.jpg', ANH_BIA, ANH_SAI, {}],
  ];
  for (const [buf, ten, loai, cau, tuyChon] of cacBo) {
    const res = await taiFile(ncc01, buf, ten, loai, tuyChon);
    assert.equal(res.status, 400, ten);
    assert.equal(res.body.loi, cau);
    assert.equal(res.body.cac_o.file, cau);
  }
  assert.equal((await taiFile(ncc01, filePng(), 'bia.png', ANH_BIA)).status, 201);
  // File bị từ chối không nằm lại trong thư mục tạm
  const cacTen = await fs.readdir(thuMucTam(ncc01.id_nguoi_cung_cap));
  assert.ok(cacTen.every((t) => !t.startsWith('tai-')));
});

test('P07-03 Thời lượng video ngoài khoảng', async () => {
  for (const thoiLuong of [0, 21601, 'abc']) {
    const res = await taiVideo(ncc01, fileVideo(), { thoiLuong });
    assert.equal(res.status, 400, String(thoiLuong));
    assert.equal(res.body.cac_o.file, THOI_LUONG_SAI);
  }
  for (const thoiLuong of [1, 21600]) {
    const res = await taiVideo(ncc01, fileVideo(), { thoiLuong });
    assert.equal(res.status, 201, String(thoiLuong));
    assert.equal(res.body.thoi_luong, thoiLuong);
  }
});

test('P07-04 Dung lượng tối đa', async () => {
  const pdfQuaLon = Buffer.concat([Buffer.from('%PDF-'), Buffer.alloc(20971521 - 5)]);
  const anhQuaLon = Buffer.concat([Buffer.from([0xff, 0xd8, 0xff]), Buffer.alloc(2 * 1024 * 1024 + 1 - 3)]);
  const pdf = await taiPdf(ncc01, pdfQuaLon);
  assert.ok([400, 413].includes(pdf.status));
  assert.equal(pdf.body.cac_o.file, PDF_SAI);
  const anh = await taiFile(ncc01, anhQuaLon, 'bia.jpg', ANH_BIA);
  assert.ok([400, 413].includes(anh.status));
  assert.equal(anh.body.cac_o.file, ANH_SAI);
});

test('P07-05 Trùng file với bài đang có trên AVA', async () => {
  const fileX = fileVideo();
  await themBaiThang(await taoKhoaHoc(ncc03.id_nguoi_cung_cap, idLapTrinh), { maBam: bam(fileX) });
  const res = await taiVideo(ncc01, fileX);
  assert.equal(res.status, 409);
  // Chỉ báo trùng, không nói trùng với khóa nào
  assert.deepEqual(res.body, { loi: FILE_DA_CO, ma: 'TRUNG_FILE', cac_o: { file: FILE_DA_CO } });
});

test('P07-06 Trùng file tạm khác trên cùng trang', async () => {
  const fileY = filePdf();
  const lan1 = await taiPdf(ncc01, fileY);
  assert.equal(lan1.status, 201);
  const m1 = lan1.body.ma_file_tam;
  const trung = await taiPdf(ncc01, fileY, { dangDung: [m1] });
  assert.equal(trung.status, 409);
  assert.equal(trung.body.loi, FILE_DA_CO);
  assert.equal((await taiPdf(ncc01, fileY)).status, 201);
});

test('P07-07 Bài đã xóa và khóa bị gỡ không còn chặn', async () => {
  const fileZ = fileVideo();
  const fileW = fileVideo();
  await themBaiThang(await taoKhoaHoc(ncc03.id_nguoi_cung_cap, idLapTrinh), { maBam: bam(fileZ), daXoa: 1 });
  const idKhoaGo = await taoKhoaHoc(ncc03.id_nguoi_cung_cap, idLapTrinh, {
    trangThai: TRANG_THAI_KHOA_HOC.BI_GO_VINH_VIEN,
    lyDoAn: 'Vi phạm bản quyền',
  });
  await themBaiThang(idKhoaGo, { maBam: bam(fileW), khongChan: 1 });
  assert.equal((await taiVideo(ncc01, fileZ)).status, 201);
  assert.equal((await taiVideo(ncc01, fileW)).status, 201);
});

test('P07-08 Hạn mức 5GB', async () => {
  // Bài đang tính: 17 video 300MB + 1 video còn lại, tổng thiếu đúng 10 byte là đủ 5GB
  const idKhoa = await taoKhoaHoc(ncc04.id_nguoi_cung_cap, idLapTrinh);
  for (let i = 1; i <= 17; i += 1) await themBaiThang(idKhoa, { dungLuong: 314572800, soThuTu: i });
  await themBaiThang(idKhoa, { dungLuong: 5368709110 - 17 * 314572800, soThuTu: 18 });
  // Không tính: bài đã xóa, khóa đã xóa, khóa bị gỡ vĩnh viễn
  await themBaiThang(idKhoa, { dungLuong: 314572800, daXoa: 1, soThuTu: 19 });
  await themBaiThang(await taoKhoaHoc(ncc04.id_nguoi_cung_cap, idLapTrinh, { daXoa: 1 }), { dungLuong: 314572800 });
  const idKhoaGo = await taoKhoaHoc(ncc04.id_nguoi_cung_cap, idLapTrinh, {
    trangThai: TRANG_THAI_KHOA_HOC.BI_GO_VINH_VIEN,
    lyDoAn: 'Vi phạm',
  });
  await themBaiThang(idKhoaGo, { dungLuong: 314572800, khongChan: 1 });

  const pdf = (soByte) => Buffer.concat([Buffer.from('%PDF-'), randomBytes(soByte - 5)]);
  const qua = await taiPdf(ncc04, pdf(11));
  assert.equal(qua.status, 400);
  assert.equal(qua.body.cac_o.file, HET_DUNG_LUONG);
  // Biên đúng: vừa đủ 5GB được nhận; file tạm đang dùng trên trang cũng được cộng vào
  const vuaDu = await taiPdf(ncc04, pdf(10));
  assert.equal(vuaDu.status, 201);
  const congFileTam = await taiPdf(ncc04, pdf(10), { dangDung: [vuaDu.body.ma_file_tam] });
  assert.equal(congFileTam.body.cac_o?.file, HET_DUNG_LUONG);
  // Ảnh bìa không tính vào hạn mức
  assert.equal((await taiFile(ncc04, fileJpg(), 'bia.jpg', ANH_BIA)).status, 201);
});

test('P07-09 Đã đủ 50 bài', async () => {
  const du = await taiVideo(ncc01, fileVideo(), { soBai: 50 });
  assert.equal(du.status, 400);
  assert.equal(du.body.cac_o.file, 'Khóa học đã có đủ 50 bài.');
  assert.equal((await taiVideo(ncc01, fileVideo(), { soBai: 49 })).status, 201);
});

test('P07-10 Xóa file tạm', async () => {
  const xoa = (nd, duongDan) =>
    request(app).delete(`/api/nguoi-cung-cap/file-tam${duongDan}`).set('Cookie', nd.cookie).set('Origin', ORIGIN_HOP_LE);
  const a = (await taiVideo(ncc01)).body.ma_file_tam;
  const b = (await taiPdf(ncc01)).body.ma_file_tam;
  const c = (await taiPdf(ncc03)).body.ma_file_tam;

  assert.equal((await xoa(ncc01, `/${c}`)).status, 200);
  assert.equal((await fileTamCon(ncc03, c)).length, 2);

  assert.equal((await xoa(ncc01, `/${a}`)).status, 200);
  assert.deepEqual(await fileTamCon(ncc01, a), []);
  assert.equal((await fileTamCon(ncc01, b)).length, 2);

  assert.equal((await xoa(ncc01, `/khong-phai-ma`)).status, 400);
  assert.equal((await xoa(ncc01, '')).status, 200);
  assert.equal(await tonTai(thuMucTam(ncc01.id_nguoi_cung_cap)), false);
  assert.equal((await fileTamCon(ncc03, c)).length, 2);
});

let idKhoaMau;

test('P07-11 Đăng khóa hợp lệ', async () => {
  const video = fileVideo();
  const pdf = filePdf();
  const duLieu = await khoaMau(ncc01, { anhBia: true, video, pdf });
  const cacMa = [duLieu.bai_hoc[0].ma_file_tam, duLieu.bai_hoc[1].ma_file_tam, duLieu.thong_tin.ma_file_tam_anh_bia];
  const res = await dang(ncc01, duLieu);
  assert.equal(res.status, 201, JSON.stringify(res.body));
  idKhoaMau = res.body.id;
  assert.ok(Number.isInteger(idKhoaMau));

  const [[khoa]] = await pool.query('SELECT * FROM khoa_hoc WHERE id = ?', [idKhoaMau]);
  assert.equal(khoa.trang_thai, TRANG_THAI_KHOA_HOC.DANG_BAN);
  assert.equal(khoa.bi_an_boi, null);
  assert.equal(khoa.ly_do_an, null);
  assert.equal(khoa.da_xoa, 0);
  assert.equal(khoa.id_nguoi_cung_cap, ncc01.id_nguoi_cung_cap);
  assert.equal(khoa.id_danh_muc, idLapTrinh);
  assert.equal(Number(khoa.gia_ban), 349000);
  assert.equal(khoa.hoc_duoc_gi, 'Vẽ phác thảo\nTô màu');
  assert.equal(khoa.yeu_cau, null);
  assert.match(khoa.anh_bia, /^anh_bia\/[0-9a-f-]{36}\.jpg$/);

  const [cacBai] = await pool.query('SELECT * FROM bai_hoc WHERE id_khoa_hoc = ? ORDER BY so_thu_tu', [idKhoaMau]);
  assert.deepEqual(
    cacBai.map((b) => [b.so_thu_tu, b.loai]),
    [
      [1, VIDEO],
      [2, TAI_LIEU],
      [3, TRAC_NGHIEM],
    ],
  );
  const [baiVideo, baiPdf, baiTracNghiem] = cacBai;
  assert.equal(baiVideo.thoi_luong, 125);
  assert.equal(baiVideo.ten_file, 'video.mp4');
  assert.equal(baiVideo.ma_bam_file, bam(video));
  assert.equal(Number(baiVideo.dung_luong), video.length);
  assert.match(baiVideo.duong_dan_file, /^video\/[0-9a-f-]{36}\.mp4$/);
  assert.equal(baiPdf.ma_bam_file, bam(pdf));
  assert.match(baiPdf.duong_dan_file, /^tai_lieu\/[0-9a-f-]{36}\.pdf$/);
  assert.equal(baiTracNghiem.thoi_gian_lam_bai, 15);
  assert.equal(baiTracNghiem.duong_dan_file, null);
  const [cacCau] = await pool.query('SELECT so_thu_tu, dap_an_dung FROM cau_hoi_bai_tap WHERE id_bai_hoc = ? ORDER BY so_thu_tu', [
    baiTracNghiem.id,
  ]);
  assert.deepEqual(cacCau.map((c) => c.so_thu_tu), [1, 2, 3, 4, 5]);

  const [lichSu] = await pool.query('SELECT hanh_dong, id_nguoi_dung FROM lich_su_khoa_hoc WHERE id_khoa_hoc = ?', [idKhoaMau]);
  assert.deepEqual(lichSu, [{ hanh_dong: HANH_DONG_LICH_SU.DANG_KHOA_HOC, id_nguoi_dung: ncc01.id }]);

  // File ở thư mục chính thức với tên ngẫu nhiên mới; thư mục tạm không còn file đó và file mô tả
  for (const duongDan of [baiVideo.duong_dan_file, baiPdf.duong_dan_file, khoa.anh_bia]) {
    assert.ok(await tonTai(path.join(config.thuMucLuuTru, duongDan)), duongDan);
    assert.ok(cacMa.every((ma) => !duongDan.includes(ma)));
  }
  for (const ma of cacMa) assert.deepEqual(await fileTamCon(ncc01, ma), []);
});

test('P07-12 Người cung cấp thiếu họ tên hoặc số điện thoại', async () => {
  const duLieu = await khoaMau(ncc02); // gửi file tạm vẫn được (chỉ chặn lúc đăng)
  const truoc = await demBang();
  const res = await dang(ncc02, duLieu);
  assert.equal(res.status, 400);
  assert.equal(res.body.loi, 'Hãy cập nhật họ tên và số điện thoại trong hồ sơ trước khi tạo khóa học.');
  assert.deepEqual(await demBang(), truoc);
});

test('P07-13 Lỗi bước 1', async () => {
  const duLieu = await khoaMau(ncc01);
  const truoc = await demBang();
  const dai = (n) => 'a'.repeat(n);
  const cacBo = [
    [{ ten_khoa_hoc: '  ' }, 'ten_khoa_hoc', 'Vui lòng nhập tên khóa học'],
    [{ ten_khoa_hoc: dai(201) }, 'ten_khoa_hoc', QUA_DAI],
    [{ mo_ta: '' }, 'mo_ta', 'Vui lòng nhập mô tả khóa học'],
    [{ id_danh_muc: null }, 'id_danh_muc', 'Vui lòng chọn danh mục'],
    [{ id_danh_muc: null, ten_danh_muc_moi: ' ' }, 'ten_danh_muc_moi', 'Vui lòng nhập tên danh mục mới'],
    [{ id_danh_muc: 999999 }, 'id_danh_muc', 'Danh mục không còn tồn tại.'],
    [{ gia_ban: 9999 }, 'gia_ban', 'Giá bán phải từ 10.000đ đến 50.000.000đ'],
    [{ gia_ban: 50000001 }, 'gia_ban', 'Giá bán phải từ 10.000đ đến 50.000.000đ'],
    [{ gia_ban: 10000.5 }, 'gia_ban', 'Giá bán phải từ 10.000đ đến 50.000.000đ'],
    [{ mo_ta: dai(10001) }, 'mo_ta', QUA_DAI],
    [{ danh_cho_ai: dai(10001) }, 'danh_cho_ai', QUA_DAI],
    [{ hoc_duoc_gi: dai(10001) }, 'hoc_duoc_gi', QUA_DAI],
    [{ yeu_cau: dai(10001) }, 'yeu_cau', QUA_DAI],
  ];
  for (const [doi, o, cau] of cacBo) {
    const res = await dang(ncc01, { ...duLieu, thong_tin: { ...duLieu.thong_tin, ...doi } });
    assert.equal(res.status, 400, JSON.stringify(doi).slice(0, 60));
    assert.equal(res.body.cac_o[`thong_tin.${o}`], cau, o);
  }
  assert.deepEqual(await demBang(), truoc);

  // Biên đúng: giá 10.000 và 50.000.000, mỗi ô dài đúng 10.000 ký tự
  const bien1 = await dang(ncc01, {
    ...duLieu,
    thong_tin: { ...duLieu.thong_tin, gia_ban: 10000, mo_ta: dai(10000), hoc_duoc_gi: dai(10000), yeu_cau: dai(10000), danh_cho_ai: dai(10000) },
  });
  assert.equal(bien1.status, 201, JSON.stringify(bien1.body));
  const duLieu2 = await khoaMau(ncc01);
  const bien2 = await dang(ncc01, { ...duLieu2, thong_tin: { ...duLieu2.thong_tin, gia_ban: 50000000 } });
  assert.equal(bien2.status, 201);
});

test('P07-14 Số bài và bài số 1', async () => {
  const duLieu = await khoaMau(ncc01);
  const [video, pdf, tracNghiem] = duLieu.bai_hoc;
  const truoc = await demBang();
  const cacBo = [
    [video, pdf],
    [{ ...tracNghiem, so_thu_tu: 1 }, { ...video, so_thu_tu: 2 }, { ...pdf, so_thu_tu: 3 }],
    [video, pdf, { ...tracNghiem, so_thu_tu: 4 }],
    [video, { ...pdf, so_thu_tu: 1 }, tracNghiem],
  ];
  for (const baiHoc of cacBo) {
    const res = await dang(ncc01, { ...duLieu, bai_hoc: baiHoc });
    assert.equal(res.status, 400);
  }
  const bai1 = await dang(ncc01, { ...duLieu, bai_hoc: cacBo[1] });
  assert.equal(bai1.body.cac_o.bai_hoc, 'Bài số 1 phải là bài video hoặc tài liệu.');
  assert.deepEqual(await demBang(), truoc);
});

test('P07-15 Bài trắc nghiệm sai', async () => {
  const duLieu = await khoaMau(ncc01);
  const truoc = await demBang();
  const voiBai3 = (doi) => ({ ...duLieu, bai_hoc: [duLieu.bai_hoc[0], duLieu.bai_hoc[1], { ...duLieu.bai_hoc[2], ...doi }] });
  const doiCau1 = (doi) => ({ cau_hoi: [{ ...nCau(1)[0], ...doi }, ...nCau(4)] });
  const cacBo = [
    [{ cau_hoi: nCau(4) }, 'bai_hoc.2.cau_hoi', 'Bài trắc nghiệm cần ít nhất 5 câu.'],
    [{ cau_hoi: nCau(51) }, 'bai_hoc.2.cau_hoi', null],
    [{ thoi_gian_lam_bai: 0 }, 'bai_hoc.2.thoi_gian_lam_bai', 'Thời gian làm bài từ 1 đến 180 phút.'],
    [{ thoi_gian_lam_bai: 181 }, 'bai_hoc.2.thoi_gian_lam_bai', 'Thời gian làm bài từ 1 đến 180 phút.'],
    [doiCau1({ noi_dung: ' ' }), 'bai_hoc.2.cau_hoi.0.noi_dung', 'Vui lòng nhập nội dung câu hỏi'],
    [doiCau1({ lua_chon_c: '' }), 'bai_hoc.2.cau_hoi.0.lua_chon_c', 'Vui lòng nhập đủ 4 lựa chọn'],
    [doiCau1({ dap_an_dung: undefined }), 'bai_hoc.2.cau_hoi.0.dap_an_dung', 'Vui lòng chọn đáp án đúng'],
    [doiCau1({ noi_dung: 'a'.repeat(1001) }), 'bai_hoc.2.cau_hoi.0.noi_dung', QUA_DAI],
    [doiCau1({ lua_chon_a: 'a'.repeat(256) }), 'bai_hoc.2.cau_hoi.0.lua_chon_a', QUA_DAI],
  ];
  for (const [doi, o, cau] of cacBo) {
    const res = await dang(ncc01, voiBai3(doi));
    assert.equal(res.status, 400, o);
    if (cau) assert.equal(res.body.cac_o[o], cau, o);
  }
  assert.deepEqual(await demBang(), truoc);

  // Biên đúng: 50 câu và 1 phút; 5 câu và 180 phút. Câu hỏi nhận mọi ký tự gõ được (Phần 7 mục 7.4)
  const cau50 = nCau(50).map((c, i) => (i === 0 ? { ...c, noi_dung: '2 + 2 = ?', lua_chon_a: 'C++', lua_chon_b: 'MP4' } : c));
  assert.equal((await dang(ncc01, voiBai3({ cau_hoi: cau50, thoi_gian_lam_bai: 1 }))).status, 201);
  const duLieu2 = await khoaMau(ncc01);
  const res180 = await dang(ncc01, { ...duLieu2, bai_hoc: [duLieu2.bai_hoc[0], duLieu2.bai_hoc[1], { ...duLieu2.bai_hoc[2], thoi_gian_lam_bai: 180 }] });
  assert.equal(res180.status, 201);
});

test('P07-16 Chưa tích cam kết', async () => {
  const duLieu = await khoaMau(ncc01);
  const truoc = await demBang();
  assert.equal((await dang(ncc01, { ...duLieu, cam_ket: false })).status, 400);
  const { cam_ket: _boQua, ...khongCamKet } = duLieu;
  assert.equal((await dang(ncc01, khongCamKet)).status, 400);
  assert.deepEqual(await demBang(), truoc);
});

test('P07-17 ma_file_tam không hợp lệ', async () => {
  const duLieu = await khoaMau(ncc01);
  const truoc = await demBang();
  const cuaNcc03 = (await taiVideo(ncc03)).body.ma_file_tam;
  const voiBai1 = (ma) => ({ ...duLieu, bai_hoc: [{ ...duLieu.bai_hoc[0], ma_file_tam: ma }, ...duLieu.bai_hoc.slice(1)] });

  const lan1 = await dang(ncc01, voiBai1(cuaNcc03));
  assert.equal(lan1.status, 400);
  assert.equal(lan1.body.ma, 'FILE_TAM_KHONG_CON');
  assert.equal(lan1.body.vi_tri_bai, 1);
  assert.equal((await fileTamCon(ncc03, cuaNcc03)).length, 2);

  const daXoa = (await taiVideo(ncc01)).body.ma_file_tam;
  await request(app).delete(`/api/nguoi-cung-cap/file-tam/${daXoa}`).set('Cookie', ncc01.cookie).set('Origin', ORIGIN_HOP_LE);
  assert.equal((await dang(ncc01, voiBai1(daXoa))).status, 400);
  // File tài liệu dùng cho bài video (sai loại) cũng bị từ chối
  assert.equal((await dang(ncc01, voiBai1(duLieu.bai_hoc[1].ma_file_tam))).status, 400);
  assert.deepEqual(await demBang(), truoc);
});

test('P07-18 Trùng file lúc đăng', async () => {
  const fileV = filePdf();
  const duLieu = await khoaMau(ncc01, { pdf: fileV });
  // Trước khi ncc01 đăng, một người khác đăng khóa có cùng file V
  const khac = await dang(ncc03, await khoaMau(ncc03, { pdf: fileV }));
  assert.equal(khac.status, 201);

  const truoc = await demBang();
  const res = await dang(ncc01, duLieu);
  assert.equal(res.status, 409);
  assert.equal(res.body.ma, 'TRUNG_FILE');
  assert.equal(res.body.vi_tri_bai, 2);
  assert.deepEqual(await demBang(), truoc);
  // Không ghi gì nên file tạm vẫn còn nguyên để người cung cấp sửa bài rồi đăng lại
  assert.equal((await fileTamCon(ncc01, duLieu.bai_hoc[0].ma_file_tam)).length, 2);

  // Hai bài trong cùng khóa dùng chung một file cũng bị báo, ở bài sau
  const v = await taiVideo(ncc01);
  const t = await taiPdf(ncc01);
  const chung = {
    ...duLieu,
    bai_hoc: [
      { ...duLieu.bai_hoc[0], ma_file_tam: v.body.ma_file_tam },
      { ...duLieu.bai_hoc[1], ma_file_tam: t.body.ma_file_tam },
      { ...duLieu.bai_hoc[0], so_thu_tu: 3, ma_file_tam: v.body.ma_file_tam },
    ],
  };
  const trungTrongKhoa = await dang(ncc01, chung);
  assert.equal(trungTrongKhoa.status, 409);
  assert.equal(trungTrongKhoa.body.vi_tri_bai, 3);
});

test('P07-19 Danh mục "Khác"', async () => {
  const duLieu1 = await khoaMau(ncc01);
  const moi = await dang(ncc01, { ...duLieu1, thong_tin: { ...duLieu1.thong_tin, id_danh_muc: null, ten_danh_muc_moi: 'lập trình game' } });
  assert.equal(moi.status, 201);
  const [[khoa1]] = await pool.query(
    'SELECT dm.ten FROM khoa_hoc kh JOIN danh_muc dm ON dm.id = kh.id_danh_muc WHERE kh.id = ?',
    [moi.body.id],
  );
  assert.equal(khoa1.ten, 'Lập Trình Game');

  const duLieu2 = await khoaMau(ncc01);
  const truoc = await demBang();
  const coSan = await dang(ncc01, { ...duLieu2, thong_tin: { ...duLieu2.thong_tin, id_danh_muc: null, ten_danh_muc_moi: 'lập trình' } });
  assert.equal(coSan.status, 201);
  const [[khoa2]] = await pool.query('SELECT id_danh_muc FROM khoa_hoc WHERE id = ?', [coSan.body.id]);
  assert.equal(khoa2.id_danh_muc, idLapTrinh);
  assert.equal((await demBang()).danh_muc, truoc.danh_muc);
});

test('P07-20 Dữ liệu gửi lên tới 20MB', async () => {
  const duLieu = await khoaMau(ncc01);
  const voiMoTa = (soKyTu) => ({ ...duLieu, thong_tin: { ...duLieu.thong_tin, mo_ta: 'a'.repeat(soKyTu) } });
  // Khoảng 2MB: vượt giới hạn chung 1MB nhưng vẫn tới bước kiểm tra (mô tả quá dài), không bị 413
  const haiMB = await dang(ncc01, voiMoTa(2 * 1024 * 1024));
  assert.equal(haiMB.status, 400);
  assert.equal(haiMB.body.cac_o['thong_tin.mo_ta'], QUA_DAI);
  const quaLon = await dang(ncc01, voiMoTa(21 * 1024 * 1024));
  assert.equal(quaLon.status, 413);
  // Các đường khác vẫn giữ giới hạn chung 1MB
  const hoSo = await request(app)
    .put('/api/ho-so')
    .set('Cookie', ncc01.cookie)
    .set('Origin', ORIGIN_HOP_LE)
    .send({ ho_ten: 'a'.repeat(2 * 1024 * 1024) });
  assert.equal(hoSo.status, 413);
});

test('P07-21 Phân quyền', async () => {
  for (const [cookie, maTrangThai] of [[hv.cookie, 403], [admin.cookie, 403], ['', 401]]) {
    const file = await request(app)
      .post('/api/nguoi-cung-cap/file-tam')
      .set('Cookie', cookie)
      .set('Origin', ORIGIN_HOP_LE)
      .field('loai', VIDEO)
      .attach('file', fileVideo(), 'video.mp4');
    assert.equal(file.status, maTrangThai);
    const khoa = await dang({ cookie }, { cam_ket: true });
    assert.equal(khoa.status, maTrangThai);
    const xoa = await request(app).delete('/api/nguoi-cung-cap/file-tam').set('Cookie', cookie).set('Origin', ORIGIN_HOP_LE);
    assert.equal(xoa.status, maTrangThai);
  }
});

test('P07-22 Họ tên bị khóa sau khi đăng khóa đầu tiên', async () => {
  assert.ok(idKhoaMau, 'cần chạy sau P07-11');
  const { body: hoSo } = await request(app).get('/api/ho-so').set('Cookie', ncc01.cookie);
  const res = await request(app)
    .put('/api/ho-so')
    .set('Cookie', ncc01.cookie)
    .set('Origin', ORIGIN_HOP_LE)
    .send({ ho_ten: 'Tên Khác Hẳn', gmail: hoSo.gmail, so_dien_thoai: hoSo.so_dien_thoai });
  assert.equal(res.status, 400);
  const [[nd]] = await pool.query('SELECT ho_ten FROM nguoi_dung WHERE id = ?', [ncc01.id]);
  assert.equal(nd.ho_ten, 'Ngô Văn Bảy');
});

test('P07-30 Xóa file tạm quá 24 giờ', async () => {
  const thuMuc = thuMucTam(ncc04.id_nguoi_cung_cap);
  await fs.mkdir(thuMuc, { recursive: true });
  const cu = randomUUID();
  const moi = randomUUID();
  for (const ten of [`${cu}.mp4`, `${cu}.json`, `${moi}.mp4`, `${moi}.json`]) await fs.writeFile(path.join(thuMuc, ten), 'x');
  const truoc25Gio = new Date(Date.now() - 25 * 60 * 60 * 1000);
  for (const ten of [`${cu}.mp4`, `${cu}.json`]) await fs.utimes(path.join(thuMuc, ten), truoc25Gio, truoc25Gio);

  await donFileTamQuaHan();
  assert.equal(await tonTai(path.join(thuMuc, `${cu}.mp4`)), false);
  assert.equal(await tonTai(path.join(thuMuc, `${cu}.json`)), false);
  assert.equal(await tonTai(path.join(thuMuc, `${moi}.mp4`)), true);
  assert.equal(await tonTai(path.join(thuMuc, `${moi}.json`)), true);
});
