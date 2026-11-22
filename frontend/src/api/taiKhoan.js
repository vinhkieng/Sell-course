import client from './client.js'

// { dang_nhap: false } hoặc thông tin người đang đăng nhập (Phần 1 mục 1.4)
export const layNguoiXem = () => client.get('/tai-khoan/toi')
