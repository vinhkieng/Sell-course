// Kiểm hàm thuần của trang tạo khóa học (Phần 7 mục 7.3, 7.4, 7.7)
import { expect, test } from 'vitest'
import {
  chenBai,
  xoaBai,
  suaBai,
  viTriChen,
  kiemTraBuoc1,
  kiemTraBai,
  loiBuoc1TuMayChu,
  laTrungDanhMuc,
  loiTenDanhMucMoi,
  dinhDangGiaKhiGo,
  docGia,
  dinhDangThoiLuong,
  dinhDangDungLuong,
  taoDuLieuDang,
  bai1LaTracNghiem,
  cauHoiTrong,
  chuLoaiBai,
  DANH_MUC_KHAC,
  DANH_MUC_DA_CO,
  THOI_GIAN_SAI,
  CAU_IT_SAI,
  GIA_SAI,
  QUA_DAI,
} from './soanKhoaHoc.js'
import { TEN_DANH_MUC_SAI } from './kiemTraDanhMuc.js'

const DANH_MUC = [
  { id: 1, ten: 'Lập Trình' },
  { id: 2, ten: 'Thiết Kế' },
]
const tenCac = (ds) => ds.map((b) => b.khoa)
const ba = [{ khoa: 'a' }, { khoa: 'b' }, { khoa: 'c' }]

test('Chèn bài vào số đã có thì các bài sau dời xuống', () => {
  expect(tenCac(chenBai(ba, { khoa: 'm' }, '2'))).toEqual(['a', 'm', 'b', 'c'])
  expect(tenCac(chenBai(ba, { khoa: 'm' }, '1'))).toEqual(['m', 'a', 'b', 'c'])
  expect(tenCac(chenBai(ba, { khoa: 'm' }, '3'))).toEqual(['a', 'b', 'm', 'c'])
})

test('Số lớn hơn số bài, để trống hoặc 0 thì xếp vào cuối', () => {
  for (const so of ['4', '99', '', '0']) {
    expect(tenCac(chenBai(ba, { khoa: 'm' }, so))).toEqual(['a', 'b', 'c', 'm'])
  }
  expect(viTriChen('1', 0)).toBe(0)
})

test('Xóa bài thì các bài sau dồn lên', () => {
  expect(tenCac(xoaBai(ba, 'b'))).toEqual(['a', 'c'])
})

test('Sửa bài đổi số thứ tự', () => {
  expect(tenCac(suaBai(ba, { khoa: 'c' }, '1'))).toEqual(['c', 'a', 'b'])
  expect(tenCac(suaBai(ba, { khoa: 'a' }, '99'))).toEqual(['b', 'c', 'a'])
  expect(tenCac(suaBai(ba, { khoa: 'b' }, '2'))).toEqual(['a', 'b', 'c'])
})

const buoc1 = (doi = {}) => ({
  ten_khoa_hoc: 'Lập trình web',
  mo_ta: 'Mô tả',
  id_danh_muc: '1',
  ten_danh_muc_moi: '',
  gia_ban: '349.000',
  hoc_duoc_gi: '',
  yeu_cau: '',
  danh_cho_ai: '',
  ...doi,
})

test('Bước 1 hợp lệ', () => {
  expect(kiemTraBuoc1(buoc1(), DANH_MUC)).toEqual({})
  expect(kiemTraBuoc1(buoc1({ gia_ban: '10.000' }), DANH_MUC)).toEqual({})
  expect(kiemTraBuoc1(buoc1({ gia_ban: '50.000.000', mo_ta: 'a'.repeat(10000) }), DANH_MUC)).toEqual({})
})

test('Bước 1 báo lỗi dưới từng ô', () => {
  expect(kiemTraBuoc1(buoc1({ ten_khoa_hoc: '  ', mo_ta: '', id_danh_muc: '', gia_ban: '' }), DANH_MUC)).toEqual({
    ten_khoa_hoc: 'Vui lòng nhập tên khóa học',
    mo_ta: 'Vui lòng nhập mô tả khóa học',
    id_danh_muc: 'Vui lòng chọn danh mục',
    gia_ban: GIA_SAI,
  })
  for (const gia of ['9.999', '50.000.001', '10000,5', 'abc']) {
    expect(kiemTraBuoc1(buoc1({ gia_ban: gia }), DANH_MUC).gia_ban).toBe(GIA_SAI)
  }
  const dai = 'a'.repeat(10001)
  expect(kiemTraBuoc1(buoc1({ mo_ta: dai, hoc_duoc_gi: dai, yeu_cau: dai, danh_cho_ai: dai }), DANH_MUC)).toEqual({
    mo_ta: QUA_DAI,
    hoc_duoc_gi: QUA_DAI,
    yeu_cau: QUA_DAI,
    danh_cho_ai: QUA_DAI,
  })
})

