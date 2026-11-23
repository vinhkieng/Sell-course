// Lượt đang chờ nhập mã gửi qua Gmail: Gmail hiện trên trang và thời điểm hết đếm ngược "Gửi lại mã".
// Lưu ở sessionStorage để tải lại trang vẫn còn. Trình duyệt chặn sessionStorage thì bỏ qua.
// Hai lượt dùng hai tên khóa lưu riêng:
export const LUOT_XAC_NHAN_DANG_NHAP = 'ava_cho_xac_nhan' // Phần 3, gmail là Gmail đã che
export const LUOT_DAT_LAI_MAT_KHAU = 'ava_dat_lai_mat_khau' // Phần 4, gmail là Gmail người dùng đã nhập

// Trả { gmail, het_dem_luc } để truyền luôn qua state của bộ chuyển trang
export function luuLuotCho(khoa, gmail, giayChoGuiLai) {
  const luot = { gmail, het_dem_luc: Date.now() + giayChoGuiLai * 1000 }
  try {
    sessionStorage.setItem(khoa, JSON.stringify(luot))
  } catch {
    // vẫn dùng được nhờ state của bộ chuyển trang
  }
  return luot
}

export function docLuotCho(khoa) {
  try {
    const luot = JSON.parse(sessionStorage.getItem(khoa))
    return typeof luot?.gmail === 'string' && typeof luot.het_dem_luc === 'number' ? luot : null
  } catch {
    return null
  }
}

export function xoaLuotCho(khoa) {
  try {
    sessionStorage.removeItem(khoa)
  } catch {
    // không có gì để xóa
  }
}
