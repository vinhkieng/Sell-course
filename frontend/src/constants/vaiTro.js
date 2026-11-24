// Giá trị nguoi_dung.vai_tro, khớp backend và file SQL (Phần chung C4).
// Chữ hiển thị của vai trò ở từng trang lấy đúng chữ trong thiết kế của trang đó.
export const VAI_TRO = Object.freeze({
  ADMIN: 1,
  HOC_VIEN: 2,
  NGUOI_CUNG_CAP: 3,
})

// Chữ trên nhãn vai trò ở menu ảnh đại diện và thẻ hồ sơ (thiet_ke/chung/, thiet_ke/ho_so/)
export const TEN_VAI_TRO = Object.freeze({
  [VAI_TRO.ADMIN]: 'Quản trị viên',
  [VAI_TRO.HOC_VIEN]: 'Học viên',
  [VAI_TRO.NGUOI_CUNG_CAP]: 'Người cung cấp khóa học',
})
