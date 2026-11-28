// Trang Chính sách và điều khoản (Phần 1 mục 1.3), theo thiet_ke/chinh_sach_loi/chinh_sach_dieu_khoan.html.
// Neo #dieu-N do components/he_thong/CuonTrang.jsx cuộn tới khi các điều đã hiện.
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { layChinhSach } from '../../../api/khung.js'
import { dinhDangNgay } from '../../../utils/dinhDang.js'
import { useThongBao } from '../../../hooks/useThongBao.js'
import NoiDungChinhSach from '../../../components/hien_thi/NoiDungChinhSach.jsx'
import './TrangChinhSach.css'

function TrangChinhSach() {
  const [chinhSach, setChinhSach] = useState(null)
  const hienThongBao = useThongBao()

  useEffect(() => {
    layChinhSach().then(setChinhSach, (loi) => hienThongBao(loi.message, 'loi'))
  }, [hienThongBao])

  return (
    <main className="trang-chinh-sach">
      <div className="tcs-duong-dan">
        <Link to="/">Trang chủ</Link> / <b>Chính sách và điều khoản</b>
      </div>
      <h1>Chính sách và điều khoản</h1>
      <p className="tcs-gioi-thieu">
        Điều khoản sử dụng, thanh toán, hoàn tiền, quy định dành cho người cung cấp và xử lý vi phạm trên AVA.
      </p>
      {chinhSach?.cap_nhat_luc && (
        <p className="tcs-cap-nhat">Cập nhật lần cuối: {dinhDangNgay(chinhSach.cap_nhat_luc)}</p>
      )}
      <div className="tcs-cac-dieu">
        {chinhSach?.cac_dieu.map((dieu) => (
          <section key={dieu.so} id={`dieu-${dieu.so}`} className="hop tcs-dieu">
            <h2>Điều {dieu.so}. {dieu.ten}</h2>
            <NoiDungChinhSach noiDung={dieu.noi_dung} />
          </section>
        ))}
      </div>
      {/* Chữ thay mũi tên theo Phần chung C18 */}
      <button
        type="button"
        className="tcs-len-dau"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        Lên đầu trang
      </button>
    </main>
  )
}

export default TrangChinhSach
