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

// Các phần ngày giờ theo giờ Việt Nam: { day, month, year, hour, minute } đều là chuỗi 2 chữ số (year 4)
function phanNgayGio(giaTri) {
  const phan = {}
  for (const { type, value } of new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
    timeZone: MUI_GIO,
  }).formatToParts(new Date(giaTri))) {
    phan[type] = value
  }
  return phan
}

// "2026-11-20T17:30:00Z" -> "21/11/2026 00:30"
export function dinhDangNgayGio(giaTri) {
  const p = phanNgayGio(giaTri)
  return `${p.day}/${p.month}/${p.year} ${p.hour}:${p.minute}`
}

// Mã đơn AVA-yymmdd-nnnn từ don_hang.id và don_hang.ngay_tao (Phần chung C10)
export function dinhDangMaDon(id, ngayTao) {
  const p = phanNgayGio(ngayTao)
  return `AVA-${p.year.slice(2)}${p.month}${p.day}-${String(id).padStart(4, '0')}`
}

// Chữ hiển thị của giá trị lưu trong database (Phần chung C11)
const CHU_AN_BOI = {
  'Tự ẩn': 'Bị ẩn (tự ẩn)',
  'Admin ẩn': 'Bị ẩn (admin ẩn)',
  'Hệ thống - khóa tài khoản': 'Bị ẩn (hệ thống - khóa tài khoản)',
}

export function chuTrangThaiKhoaHoc(trangThai, biAnBoi) {
  return trangThai === 'Bị ẩn' ? CHU_AN_BOI[biAnBoi] : trangThai
}

export function chuBienPhapBaoCaoKhoaHoc(bienPhap) {
  return (
    { 'Ẩn khóa': 'Đã ẩn khóa', 'Gỡ vĩnh viễn': 'Đã gỡ vĩnh viễn' }[bienPhap] ??
    bienPhap ??
    'Chưa xử lý'
  )
}

export function chuBienPhapBaoCaoDanhGia(bienPhap) {
  return bienPhap === 'Ẩn đánh giá' ? 'Đã ẩn đánh giá' : (bienPhap ?? 'Chưa xử lý')
}

// tenCong lấy từ cong_thanh_toan.ten, không viết cứng "VNPay"
export function chuNguonDen(nguonDen, tenCong) {
  return nguonDen === 'Máy chủ cổng thanh toán' ? `Máy chủ ${tenCong}` : nguonDen
}

// Chữ cái đầu trên ảnh đại diện: của họ tên, họ tên trống thì của tên đăng nhập (Phần chung C9)
export function layChuCaiDau(hoTen, tenDangNhap) {
  return ((hoTen ?? '').trim() || tenDangNhap).charAt(0).toUpperCase()
}

// Tên hiện trong menu ảnh đại diện: họ tên, họ tên trống thì tên đăng nhập
export function tenHienThi(nguoiDung) {
  return (nguoiDung.ho_ten ?? '').trim() || nguoiDung.ten_dang_nhap
}
