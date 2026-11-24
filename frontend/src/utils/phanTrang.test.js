// Kiểm hàm của thanh phân trang (Phần chung C16, C18)
import { expect, test } from 'vitest'
import { cacSoTrang, moTaPhanTrang } from './phanTrang.js'

test('Số trang hiện ở thanh phân trang', () => {
  expect(cacSoTrang(1, 1)).toEqual([1])
  expect(cacSoTrang(2, 7)).toEqual([1, 2, 3, 4, 5, 6, 7])
  expect(cacSoTrang(1, 10)).toEqual([1, 2, 3, null, 10])
  expect(cacSoTrang(5, 10)).toEqual([1, null, 4, 5, 6, null, 10])
  expect(cacSoTrang(10, 10)).toEqual([1, null, 8, 9, 10])
})

test('Dòng mô tả dưới bảng', () => {
  expect(moTaPhanTrang(1, 13, 20, 'danh mục')).toBe('Hiển thị 1-13 trên 13 danh mục (20 dòng mỗi trang)')
  expect(moTaPhanTrang(2, 45, 20, 'danh mục')).toBe('Hiển thị 21-40 trên 45 danh mục (20 dòng mỗi trang)')
  expect(moTaPhanTrang(1, 0, 20, 'danh mục')).toBe('Hiển thị 0 danh mục (20 dòng mỗi trang)')
})
