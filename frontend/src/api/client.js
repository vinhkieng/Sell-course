// Mọi lời gọi backend đi qua file này. Component không gọi axios trực tiếp.
import axios from 'axios'
import { ApiError } from './ApiError.js'

const client = axios.create({
  baseURL: '/api', // proxy của Vite chuyển sang backend
  withCredentials: true, // gửi kèm cookie đăng nhập
})

// Phiên hết hiệu lực vì tài khoản bị khóa hoặc đã đăng nhập nơi khác (Phần chung C4).
// AuthProvider đăng ký hàm xử lý (chuyển về trang đăng nhập kèm câu báo).
const MA_BI_DAY_RA = ['TAI_KHOAN_BI_KHOA', 'DANG_NHAP_NOI_KHAC']
let xuLyBiDayRa = null
export function datXuLyBiDayRa(ham) {
  xuLyBiDayRa = ham
}

// Thành công: backend trả thẳng dữ liệu (Phần chung C6), nơi gọi nhận luôn dữ liệu đó.
// Lỗi: backend trả { loi, ma, cac_o, ...các trường thêm }, đổi thành ApiError để trang dùng thống nhất.
client.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const noiDung = error.response?.data
    if (noiDung && typeof noiDung.loi === 'string') {
      const loi = new ApiError({ status: error.response.status, ...noiDung })
      // boQuaBiDayRa: lời gọi tự hiện lỗi tại chỗ (ví dụ trang đăng nhập hiện câu bị khóa phía trên nút)
      if (loi.status === 401 && MA_BI_DAY_RA.includes(loi.ma) && !error.config?.boQuaBiDayRa) {
        xuLyBiDayRa?.(loi)
      }
      return Promise.reject(loi)
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
