import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Proxy: mọi đường dẫn bắt đầu bằng /api được chuyển sang backend (http://localhost:8000), Phần chung C2.
// Nhờ vậy trình duyệt coi frontend và backend như cùng một địa chỉ: cookie đăng nhập,
// video và ảnh từ backend chạy bình thường, không phải ghi cứng địa chỉ backend trong code.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Cổng 5173 đang bận thì báo lỗi, không tự đổi sang cổng khác
    // (đổi cổng thì backend chặn yêu cầu ghi dữ liệu vì khác CLIENT_ORIGIN)
    strictPort: true,
    // Mở cho máy khác trong cùng mạng wifi (mạng LAN), để thử bằng điện thoại (Phần chung C4)
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        // Chuyển kèm địa chỉ thật của máy gửi yêu cầu (tiêu đề X-Forwarded-For), Phần chung C4
        xfwd: true,
      },
    },
  },
  test: {
    // Kiểm thử frontend chỉ kiểm hàm thuần tính toán và định dạng (Phần chung C2), đặt cạnh file hàm, đuôi .test.js
    include: ['src/**/*.test.js'],
  },
})
