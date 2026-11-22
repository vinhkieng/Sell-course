import { useContext } from 'react'
import { ThongBaoContext } from '../contexts/thongBaoContext.js'

// Hiện ô thông báo nhỏ góc dưới phải (Phần chung C9):
//   const hienThongBao = useThongBao(); hienThongBao('Đã thêm vào giỏ hàng'); hienThongBao('...', 'loi')
// Gọi trước khi chuyển trang vẫn hiện ở trang mới vì ô thông báo nằm ngoài các trang.
export function useThongBao() {
  return useContext(ThongBaoContext)
}
