// Dữ liệu dùng chung cho kiểm thử. Lệnh npm test (scripts/kiemThu.js) đã tạo sẵn admin này
// trong database ava_test trước khi chạy các file kiểm thử.
export const ADMIN_KIEM_THU = {
  tenDangNhap: 'adminkiemthu',
  gmail: 'adminkiemthu@gmail.com',
  matKhau: '123456',
};

// Origin hợp lệ khi gửi yêu cầu ghi dữ liệu (POST, PUT, PATCH, DELETE) trong kiểm thử (Phần chung C6)
export const ORIGIN_HOP_LE = process.env.CLIENT_ORIGIN || 'http://localhost:5173';