test('Danh mục "Khác"', () => {
  const khac = (ten) => kiemTraBuoc1(buoc1({ id_danh_muc: DANH_MUC_KHAC, ten_danh_muc_moi: ten }), DANH_MUC)
  expect(khac('')).toEqual({ ten_danh_muc_moi: 'Vui lòng nhập tên danh mục mới' })
  expect(khac('lập trình')).toEqual({ ten_danh_muc_moi: DANH_MUC_DA_CO })
  expect(khac('lap trinh')).toEqual({ ten_danh_muc_moi: DANH_MUC_DA_CO })
  expect(khac('A')).toEqual({ ten_danh_muc_moi: TEN_DANH_MUC_SAI })
  expect(khac('Nấu ăn')).toEqual({})
  expect(laTrungDanhMuc('THIẾT  kế', DANH_MUC)).toBe(true)
  expect(loiTenDanhMucMoi('Lập Trình Game', DANH_MUC)).toBe('')
})

test('Lỗi bước 1 từ máy chủ', () => {
  expect(loiBuoc1TuMayChu({ 'thong_tin.mo_ta': QUA_DAI, 'bai_hoc.0.ten_bai_hoc': 'x' })).toEqual({ mo_ta: QUA_DAI })
})

test('Kiểm tên bài', () => {
  expect(kiemTraBai({ ten_bai_hoc: ' ' })).toEqual({ ten_bai_hoc: 'Vui lòng nhập tên bài' })
  expect(kiemTraBai({ ten_bai_hoc: 'Bài 1' })).toEqual({})
})

test('Ô giá tự thêm dấu chấm khi gõ', () => {
  expect(dinhDangGiaKhiGo('349000')).toBe('349.000')
  expect(dinhDangGiaKhiGo('34.9000')).toBe('349.000')
  expect(dinhDangGiaKhiGo('50000000')).toBe('50.000.000')
  expect(dinhDangGiaKhiGo('0012')).toBe('12')
  expect(dinhDangGiaKhiGo('')).toBe('')
  expect(dinhDangGiaKhiGo('10000,5')).toBe('10000,5')
  expect(docGia('349.000')).toBe(349000)
  expect(docGia('10000')).toBe(10000)
  expect(docGia('10000,5')).toBeNaN()
  expect(docGia('')).toBeNaN()
})

test('Thời lượng video', () => {
  expect(dinhDangThoiLuong(340)).toBe('05:40')
  expect(dinhDangThoiLuong(1)).toBe('00:01')
  expect(dinhDangThoiLuong(3599)).toBe('59:59')
  expect(dinhDangThoiLuong(3600)).toBe('1:00:00')
  expect(dinhDangThoiLuong(3725)).toBe('1:02:05')
  expect(dinhDangThoiLuong(21600)).toBe('6:00:00')
})

test('Dung lượng file', () => {
  expect(dinhDangDungLuong(850 * 1024)).toBe('850 KB')
  expect(dinhDangDungLuong(100)).toBe('1 KB')
  expect(dinhDangDungLuong(3.4 * 1024 * 1024)).toBe('3,4 MB')
  expect(dinhDangDungLuong(1024 * 1024)).toBe('1,0 MB')
  expect(dinhDangDungLuong(48 * 1024 * 1024)).toBe('48 MB')
  expect(dinhDangDungLuong(9.97 * 1024 * 1024)).toBe('10 MB')
})

test('Dữ liệu gửi khi đăng', () => {
  const bai = [
    { khoa: 1, ten_bai_hoc: 'Giới thiệu', loai: 'Video', file: { ma_file_tam: 'm1' } },
    { khoa: 2, ten_bai_hoc: 'Tài liệu', loai: 'Tài liệu', file: { ma_file_tam: 'm2' } },
  ]
  const kq = taoDuLieuDang(buoc1(), null, bai)
  expect(kq.thong_tin).toMatchObject({ id_danh_muc: 1, ten_danh_muc_moi: null, gia_ban: 349000, ma_file_tam_anh_bia: null })
  expect(kq.bai_hoc).toEqual([
    { ten_bai_hoc: 'Giới thiệu', so_thu_tu: 1, loai: 'Video', ma_file_tam: 'm1' },
    { ten_bai_hoc: 'Tài liệu', so_thu_tu: 2, loai: 'Tài liệu', ma_file_tam: 'm2' },
  ])
  expect(kq.cam_ket).toBe(true)
  const khac = taoDuLieuDang(buoc1({ id_danh_muc: DANH_MUC_KHAC, ten_danh_muc_moi: 'Nấu ăn' }), { ma_file_tam: 'a' }, bai)
  expect(khac.thong_tin).toMatchObject({ id_danh_muc: null, ten_danh_muc_moi: 'Nấu ăn', ma_file_tam_anh_bia: 'a' })
})

// Bài trắc nghiệm hợp lệ mẫu: 5 câu đủ nội dung, 4 lựa chọn, có đáp án
const cauDu = (khoa) => ({
  ...cauHoiTrong(khoa),
  noi_dung: '2 + 2 = ?',
  lua_chon_a: '3',
  lua_chon_b: '4',
  lua_chon_c: 'C++',
  lua_chon_d: 'MP4',
  dap_an_dung: 'B',
})
const tracNghiem = (doi = {}) => ({
  ten_bai_hoc: 'Ôn tập',
  loai: 'Trắc nghiệm',
  thoi_gian_lam_bai: '15',
  cau_hoi: [1, 2, 3, 4, 5].map(cauDu),
  ...doi,
})

