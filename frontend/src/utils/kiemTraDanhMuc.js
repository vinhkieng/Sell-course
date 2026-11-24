// Chuẩn hóa và kiểm tên danh mục ở trình duyệt, cùng luật và cùng câu với máy chủ
// (backend/validators/danhMucValidator.js, Phần 6 mục 6.4, 6.8). Phần 7 dùng lại.
// Luật không trùng tên chỉ máy chủ kiểm.
import { CHU_VIET } from './chuViet.js'

export const TEN_DANH_MUC_SAI =
  'Tên danh mục từ 2 đến 50 ký tự, gồm chữ có dấu hoặc không dấu, chữ số, khoảng trắng và các ký tự + # . / -'
const TEN_DUNG = new RegExp(`^[${CHU_VIET}0-9 +#./-]{2,50}$`)

// "  luyện   thi IELTS " thành "Luyện Thi IELTS": bỏ khoảng trắng thừa, viết hoa chữ đầu mỗi từ, chữ khác giữ nguyên
export function chuanHoaTenDanhMuc(ten) {
  return ten
    .normalize('NFC')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .map((tu) => tu.charAt(0).toUpperCase() + tu.slice(1))
    .join(' ')
}

// Trả câu lỗi, hoặc '' khi tên hợp lệ
export const kiemTraTenDanhMuc = (ten) => (TEN_DUNG.test(chuanHoaTenDanhMuc(ten)) ? '' : TEN_DANH_MUC_SAI)
