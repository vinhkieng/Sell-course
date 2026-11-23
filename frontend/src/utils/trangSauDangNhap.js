// Trang mở sau khi đăng nhập hoặc xác nhận mã xong (Phần 3 mục 3.3).
// quay_lai chỉ nhận đường dẫn nội bộ bắt đầu bằng đúng một "/" (Phần chung C5): loại "//trang-la.vn",
// "/\trang-la.vn", địa chỉ trang khác và ký tự điều khiển (trình duyệt bỏ tab, xuống dòng nên "/\t/x" thành "//x").
import { VAI_TRO } from '../constants/vaiTro.js'

const TRANG_THEO_VAI_TRO = {
  [VAI_TRO.ADMIN]: '/quan-tri/khoa-hoc',
  [VAI_TRO.NGUOI_CUNG_CAP]: '/ho-so#quan-ly-khoa-hoc',
  [VAI_TRO.HOC_VIEN]: '/',
}

// eslint-disable-next-line no-control-regex -- cố ý tìm ký tự điều khiển
const DUONG_DAN_NOI_BO = /^\/(?![/\\])[^\\\u0000-\u001f\u007f]*$/

export function trangSauDangNhap(quayLai, vaiTro) {
  if (typeof quayLai === 'string' && DUONG_DAN_NOI_BO.test(quayLai)) return quayLai
  return TRANG_THEO_VAI_TRO[vaiTro] ?? '/'
}
