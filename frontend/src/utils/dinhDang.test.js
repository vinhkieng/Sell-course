// Kiểm thử hạ tầng của khung dự án (không phải kiểm thử chức năng): hàm định dạng tiền (Phần chung C10).
import { describe, expect, test } from 'vitest'
import { dinhDangTien } from './dinhDang.js'

describe('dinhDangTien', () => {
  test('1250000 thành "1.250.000đ"', () => {
    expect(dinhDangTien(1250000)).toBe('1.250.000đ')
  })
})
