// Kiểm hàm chuẩn hóa và kiểm tên danh mục (Phần 6 mục 6.4, 6.8)
import { expect, test } from 'vitest'
import { chuanHoaTenDanhMuc, kiemTraTenDanhMuc, TEN_DANH_MUC_SAI } from './kiemTraDanhMuc.js'

test('Chuẩn hóa tên danh mục', () => {
  expect(chuanHoaTenDanhMuc('  luyện   thi IELTS ')).toBe('Luyện Thi IELTS')
  expect(chuanHoaTenDanhMuc('c++')).toBe('C++')
  expect(chuanHoaTenDanhMuc('ui/ux')).toBe('Ui/ux')
  expect(chuanHoaTenDanhMuc('nấu ăn'.normalize('NFD'))).toBe('Nấu Ăn')
})

test('Tên danh mục đúng và sai luật', () => {
  for (const ten of ['C++', 'UI/UX', '3D', 'C#', 'Đồ Họa', 'a'.repeat(50)]) {
    expect(kiemTraTenDanhMuc(ten)).toBe('')
  }
  for (const ten of ['A', ' ', 'a'.repeat(51), 'Lập trình @Web', 'Thiết kế_UI', '中文 Cơ Bản', 'Tiếng Ж', 'Mañana']) {
    expect(kiemTraTenDanhMuc(ten)).toBe(TEN_DANH_MUC_SAI)
  }
})
