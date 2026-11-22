// Khung trang công khai: đầu trang + nội dung + chân trang (Phần chung C9).
// Dùng làm route cha (nội dung là <Outlet />) hoặc bọc trực tiếp (children), ví dụ trang 403 của khu quản trị.
import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { layMenuDanhMuc, layCongThanhToan } from '../api/khung.js'
import DauTrang from './DauTrang.jsx'
import ChanTrang from './ChanTrang.jsx'
import './KhungCongKhai.css'

function KhungCongKhai({ children }) {
  const [danhMuc, setDanhMuc] = useState([])
  const [tenCong, setTenCong] = useState('')

  useEffect(() => {
    // Lỗi mạng thì menu và chân trang để trống phần dữ liệu, trang vẫn dùng được
    layMenuDanhMuc().then(setDanhMuc, () => {})
    layCongThanhToan().then((cong) => setTenCong(cong?.ten ?? ''), () => {})
  }, [])

  return (
    <div className="khung-cong-khai">
      <DauTrang danhMuc={danhMuc} />
      <div className="khung-cong-khai-giua">{children ?? <Outlet />}</div>
      <ChanTrang danhMuc={danhMuc} tenCong={tenCong} />
    </div>
  )
}

export default KhungCongKhai
