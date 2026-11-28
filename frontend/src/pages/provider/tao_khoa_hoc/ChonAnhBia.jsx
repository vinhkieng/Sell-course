// Ô "Ảnh bìa" ở bước 1 (thiet_ke/tao_khoa_hoc/buoc_1.html, buoc_1_bao_loi.html): xem trước, tên file, dung lượng,
// "Chọn ảnh" / "Đổi ảnh", "Xóa ảnh". Chọn là gửi lên máy chủ làm file tạm ngay (mục 7.4).
// anhBia: null hoặc { ten_file, dung_luong, xemTruoc (đường dẫn ảnh trong trình duyệt), ma_file_tam, dangTai }.
// anhBia nằm ở trang cha để còn giữ khi sang bước 2.
import { useRef } from 'react'
import { guiFileTam, xoaFileTam } from '../../../api/khoaHoc.js'
import { ANH_BIA_TOI_DA_BYTE, ANH_SAI, LOAI_ANH_BIA, dinhDangDungLuong } from '../../../utils/soanKhoaHoc.js'
import OTruong from './OTruong.jsx'

// Bỏ ảnh cũ: xóa file tạm trên máy chủ và đường dẫn xem trước trong trình duyệt
function boAnhBia(anh) {
  if (anh?.ma_file_tam) xoaFileTam(anh.ma_file_tam).catch(() => {})
  if (anh?.xemTruoc) URL.revokeObjectURL(anh.xemTruoc)
}

function ChonAnhBia({ anhBia, setAnhBia, loi, datLoi }) {
  const oChon = useRef(null)
  const lanChon = useRef(0) // chọn ảnh khác khi ảnh trước chưa tải xong thì bỏ kết quả của ảnh trước

  async function chon(e) {
    const file = e.target.files[0]
    e.target.value = ''
    if (!file) return
    boAnhBia(anhBia)
    const lan = ++lanChon.current
    const coBan = { ten_file: file.name, dung_luong: file.size, xemTruoc: null, ma_file_tam: null }
    if (!['image/jpeg', 'image/png'].includes(file.type) || file.size > ANH_BIA_TOI_DA_BYTE) {
      setAnhBia(coBan)
      datLoi(ANH_SAI)
      return
    }
    setAnhBia({ ...coBan, dangTai: true })
    datLoi('')
    try {
      const kq = await guiFileTam({ loai: LOAI_ANH_BIA, file })
      if (lan !== lanChon.current) {
        xoaFileTam(kq.ma_file_tam).catch(() => {})
        return
      }
      setAnhBia({ ...coBan, ma_file_tam: kq.ma_file_tam, xemTruoc: URL.createObjectURL(file) })
    } catch (loiGoi) {
      if (lan !== lanChon.current) return
      setAnhBia(coBan)
      datLoi(loiGoi.cacO.file ?? loiGoi.message)
    }
  }

  function xoa() {
    lanChon.current += 1
    boAnhBia(anhBia)
    setAnhBia(null)
    datLoi('')
  }

  return (
    <OTruong nhan="Ảnh bìa" phu="Không bắt buộc" loi={loi}>
      <div className="tkh-tha">
        {anhBia?.xemTruoc ? (
          <img className="tkh-xem-truoc" src={anhBia.xemTruoc} alt="Ảnh bìa xem trước" />
        ) : (
          <div className="tkh-xem-truoc trong">
            Ảnh xem trước
            <br />
            sẽ hiện ở đây
          </div>
        )}
        {anhBia && (
          <div className="tkh-anh-ten">
            <b>{anhBia.ten_file}</b>
            <span className="tkh-goi-y">{dinhDangDungLuong(anhBia.dung_luong)}</span>
            <button type="button" className="tkh-lien-ket-do" onClick={xoa}>Xóa ảnh</button>
          </div>
        )}
        <div className="tkh-chon-cot">
          <button type="button" className="tkh-nut-nho" onClick={() => oChon.current?.click()}>
            {anhBia ? 'Đổi ảnh' : 'Chọn ảnh'}
          </button>
          <input ref={oChon} type="file" accept="image/jpeg,image/png" hidden onChange={chon} />
          <span className="tkh-goi-y">Định dạng JPG hoặc PNG, tối đa 2 MB.</span>
        </div>
      </div>
    </OTruong>
  )
}

export default ChonAnhBia
