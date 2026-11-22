// Kiểm hàm kiểm ô ở trang đăng ký (Phần 2 mục 2.4, 2.7)
import { expect, test } from 'vitest'
import { kiemTraDangKy } from './kiemTraDangKy.js'

const hopLe = {
  ten_dang_nhap: 'An01',
  gmail: 'an01@gmail.com',
  mat_khau: '123456',
  xac_nhan_mat_khau: '123456',
  vai_tro: 2,
  dong_y: true,
}

test('Dữ liệu hợp lệ không có lỗi; Gmail viết hoa vẫn được nhận', () => {
  expect(kiemTraDangKy(hopLe)).toEqual({})
  expect(kiemTraDangKy({ ...hopLe, gmail: 'Abc@GMAIL.com', vai_tro: 3 })).toEqual({})
})

test('Để trống mọi ô thì báo đủ 6 câu', () => {
  expect(
    kiemTraDangKy({ ten_dang_nhap: ' ', gmail: '', mat_khau: '', xac_nhan_mat_khau: '', vai_tro: null, dong_y: false }),
  ).toEqual({
    ten_dang_nhap: 'Vui lòng nhập tên đăng nhập',
    gmail: 'Vui lòng nhập Gmail',
    mat_khau: 'Vui lòng nhập mật khẩu',
    xac_nhan_mat_khau: 'Vui lòng nhập lại mật khẩu',
    vai_tro: 'Vui lòng chọn vai trò',
    dong_y: 'Vui lòng đồng ý với Chính sách và điều khoản',
  })
})

test('Sai định dạng như màn dang_ky_sai_dinh_dang.html', () => {
  expect(
    kiemTraDangKy({ ...hopLe, ten_dang_nhap: 'Nguyen Van A!', gmail: 'an.nguyen@yahoo.com', mat_khau: '123', xac_nhan_mat_khau: '654321' }),
  ).toEqual({
    ten_dang_nhap:
      'Tên đăng nhập chỉ gồm chữ không dấu và số, không có khoảng trắng, dấu hay ký tự đặc biệt (4 đến 30 ký tự)',
    gmail: 'Gmail phải có đuôi @gmail.com',
    mat_khau: 'Mật khẩu phải gồm đúng 6 chữ số',
    xac_nhan_mat_khau: 'Mật khẩu nhập lại không khớp',
  })
  expect(kiemTraDangKy({ ...hopLe, gmail: 'an..01@gmail.com' }).gmail).toBe(
    'Gmail không đúng định dạng. Ví dụ: ten@gmail.com',
  )
})
