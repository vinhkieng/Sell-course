// Kiểm hàm kiểm ô và đổi ngày của trang hồ sơ (Phần 5 mục 5.4, 5.7)
import { expect, test } from 'vitest'
import {
  chuanHoaHoTen,
  ngayHienThiSangLuu,
  ngayLuuSangHienThi,
  homQua,
  kiemTraThongTin,
  kiemTraDoiMatKhau,
} from './kiemTraHoSo.js'

const HOM_NAY = new Date(2026, 10, 24) // 24/11/2026
const hopLe = { ho_ten: 'Nguyễn Văn An', gmail: 'an@gmail.com', so_dien_thoai: '0912345678', nghe_nghiep: '', ngay_sinh: '' }

test('Đổi ngày qua lại và chuẩn hóa họ tên', () => {
  expect(ngayHienThiSangLuu('15/03/2004')).toBe('2004-03-15')
  expect(ngayHienThiSangLuu('')).toBe('')
  expect(ngayHienThiSangLuu('30/02/2026')).toBe(null)
  expect(ngayHienThiSangLuu('2004-03-15')).toBe(null)
  expect(ngayLuuSangHienThi('2004-03-15')).toBe('15/03/2004')
  expect(ngayLuuSangHienThi(null)).toBe('')
  expect(homQua(HOM_NAY)).toBe('2026-11-23')
  expect(chuanHoaHoTen('  Nguyễn   Văn  An ')).toBe('Nguyễn Văn An')
})

test('Thông tin hợp lệ và để trống được nhận', () => {
  expect(kiemTraThongTin(hopLe, 2, HOM_NAY)).toEqual({})
  expect(kiemTraThongTin({ ...hopLe, ho_ten: ' ', so_dien_thoai: '' }, 3, HOM_NAY)).toEqual({})
  expect(kiemTraThongTin({ ...hopLe, ngay_sinh: '01/01/1900' }, 2, HOM_NAY)).toEqual({})
})

test('Báo đúng câu từng ô', () => {
  expect(
    kiemTraThongTin(
      { ho_ten: 'An123', gmail: 'an@yahoo.com', so_dien_thoai: '091234567', nghe_nghiep: 'a'.repeat(101), ngay_sinh: '24/11/2026' },
      2,
      HOM_NAY,
    ),
  ).toEqual({
    ho_ten: 'Họ tên từ 2 đến 100 ký tự, chỉ gồm chữ và dấu cách',
    gmail: 'Gmail phải có đuôi @gmail.com',
    so_dien_thoai: 'Số điện thoại gồm 10 chữ số, bắt đầu bằng số 0',
    nghe_nghiep: 'Nghề nghiệp tối đa 100 ký tự',
    ngay_sinh: 'Ngày sinh không hợp lệ',
  })
  expect(kiemTraThongTin({ ...hopLe, ngay_sinh: '31/12/1899' }, 2, HOM_NAY).ngay_sinh).toBe('Ngày sinh không hợp lệ')
  // Người cung cấp, admin không có hai ô nghề nghiệp, ngày sinh
  expect(kiemTraThongTin({ ...hopLe, ngay_sinh: 'sai' }, 3, HOM_NAY)).toEqual({})
})

test('Đổi mật khẩu', () => {
  expect(kiemTraDoiMatKhau({ mat_khau_hien_tai: '', mat_khau_moi: '', xac_nhan: '' })).toEqual({
    mat_khau_hien_tai: 'Vui lòng nhập mật khẩu',
    mat_khau_moi: 'Vui lòng nhập mật khẩu',
    xac_nhan: 'Vui lòng nhập lại mật khẩu',
  })
  expect(kiemTraDoiMatKhau({ mat_khau_hien_tai: '123456', mat_khau_moi: '123', xac_nhan: '654321' })).toEqual({
    mat_khau_moi: 'Mật khẩu phải gồm đúng 6 chữ số',
    xac_nhan: 'Mật khẩu nhập lại không khớp',
  })
})
