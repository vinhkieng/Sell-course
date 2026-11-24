// Dòng "Hiển thị a-b trên N <đơn vị> (20 dòng mỗi trang)" và các nút "Trước", số trang, "Sau" dưới bảng.
// Theo thiet_ke/quan_tri_*/. Chỗ bị lược ghi "..." (ba dấu chấm gõ từ bàn phím, Phần chung C18).
import { cacSoTrang, moTaPhanTrang } from '../utils/phanTrang.js'
import './PhanTrang.css'

function PhanTrang({ trang, tong, soDongMoiTrang, donVi, onDoiTrang }) {
  const soTrang = Math.max(1, Math.ceil(tong / soDongMoiTrang))

  return (
    <div className="phan-trang">
      <span className="phan-trang-mo-ta">{moTaPhanTrang(trang, tong, soDongMoiTrang, donVi)}</span>
      <nav className="phan-trang-nut" aria-label="Phân trang">
        <button type="button" disabled={trang <= 1} onClick={() => onDoiTrang(trang - 1)}>
          Trước
        </button>
        {cacSoTrang(trang, soTrang).map((so, i) =>
          so === null ? (
            <span key={`luoc${i}`} className="phan-trang-luoc">
              ...
            </span>
          ) : (
            <button
              key={so}
              type="button"
              className={so === trang ? 'dang-xem' : undefined}
              aria-current={so === trang ? 'page' : undefined}
              onClick={() => so !== trang && onDoiTrang(so)}
            >
              {so}
            </button>
          ),
        )}
        <button type="button" disabled={trang >= soTrang} onClick={() => onDoiTrang(trang + 1)}>
          Sau
        </button>
      </nav>
    </div>
  )
}

export default PhanTrang