test('Bài trắc nghiệm hợp lệ, biên đúng', () => {
  expect(kiemTraBai(tracNghiem())).toEqual({})
  expect(kiemTraBai(tracNghiem({ thoi_gian_lam_bai: '1' }))).toEqual({})
  expect(kiemTraBai(tracNghiem({ thoi_gian_lam_bai: '180' }))).toEqual({})
  expect(kiemTraBai(tracNghiem({ cau_hoi: Array.from({ length: 50 }, (_, i) => cauDu(i)) }))).toEqual({})
})

test('Thời gian làm bài ngoài 1 đến 180 phút', () => {
  for (const phut of ['', '0', '181', '200']) {
    expect(kiemTraBai(tracNghiem({ thoi_gian_lam_bai: phut })).thoi_gian_lam_bai).toBe(THOI_GIAN_SAI)
  }
})

test('Bài trắc nghiệm dưới 5 câu', () => {
  expect(kiemTraBai(tracNghiem({ cau_hoi: [1, 2, 3, 4].map(cauDu) }))).toEqual({ cau_hoi: CAU_IT_SAI })
  expect(kiemTraBai(tracNghiem({ cau_hoi: [] })).cau_hoi).toBe(CAU_IT_SAI)
})

test('Lỗi từng câu trắc nghiệm', () => {
  const cau = [
    { ...cauDu(1), noi_dung: '  ' },
    { ...cauDu(2), lua_chon_d: '', lua_chon_b: ' ' },
    { ...cauDu(3), dap_an_dung: '' },
    cauHoiTrong(4),
    cauDu(5),
  ]
  expect(kiemTraBai(tracNghiem({ cau_hoi: cau })).cac_cau).toEqual({
    1: { noi_dung: 'Vui lòng nhập nội dung câu hỏi' },
    2: { lua_chon_trong: ['lua_chon_b', 'lua_chon_d'], lua_chon: 'Vui lòng nhập đủ 4 lựa chọn' },
    3: { dap_an: 'Vui lòng chọn đáp án đúng' },
    4: {
      noi_dung: 'Vui lòng nhập nội dung câu hỏi',
      lua_chon_trong: ['lua_chon_a', 'lua_chon_b', 'lua_chon_c', 'lua_chon_d'],
      lua_chon: 'Vui lòng nhập đủ 4 lựa chọn',
      dap_an: 'Vui lòng chọn đáp án đúng',
    },
  })
})

test('Bài video, tài liệu không kiểm phần trắc nghiệm', () => {
  expect(kiemTraBai({ ten_bai_hoc: 'Bài 1', loai: 'Video', thoi_gian_lam_bai: '', cau_hoi: [] })).toEqual({})
})

test('Bài số 1 không được là trắc nghiệm', () => {
  const video = { khoa: 'v', loai: 'Video' }
  const tn = { khoa: 't', loai: 'Trắc nghiệm' }
  expect(bai1LaTracNghiem(chenBai([video], tn, '1'))).toBe(true)
  expect(bai1LaTracNghiem(chenBai([], tn, ''))).toBe(true)
  expect(bai1LaTracNghiem(chenBai([video], tn, '2'))).toBe(false)
  // Xóa bài 1 hoặc dời bài 1 ra sau khi bài 2 là trắc nghiệm
  expect(bai1LaTracNghiem(xoaBai([video, tn], 'v'))).toBe(true)
  expect(bai1LaTracNghiem(suaBai([video, tn, { khoa: 'p', loai: 'Tài liệu' }], video, '3'))).toBe(true)
  expect(bai1LaTracNghiem([])).toBe(false)
})

test('Chữ trên nhãn loại bài', () => {
  expect(chuLoaiBai({ loai: 'Video', file: { thoi_luong: 340 } })).toBe('Video, 05:40')
  expect(chuLoaiBai({ loai: 'Tài liệu' })).toBe('Tài liệu')
  expect(chuLoaiBai(tracNghiem({ thoi_gian_lam_bai: 10 }))).toBe('Trắc nghiệm, 5 câu, 10 phút')
})

test('Dữ liệu gửi khi đăng có bài trắc nghiệm', () => {
  const bai = [
    { khoa: 1, ten_bai_hoc: 'Giới thiệu', loai: 'Video', file: { ma_file_tam: 'm1' } },
    { khoa: 2, ...tracNghiem({ thoi_gian_lam_bai: 15 }), file: null },
  ]
  const { bai_hoc: baiGui } = taoDuLieuDang(buoc1(), null, bai)
  expect(baiGui[1]).toEqual({
    ten_bai_hoc: 'Ôn tập',
    so_thu_tu: 2,
    loai: 'Trắc nghiệm',
    thoi_gian_lam_bai: 15,
    cau_hoi: [1, 2, 3, 4, 5].map((k) => {
      const { khoa: _khoa, ...cau } = cauDu(k)
      return cau
    }),
  })
  expect(baiGui[1]).not.toHaveProperty('ma_file_tam')
})
