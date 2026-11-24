// Hộp thoại dùng chung: lớp tối phủ trang, hộp trắng có tiêu đề, nội dung và hàng nút bên phải.
// Theo các hộp ở thiet_ke/quan_tri_danh_muc/. Bấm "Hủy", phím Esc hoặc bấm ra lớp tối đều gọi onDong,
// trừ khi đang gửi (dangGui) để không đóng giữa chừng.
import { useEffect, useId } from 'react'
import './HopThoai.css'

function HopThoai({ tieuDe, onDong, dangGui = false, cacNut, children }) {
  const idTieuDe = useId()

  useEffect(() => {
    const bamPhim = (e) => {
      if (e.key === 'Escape' && !dangGui) onDong()
    }
    document.addEventListener('keydown', bamPhim)
    return () => document.removeEventListener('keydown', bamPhim)
  }, [onDong, dangGui])

  return (
    <div
      className="hop-thoai-phu"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !dangGui) onDong()
      }}
    >
      <div className="hop-thoai" role="dialog" aria-modal="true" aria-labelledby={idTieuDe}>
        <h2 id={idTieuDe}>{tieuDe}</h2>
        {children}
        <div className="hop-thoai-nut">{cacNut}</div>
      </div>
    </div>
  )
}

export default HopThoai
