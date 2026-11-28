// Hộp có một ô tên danh mục, dùng cho "Thêm danh mục", "Sửa tên danh mục" và "Gộp danh mục"
// (thiet_ke/quan_tri_danh_muc/). onGui(ten) do trang truyền vào: lỗi dưới ô thì ném lại để hộp hiện chữ đỏ.
import { useId, useState } from 'react'
import HopThoai from '../../../components/hop_thoai/HopThoai.jsx'
import ONhap from '../../../components/bieu_mau/ONhap.jsx'
import { kiemTraTenDanhMuc } from '../../../utils/kiemTraDanhMuc.js'

function HopTenDanhMuc({ tieuDe, nhan, tenNut, giaTriDau = '', onGui, onDong }) {
  const idForm = useId()
  const [ten, setTen] = useState(giaTriDau)
  const [loi, setLoi] = useState('')
  const [dangGui, setDangGui] = useState(false)

  async function gui(e) {
    e.preventDefault()
    const loiTruoc = kiemTraTenDanhMuc(ten)
    setLoi(loiTruoc)
    if (loiTruoc) return
    setDangGui(true)
    try {
      await onGui(ten)
    } catch (loiGoi) {
      setLoi(Object.values(loiGoi.cacO ?? {})[0] ?? loiGoi.message)
      setDangGui(false)
    }
  }

  return (
    <HopThoai
      tieuDe={tieuDe}
      onDong={onDong}
      dangGui={dangGui}
      cacNut={
        <>
          <button type="button" className="nut-vien" onClick={onDong} disabled={dangGui}>
            Hủy
          </button>
          <button type="submit" form={idForm} className="nut-dam" disabled={dangGui}>
            {tenNut}
          </button>
        </>
      }
    >
      <form id={idForm} className="qtdm-o-ten" onSubmit={gui} noValidate>
        <ONhap
          nhan={
            <span>
              {nhan}
              <i className="qtdm-bat-buoc">*</i>
            </span>
          }
          loi={loi}
          placeholder="Ví dụ: Nấu Ăn"
          value={ten}
          onChange={(e) => setTen(e.target.value)}
          maxLength={200}
          autoFocus
        />
      </form>
    </HopThoai>
  )
}

export default HopTenDanhMuc
