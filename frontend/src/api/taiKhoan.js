import client from './client.js'

// { dang_nhap: false } hoặc thông tin người đang đăng nhập (Phần 1 mục 1.4)
export const layNguoiXem = () => client.get('/tai-khoan/toi')

// Phần 2 mục 2.5: thành công trả 201 không kèm nội dung
export const dangKy = (duLieu) => client.post('/tai-khoan/dang-ky', duLieu)
