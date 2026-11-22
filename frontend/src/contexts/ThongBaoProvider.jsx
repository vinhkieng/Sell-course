// Ô thông báo nhỏ góc dưới bên phải, tự tắt sau 5 giây (Phần chung C9).
// Kiểu xanh lấy từ khung "Đã gửi báo cáo" (thiet_ke/danh_gia_bao_cao/bao_cao_thanh_cong.html), thêm kiểu đỏ cho lỗi.
import { useCallback, useState } from 'react'
import { ThongBaoContext } from './thongBaoContext.js'
import './ThongBaoProvider.css'

let soThuTu = 0

export function ThongBaoProvider({ children }) {
  const [danhSach, setDanhSach] = useState([])

  // loai: 'thanh-cong' (mặc định) hoặc 'loi'
  const hienThongBao = useCallback((chu, loai = 'thanh-cong') => {
    soThuTu += 1
    const id = soThuTu
    setDanhSach((cu) => [...cu, { id, chu, loai }])
    setTimeout(() => setDanhSach((cu) => cu.filter((tb) => tb.id !== id)), 5000)
  }, [])

  return (
    <ThongBaoContext.Provider value={hienThongBao}>
      {children}
      <div className="thong-bao-nho" aria-live="polite">
        {danhSach.map((tb) => (
          <div key={tb.id} className={`thong-bao-nho-o ${tb.loai}`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              {tb.loai === 'loi' ? <path d="M12 7v6M12 17h.01" /> : <path d="m8 12 3 3 5-6" />}
            </svg>
            {tb.chu}
          </div>
        ))}
      </div>
    </ThongBaoContext.Provider>
  )
}
