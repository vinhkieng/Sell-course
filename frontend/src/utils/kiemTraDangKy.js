// Kiểm trước các ô của trang đăng ký, cùng luật và cùng câu với máy chủ (Phần 2 mục 2.4, 2.7).
// Trả { ten_o: câu lỗi }; rỗng là hợp lệ.
import { VAI_TRO } from '../constants/vaiTro.js'

export function kiemTraDangKy({ ten_dang_nhap, gmail, mat_khau, xac_nhan_mat_khau, vai_tro, dong_y }) {
  const loi = {}

  const ten = ten_dang_nhap.trim()
  if (!ten) loi.ten_dang_nhap = 'Vui lòng nhập tên đăng nhập'
  else if (!/^[A-Za-z0-9]{4,30}$/.test(ten)) {
    loi.ten_dang_nhap =
      'Tên đăng nhập chỉ gồm chữ không dấu và số, không có khoảng trắng, dấu hay ký tự đặc biệt (4 đến 30 ký tự)'
  }

  // Đổi chữ thường trước khi kiểm, như máy chủ
  const thu = gmail.trim().toLowerCase()
  if (!thu) loi.gmail = 'Vui lòng nhập Gmail'
  else if (!thu.endsWith('@gmail.com')) loi.gmail = 'Gmail phải có đuôi @gmail.com'
  else if (!/^[a-z0-9]+(\.[a-z0-9]+)*@gmail\.com$/.test(thu)) {
    loi.gmail = 'Gmail không đúng định dạng. Ví dụ: ten@gmail.com'
  }

  if (!mat_khau) loi.mat_khau = 'Vui lòng nhập mật khẩu'
  else if (!/^\d{6}$/.test(mat_khau)) loi.mat_khau = 'Mật khẩu phải gồm đúng 6 chữ số'

  if (!xac_nhan_mat_khau) loi.xac_nhan_mat_khau = 'Vui lòng nhập lại mật khẩu'
  else if (xac_nhan_mat_khau !== mat_khau) loi.xac_nhan_mat_khau = 'Mật khẩu nhập lại không khớp'

  if (vai_tro !== VAI_TRO.HOC_VIEN && vai_tro !== VAI_TRO.NGUOI_CUNG_CAP) {
    loi.vai_tro = 'Vui lòng chọn vai trò'
  }
  if (dong_y !== true) loi.dong_y = 'Vui lòng đồng ý với Chính sách và điều khoản'

  return loi
}
