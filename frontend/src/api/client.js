// Mọi lời gọi backend đi qua file này. Component không gọi axios trực tiếp.
import axios from 'axios'
import { ApiError } from './ApiError.js'

const client = axios.create({
  baseURL: '/api', // proxy của Vite chuyển sang backend
  withCredentials: true, // gửi kèm cookie đăng nhập
})

// Thành công: backend trả thẳng dữ liệu (Phần chung C6), nơi gọi nhận luôn dữ liệu đó.
// Lỗi: backend trả { loi, ma, cac_o, ...các trường thêm }, đổi thành ApiError để trang dùng thống nhất.
client.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const noiDung = error.response?.data
    if (noiDung && typeof noiDung.loi === 'string') {
      return Promise.reject(new ApiError({ status: error.response.status, ...noiDung }))
    }
    return Promise.reject(
      new ApiError({
        status: error.response?.status ?? 0,
        loi: 'Không kết nối được máy chủ, vui lòng thử lại sau.',
      }),
    )
  },
)

export default client
