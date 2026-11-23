// Lưu người đang đăng nhập để mọi trang dùng chung (Context API).
// Lúc mở web gọi GET /api/tai-khoan/toi (Phần 1 mục 1.3). Lỗi 401 TAI_KHOAN_BI_KHOA, DANG_NHAP_NOI_KHAC
// ở bất kỳ đường nào thì chuyển về trang đăng nhập, câu báo truyền qua state (Phần chung C4).
// Trang đăng nhập (Phần 3) gọi setNguoiDung với thông tin máy chủ trả về; dangXuat dùng ở mọi nút "Đăng xuất".
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from './authContext.js'
import { layNguoiXem, dangXuat as goiDangXuat } from '../api/taiKhoan.js'
import { datXuLyBiDayRa } from '../api/client.js'

export function AuthProvider({ children }) {
  const [nguoiDung, setNguoiDung] = useState(null) // null = khách (chưa đăng nhập)
  const [dangTai, setDangTai] = useState(true) // true khi chưa biết người xem là ai
  const navigate = useNavigate()

  const taiLai = useCallback(
    () =>
      layNguoiXem()
        .then(
          (kq) => setNguoiDung(kq.dang_nhap ? kq : null),
          () => setNguoiDung(null),
        )
        .finally(() => setDangTai(false)),
    [],
  )

  useEffect(() => {
    datXuLyBiDayRa((loi) => {
      setNguoiDung(null)
      navigate('/dang-nhap', { state: { cauBao: loi.message } })
    })
    taiLai()
  }, [navigate, taiLai])

  // Đăng xuất (Phần 3 mục 3.3): hủy phiên, về trang chủ. Máy chủ lỗi thì trang vẫn về khách.
  const dangXuat = useCallback(async () => {
    try {
      await goiDangXuat()
    } catch {
      // vẫn đưa về khách
    }
    navigate('/')
    setNguoiDung(null)
  }, [navigate])

  const giaTri = useMemo(
    () => ({ nguoiDung, setNguoiDung, dangTai, taiLai, dangXuat }),
    [nguoiDung, dangTai, taiLai, dangXuat],
  )

  return <AuthContext.Provider value={giaTri}>{children}</AuthContext.Provider>
}
