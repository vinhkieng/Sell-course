import { useEffect } from 'react'
import { useBlocker } from 'react-router-dom'

// Hỏi lại trước khi rời trang khi đang có dữ liệu chưa lưu (Phần 7 mục 7.3).
// Đóng tab, tải lại: hộp hỏi có sẵn của trình duyệt. Bấm liên kết trong web: trả về blocker để trang tự hiện hộp
// (blocker.state === 'blocked', đồng ý thì blocker.proceed(), ở lại thì blocker.reset()).
// Chuyển trang có state.boQuaHoiRoiTrang (đăng xuất, bị đẩy ra, đăng xong) thì không hỏi.
export function useHoiKhiRoiTrang(coDuLieu) {
  useEffect(() => {
    if (!coDuLieu) return undefined
    const hoi = (e) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', hoi)
    return () => window.removeEventListener('beforeunload', hoi)
  }, [coDuLieu])

  return useBlocker(
    ({ currentLocation, nextLocation }) =>
      coDuLieu &&
      !nextLocation.state?.boQuaHoiRoiTrang &&
      (currentLocation.pathname !== nextLocation.pathname || currentLocation.search !== nextLocation.search),
  )
}
