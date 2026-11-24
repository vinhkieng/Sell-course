// Kiểm trước các ô của trang hồ sơ, cùng luật và cùng câu với máy chủ (Phần 5 mục 5.4, 5.7).
// Luật "học viên đã có đơn" và "người cung cấp đã đăng khóa" chỉ máy chủ kiểm.
import { VAI_TRO } from '../constants/vaiTro.js'
import { kiemTraGmail } from './kiemTraDangKy.js'

const NGAY_SINH_SAI = 'Ngày sinh không hợp lệ'

// Bỏ khoảng trắng thừa ở đầu, cuối và giữa (như máy chủ)
export const chuanHoaHoTen = (hoTen) => hoTen.normalize('NFC').replace(/\s+/g, ' ').trim()

// "15/03/2004" -> "2004-03-15"; rỗng -> ""; không phải ngày có thật -> null
export function ngayHienThiSangLuu(chu) {
  const thu = chu.trim()
  if (!thu) return ''
  const m = thu.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  if (!m) return null
  const luu = `${m[3]}-${m[2]}-${m[1]}`
  const ngay = new Date(`${luu}T00:00:00Z`)
  return !Number.isNaN(ngay.getTime()) && ngay.toISOString().slice(0, 10) === luu ? luu : null
}

// "2004-03-15" -> "15/03/2004"; null -> ""
export function ngayLuuSangHienThi(luu) {
  if (!luu) return ''
  const [nam, thang, ngay] = luu.split('-')
  return `${ngay}/${thang}/${nam}`
}

// Hôm qua theo giờ máy người xem, dạng yyyy-mm-dd: ngày sinh phải trước hôm nay
export function homQua(bayGio = new Date()) {
  const d = new Date(bayGio.getFullYear(), bayGio.getMonth(), bayGio.getDate() - 1)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// form: { ho_ten, gmail, so_dien_thoai, nghe_nghiep, ngay_sinh (dd/mm/yyyy) }. Trả { ten_o: câu lỗi }.
export function kiemTraThongTin(form, vaiTro, bayGio = new Date()) {
  const loi = {}
  const hoTen = chuanHoaHoTen(form.ho_ten)
  if (hoTen && !/^[\p{L} ]{2,100}$/u.test(hoTen)) loi.ho_ten = 'Họ tên từ 2 đến 100 ký tự, chỉ gồm chữ và dấu cách'

  const loiGmail = kiemTraGmail(form.gmail)
  if (loiGmail) loi.gmail = loiGmail

  const sdt = form.so_dien_thoai.trim()
  if (sdt && !/^0\d{9}$/.test(sdt)) loi.so_dien_thoai = 'Số điện thoại gồm 10 chữ số, bắt đầu bằng số 0'

  if (vaiTro === VAI_TRO.HOC_VIEN) {
    if (form.nghe_nghiep.trim().length > 100) loi.nghe_nghiep = 'Nghề nghiệp tối đa 100 ký tự'
    const ngaySinh = ngayHienThiSangLuu(form.ngay_sinh)
    if (ngaySinh === null || (ngaySinh && (ngaySinh < '1900-01-01' || ngaySinh > homQua(bayGio)))) {
      loi.ngay_sinh = NGAY_SINH_SAI
    }
  }
  return loi
}

// form: { mat_khau_hien_tai, mat_khau_moi, xac_nhan } (Phần 5 mục 5.4, 5.7)
export function kiemTraDoiMatKhau({ mat_khau_hien_tai, mat_khau_moi, xac_nhan }) {
  const loi = {}
  if (!mat_khau_hien_tai) loi.mat_khau_hien_tai = 'Vui lòng nhập mật khẩu'
  if (!mat_khau_moi) loi.mat_khau_moi = 'Vui lòng nhập mật khẩu'
  else if (!/^\d{6}$/.test(mat_khau_moi)) loi.mat_khau_moi = 'Mật khẩu phải gồm đúng 6 chữ số'
  if (!xac_nhan) loi.xac_nhan = 'Vui lòng nhập lại mật khẩu'
  else if (xac_nhan !== mat_khau_moi) loi.xac_nhan = 'Mật khẩu nhập lại không khớp'
  return loi
}
