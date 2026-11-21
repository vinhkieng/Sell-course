// Cuộn trang khi chuyển trang: đường dẫn có #ten-phan thì cuộn tới phần có id đó
// (ví dụ /chinh-sach#dieu-1, /ho-so#lich-su-don-hang ở Phần chung C7), không có thì cuộn lên đầu trang.
// Neo sai (không có phần nào mang id đó, hoặc chữ sau dấu # hỏng) thì ở đầu trang, không báo lỗi.
// Component này không hiển thị gì, đặt một lần trong App.jsx.
import { useEffect, useRef } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'

// Đọc chữ sau dấu #. Chữ hỏng (ví dụ #%E0%A4) thì decodeURIComponent báo lỗi: coi như không có neo.
function docNeo(hash) {
  if (!hash) return ''
  try {
    return decodeURIComponent(hash.slice(1))
  } catch {
    return ''
  }
}

function CuonTrang() {
  const { pathname, hash, key } = useLocation()
  const kieuChuyen = useNavigationType()
  const trangTruoc = useRef(null)

  useEffect(() => {
    const cungTrang = trangTruoc.current === pathname
    trangTruoc.current = pathname
    const neo = docNeo(hash)

    // POP là bấm Quay lại / Tiến tới của trình duyệt, hoặc vừa mở trang (gõ địa chỉ, tải lại).
    // Quay lại / Tiến tới thì để trình duyệt tự giữ vị trí cũ. Riêng lúc vừa mở trang
    // (key là 'default') mà địa chỉ có #ten-phan thì vẫn cuộn tới phần đó.
    if (kieuChuyen === 'POP') {
      if (key !== 'default' || !neo) return undefined
    } else if (!neo) {
      window.scrollTo(0, 0)
      return undefined
    } else if (!cungTrang) {
      // Sang trang khác có #ten-phan: bắt đầu từ đầu trang rồi cuộn tới phần đó khi nó hiện ra.
      // Bấm neo ngay trong trang đang mở thì cuộn thẳng tới phần đó, không nhảy lên đầu trước.
      window.scrollTo(0, 0)
    }

    // Phần cần cuộn tới có thể chưa hiện ngay (trang còn đang tải dữ liệu) nên thử lại vài lần
    let soLanThu = 0
    const hen = setInterval(() => {
      const phan = document.getElementById(neo)
      soLanThu += 1
      if (phan) phan.scrollIntoView({ behavior: 'smooth' })
      if (phan || soLanThu >= 20) clearInterval(hen)
    }, 100)
    return () => clearInterval(hen)
    // Có key: bấm lại đúng link đang mở (cùng địa chỉ) vẫn cuộn lại
  }, [pathname, hash, key, kieuChuyen])

  return null
}

export default CuonTrang
