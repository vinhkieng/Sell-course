import { useEffect, useState } from 'react'

// Đếm ngược tới mốc hetLuc (mili giây, theo Date.now()): trả số giây còn lại, cập nhật mỗi giây.
// Dùng cho "Gửi lại mã" ở trang xác nhận đăng nhập (Phần 3) và đặt lại mật khẩu (Phần 4).
export function useDemNguoc(hetLuc) {
  const [bayGio, setBayGio] = useState(() => Date.now())

  useEffect(() => {
    const hen = setInterval(() => setBayGio(Date.now()), 1000)
    return () => clearInterval(hen)
  }, [])

  return Math.max(0, Math.ceil((hetLuc - bayGio) / 1000))
}
