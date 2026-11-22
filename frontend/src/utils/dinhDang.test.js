// Kiểm thử hàm định dạng (Phần chung C10, C11): khung dự án và Phần 1 (P01-24 đến P01-27).
import { describe, expect, test } from 'vitest'
import {
  dinhDangTien,
  dinhDangNgay,
  dinhDangNgayGio,
  dinhDangMaDon,
  chuTrangThaiKhoaHoc,
  chuBienPhapBaoCaoKhoaHoc,
  chuBienPhapBaoCaoDanhGia,
  chuNguonDen,
} from './dinhDang.js'

describe('dinhDangTien', () => {
  test('1250000 thành "1.250.000đ"', () => {
    expect(dinhDangTien(1250000)).toBe('1.250.000đ')
  })

  test('P01-24 Hàm định dạng tiền', () => {
    expect(dinhDangTien(349000)).toBe('349.000đ')
    expect(dinhDangTien(1250000)).toBe('1.250.000đ')
    expect(dinhDangTien(0)).toBe('0đ')
  })
})

test('P01-25 Hàm định dạng ngày và ngày giờ', () => {
  expect(dinhDangNgay('2026-11-20T17:30:00Z')).toBe('21/11/2026')
  expect(dinhDangNgayGio('2026-11-20T17:30:00Z')).toBe('21/11/2026 00:30')
})

test('P01-26 Hàm mã đơn', () => {
  expect(dinhDangMaDon(7, '2026-11-21T09:00:00+07:00')).toBe('AVA-261121-0007')
  expect(dinhDangMaDon(12345, '2027-01-05T09:00:00+07:00')).toBe('AVA-270105-12345')
})

test('P01-27 Hàm chữ trạng thái', () => {
  expect(chuTrangThaiKhoaHoc('Bị ẩn', 'Tự ẩn')).toBe('Bị ẩn (tự ẩn)')
  expect(chuTrangThaiKhoaHoc('Bị ẩn', 'Admin ẩn')).toBe('Bị ẩn (admin ẩn)')
  expect(chuTrangThaiKhoaHoc('Bị ẩn', 'Hệ thống - khóa tài khoản')).toBe(
    'Bị ẩn (hệ thống - khóa tài khoản)',
  )
  expect(chuTrangThaiKhoaHoc('Bị gỡ vĩnh viễn', null)).toBe('Bị gỡ vĩnh viễn')
  expect(chuBienPhapBaoCaoKhoaHoc(null)).toBe('Chưa xử lý')
  expect(chuBienPhapBaoCaoKhoaHoc('Ẩn khóa')).toBe('Đã ẩn khóa')
  expect(chuBienPhapBaoCaoKhoaHoc('Gỡ vĩnh viễn')).toBe('Đã gỡ vĩnh viễn')
  expect(chuBienPhapBaoCaoDanhGia('Ẩn đánh giá')).toBe('Đã ẩn đánh giá')
  expect(chuNguonDen('Máy chủ cổng thanh toán', 'VNPay')).toBe('Máy chủ VNPay')
})
