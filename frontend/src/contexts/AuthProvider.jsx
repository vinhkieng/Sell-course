// Lưu người đang đăng nhập để mọi trang dùng chung (Context API).
// Phần 3 (đăng nhập) bổ sung: khi mở web gọi máy chủ lấy người đang đăng nhập,
// hàm đăng nhập, đăng xuất và xử lý lỗi 401 TAI_KHOAN_BI_KHOA, DANG_NHAP_NOI_KHAC (Phần chung C4).
import { useMemo, useState } from 'react'
import { AuthContext } from './authContext.js'

export function AuthProvider({ children }) {
  const [nguoiDung, setNguoiDung] = useState(null) // null = khách (chưa đăng nhập)

  const giaTri = useMemo(() => ({ nguoiDung, setNguoiDung }), [nguoiDung])

  return <AuthContext.Provider value={giaTri}>{children}</AuthContext.Provider>
}
