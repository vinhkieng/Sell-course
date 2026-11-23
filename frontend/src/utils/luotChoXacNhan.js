// Lượt đăng nhập đang chờ xác nhận mã (Phần 3): Gmail đã che và thời điểm hết đếm ngược "Gửi lại mã".
// Lưu ở sessionStorage để tải lại trang /xac-nhan-dang-nhap vẫn còn. Trình duyệt chặn sessionStorage thì bỏ qua.
const KHOA = 'ava_cho_xac_nhan'

// gmailChe: "a***@gmail.com"; giayChoGuiLai: số giây còn phải đợi mới được gửi lại
export function luuLuotCho(gmailChe, giayChoGuiLai) {
  const luot = { gmail_che: gmailChe, het_dem_luc: Date.now() + giayChoGuiLai * 1000 }
  try {
    sessionStorage.setItem(KHOA, JSON.stringify(luot))
  } catch {
    // vẫn dùng được nhờ state của bộ chuyển trang
  }
  return luot
}

export function docLuotCho() {
  try {
    const luot = JSON.parse(sessionStorage.getItem(KHOA))
    return typeof luot?.gmail_che === 'string' && typeof luot.het_dem_luc === 'number' ? luot : null
  } catch {
    return null
  }
}

export function xoaLuotCho() {
  try {
    sessionStorage.removeItem(KHOA)
  } catch {
    // không có gì để xóa
  }
}
