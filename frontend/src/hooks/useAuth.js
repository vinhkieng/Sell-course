import { useContext } from 'react'
import { AuthContext } from '../contexts/authContext.js'

// Lấy người đang đăng nhập: const { nguoiDung } = useAuth(); nguoiDung = null nghĩa là khách
export function useAuth() {
  const giaTri = useContext(AuthContext)
  if (!giaTri) {
    throw new Error('useAuth phải dùng bên trong AuthProvider')
  }
  return giaTri
}
