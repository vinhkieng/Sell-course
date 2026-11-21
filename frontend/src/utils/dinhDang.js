// Định dạng hiển thị dùng chung (Phần chung C10). Phần 1 thêm các hàm còn lại
// (ngày giờ, mã đơn, điểm, chữ trạng thái) vào file này.

// Giờ Việt Nam cho mọi ngày hiển thị, không theo múi giờ của máy người xem
const MUI_GIO = 'Asia/Ho_Chi_Minh'

// 1250000 -> "1.250.000đ"
export function dinhDangTien(soTien) {
  return `${new Intl.NumberFormat('vi-VN').format(soTien)}đ`
}

// Chuỗi ngày giờ từ backend -> "12/10/2026"
export function dinhDangNgay(giaTri) {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: MUI_GIO,
  }).format(new Date(giaTri))
}
