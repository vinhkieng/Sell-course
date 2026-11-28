// Bộ bắt lỗi: một trang bị lỗi nặng thì chỉ trang đó hiện thông báo, cả web không bị trắng.
// React chỉ cho viết bộ bắt lỗi dưới dạng class.
import { Component } from 'react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="khung-noi-dung trang-bao-loi">
          <h1>Có lỗi xảy ra</h1>
          <p>Trang gặp sự cố khi hiển thị. Bạn hãy tải lại trang.</p>
          <button type="button" className="nut-chinh" onClick={() => window.location.reload()}>
            Tải lại trang
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary
