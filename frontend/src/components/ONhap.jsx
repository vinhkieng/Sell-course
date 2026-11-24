// Một ô nhập của các trang tài khoản: nhãn, ô, rồi chữ gợi ý hoặc chữ lỗi bên dưới (lỗi thay chỗ chữ gợi ý).
// Các thuộc tính còn lại (type, value, onChange...) chuyển thẳng vào thẻ input.
import './ONhap.css'

function ONhap({ nhan, loi, goiY, ...thuocTinh }) {
  return (
    <label className={`tk-o${loi ? ' co-loi' : ''}`}>
      {nhan}
      <input className="tk-o-nhap" {...thuocTinh} />
      {(loi || goiY) && <span className={`tk-goi-y${loi ? ' loi' : ''}`}>{loi || goiY}</span>}
    </label>
  )
}

export default ONhap
