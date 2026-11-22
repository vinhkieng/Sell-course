// Dữ liệu cho khung trang dùng chung (Phần 1 mục 1.4)
import client from './client.js'

export const layMenuDanhMuc = () => client.get('/danh-muc/menu')
export const layCongThanhToan = () => client.get('/cong-thanh-toan/mac-dinh')
export const laySoChoXuLy = () => client.get('/quan-tri/so-cho-xu-ly')
export const layChinhSach = () => client.get('/chinh-sach')
