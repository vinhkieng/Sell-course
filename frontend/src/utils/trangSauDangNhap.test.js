// Kiểm hàm chọn trang sau khi đăng nhập (Phần 3 mục 3.3, Phần chung C5)
import { expect, test } from 'vitest'
import { trangSauDangNhap } from './trangSauDangNhap.js'

test('quay_lai nội bộ hợp lệ thì về đó', () => {
  expect(trangSauDangNhap('/gio-hang', 2)).toBe('/gio-hang')
  expect(trangSauDangNhap('/ho-so#rut-tien', 3)).toBe('/ho-so#rut-tien')
  expect(trangSauDangNhap('/khoa-hoc?tu_khoa=figma', 2)).toBe('/khoa-hoc?tu_khoa=figma')
})

test('Không có quay_lai thì về trang theo vai trò', () => {
  expect(trangSauDangNhap(null, 2)).toBe('/')
  expect(trangSauDangNhap(null, 3)).toBe('/ho-so#quan-ly-khoa-hoc')
  expect(trangSauDangNhap('', 1)).toBe('/quan-tri/khoa-hoc')
})

test('Loại mọi đường dẫn không bắt đầu bằng đúng một "/"', () => {
  for (const sai of ['//trang-la.vn', '/\\trang-la.vn', 'https://trang-la.vn', 'trang-la.vn', '/\t/trang-la.vn', '/a\\b']) {
    expect(trangSauDangNhap(sai, 2)).toBe('/')
  }
})
