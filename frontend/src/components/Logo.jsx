// Logo AVA, bấm về trang chủ ở mọi trang (Phần chung C9). Màu nét theo màu chữ của chỗ đặt logo.
import { Link } from 'react-router-dom'

function Logo({ co = 32, className = '' }) {
  return (
    <Link to="/" className={`logo ${className}`}>
      <svg width={co} height={co} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true">
        <circle cx="7" cy="25" r="3" className="logo-cham" />
        <path d="M10 25h8a6 6 0 0 0 0-12h-4a5 5 0 0 1 0-10h10" />
      </svg>
      <span>AVA</span>
    </Link>
  )
}

export default Logo
