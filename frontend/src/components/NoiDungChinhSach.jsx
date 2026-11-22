// Dựng nội dung một điều chính sách thành phần tử React theo luật gõ ở Phần 24 mục 24.4.
// Không dùng dangerouslySetInnerHTML: admin gõ thẻ HTML thì chỉ hiện thành chữ.
// Phần 24 dùng lại cho khung "Xem trước".
import { dungNoiDungChinhSach } from '../utils/dungNoiDungChinhSach.js'
import './NoiDungChinhSach.css'

// Gạch con và đoạn thụt vào nằm trong một khoản hoặc gạch đầu dòng
function Con({ con }) {
  return con.map((c, i) =>
    c.loai === 'gach' ? (
      <ul key={i}>{c.muc.map((chu, j) => <li key={j}>{chu}</li>)}</ul>
    ) : (
      <p key={i}>{c.chu}</p>
    ),
  )
}

function NoiDungChinhSach({ noiDung }) {
  return (
    <div className="noi-dung-dieu">
      {dungNoiDungChinhSach(noiDung).map((khoi, i) => {
        if (khoi.loai === 'tieu-de') return <h3 key={i}>{khoi.chu}</h3>
        if (khoi.loai === 'doan') return <p key={i}>{khoi.chu}</p>
        const The = khoi.loai === 'ds-so' ? 'ol' : 'ul'
        return (
          <The key={i}>
            {khoi.muc.map((muc, j) => (
              // value: số khoản hiện đúng như admin gõ, không tự đếm lại
              <li key={j} value={muc.so}>
                {muc.chu}
                <Con con={muc.con} />
              </li>
            ))}
          </The>
        )
      })}
    </div>
  )
}

export default NoiDungChinhSach
