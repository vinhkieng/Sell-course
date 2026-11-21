import { createContext } from 'react'

// Context chứa người đang đăng nhập. Dùng qua hook useAuth() trong hooks/useAuth.js
export const AuthContext = createContext(null)
