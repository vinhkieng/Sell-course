import client from './client.js'

// { dang_nhap: false } hoặc thông tin người đang đăng nhập (Phần 1 mục 1.4)
export const layNguoiXem = () => client.get('/tai-khoan/toi')

// Phần 2 mục 2.5: thành công trả 201 không kèm nội dung
export const dangKy = (duLieu) => client.post('/tai-khoan/dang-ky', duLieu)

// Phần 3 mục 3.5. Đăng nhập và đăng xuất tự xử lý lỗi bị khóa ngay trên trang, không chuyển trang như Phần 1.
export const dangNhap = (duLieu) =>
  client.post('/tai-khoan/dang-nhap', duLieu, { boQuaBiDayRa: true })
export const xacNhanDangNhap = (ma) => client.post('/tai-khoan/xac-nhan-dang-nhap', { ma })
export const guiLaiMaDangNhap = () => client.post('/tai-khoan/gui-lai-ma-dang-nhap')
export const dangXuat = () => client.post('/tai-khoan/dang-xuat', null, { boQuaBiDayRa: true })
