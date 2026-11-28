// Trang /quan-tri/danh-muc (Phần 6), theo thiet_ke/quan_tri_danh_muc/danh_muc.html và danh_muc_gop.html.
// Bảng sắp theo tên, 20 dòng mỗi trang; thêm, sửa tên, xóa (chỉ khi không còn khóa) và chế độ gộp.
import { useCallback, useEffect, useState } from 'react'
import { useThongBao } from '../../../hooks/useThongBao.js'
import { layTrangDanhMuc, themDanhMuc, doiTenDanhMuc, xoaDanhMuc, gopDanhMuc } from '../../../api/danhMuc.js'
import HopThoai from '../../../components/hop_thoai/HopThoai.jsx'
import PhanTrang from '../../../components/hien_thi/PhanTrang.jsx'
import HopTenDanhMuc from './HopTenDanhMuc.jsx'
import './TrangQuanTriDanhMuc.css'

const SO_DONG_MOI_TRANG = 20 // Phần chung C16

function TrangQuanTriDanhMuc() {
  const hienThongBao = useThongBao()
  const [trang, setTrang] = useState(1)
  const [lanTai, setLanTai] = useState(0)
  const [duLieu, setDuLieu] = useState(null) // { danh_sach, tong }
  const [cheDoGop, setCheDoGop] = useState(false)
  const [daChon, setDaChon] = useState(() => new Set()) // id các danh mục đang tích, giữ qua các trang
  const [hop, setHop] = useState(null) // { loai: 'them' | 'sua' | 'xoa' | 'gop', danhMuc }
  const [dangXoa, setDangXoa] = useState(false)

  useEffect(() => {
    let conHieuLuc = true
    layTrangDanhMuc(trang).then(
      (kq) => {
        if (!conHieuLuc) return
        const soTrang = Math.max(1, Math.ceil(kq.tong / SO_DONG_MOI_TRANG))
        // Vừa xóa hoặc gộp hết dòng của trang cuối thì lùi về trang cuối mới
        if (trang > soTrang) setTrang(soTrang)
        else setDuLieu(kq)
      },
      (loi) => conHieuLuc && hienThongBao(loi.message, 'loi'),
    )
    return () => {
      conHieuLuc = false
    }
  }, [trang, lanTai, hienThongBao])

  const taiLai = () => setLanTai((n) => n + 1)
  const dongHop = useCallback(() => setHop(null), [])

  function thoatGop() {
    setCheDoGop(false)
    setDaChon(new Set())
  }

  function doiChon(id) {
    setDaChon((cu) => {
      const moi = new Set(cu)
      if (moi.has(id)) moi.delete(id)
      else moi.add(id)
      return moi
    })
  }

  // Lỗi không gắn với ô nào (danh mục vừa bị xóa nơi khác, vừa có khóa): đóng hộp, báo, tải lại bảng
  function loiChung(loi) {
    setHop(null)
    hienThongBao(loi.message, 'loi')
    taiLai()
  }

  // Dùng cho ba hộp có ô tên. Lỗi dưới ô (tenO) thì ném lại để hộp hiện chữ đỏ.
  async function guiTen(goiMayChu, tenO, cauXong, sauKhiXong) {
    try {
      await goiMayChu()
    } catch (loi) {
      if (loi.cacO?.[tenO]) throw loi
      if (hop?.loai === 'gop') thoatGop()
      loiChung(loi)
      return
    }
    sauKhiXong?.()
    setHop(null)
    hienThongBao(cauXong)
    taiLai()
  }

  async function xacNhanXoa() {
    const { id } = hop.danhMuc
    setDangXoa(true)
    try {
      await xoaDanhMuc(id)
      setDaChon((cu) => {
        const moi = new Set(cu)
        moi.delete(id)
        return moi
      })
      setHop(null)
      hienThongBao('Đã xóa danh mục')
      taiLai()
    } catch (loi) {
      loiChung(loi)
    } finally {
      setDangXoa(false)
    }
  }

  return (
    <>
      <div className="qtdm-dau">
        <h1 className="kqt-tieu-de">Danh mục</h1>
        <div className="qtdm-nut-dau">
          {cheDoGop && (
            <button type="button" className="nut-vien" onClick={thoatGop}>
              Hủy
            </button>
          )}
          <button
            type="button"
            className={`nut-vien${cheDoGop ? ' dang-bat' : ''}`}
            disabled={cheDoGop && daChon.size < 2}
            onClick={() => (cheDoGop ? setHop({ loai: 'gop' }) : setCheDoGop(true))}
          >
            Gộp
          </button>
          <button type="button" className="nut-dam" onClick={() => setHop({ loai: 'them' })}>
            + Thêm danh mục
          </button>
        </div>
      </div>

      <div className="hop qtdm-hop">
        <div className="qtdm-khung-bang">
          <table className="qtdm-bang">
            <thead>
              <tr>
                <th>Tên danh mục</th>
                <th>Số khóa</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {duLieu?.danh_sach.map((dm) => (
                <tr key={dm.id}>
                  <td>
                    {cheDoGop && (
                      <input
                        type="checkbox"
                        className="qtdm-chon"
                        checked={daChon.has(dm.id)}
                        onChange={() => doiChon(dm.id)}
                        aria-label={`Chọn ${dm.ten}`}
                      />
                    )}
                    <b>{dm.ten}</b>
                  </td>
                  <td>{dm.so_khoa}</td>
                  <td>
                    <div className="qtdm-hanh-dong">
                      <button type="button" className="qtdm-nut-nho mo" onClick={() => setHop({ loai: 'sua', danhMuc: dm })}>
                        Sửa tên
                      </button>
                      {dm.so_khoa > 0 ? (
                        <span className="qtdm-goi-y" data-tip={`Danh mục đang có ${dm.so_khoa} khóa học`} tabIndex={0}>
                          <span className="qtdm-nut-nho mo-mo" aria-disabled="true">
                            Xóa
                          </span>
                        </span>
                      ) : (
                        <button type="button" className="qtdm-nut-nho do" onClick={() => setHop({ loai: 'xoa', danhMuc: dm })}>
                          Xóa
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {duLieu && (
          <PhanTrang
            trang={trang}
            tong={duLieu.tong}
            soDongMoiTrang={SO_DONG_MOI_TRANG}
            donVi="danh mục"
            onDoiTrang={setTrang}
          />
        )}
      </div>

      {hop?.loai === 'them' && (
        <HopTenDanhMuc
          tieuDe="Thêm danh mục"
          nhan="Tên danh mục"
          tenNut="Thêm"
          onDong={dongHop}
          onGui={(ten) => guiTen(() => themDanhMuc(ten), 'ten', 'Đã thêm danh mục')}
        />
      )}
      {hop?.loai === 'sua' && (
        <HopTenDanhMuc
          tieuDe="Sửa tên danh mục"
          nhan="Tên danh mục"
          tenNut="Lưu"
          giaTriDau={hop.danhMuc.ten}
          onDong={dongHop}
          onGui={(ten) => guiTen(() => doiTenDanhMuc(hop.danhMuc.id, ten), 'ten', 'Đã đổi tên danh mục')}
        />
      )}
      {hop?.loai === 'gop' && (
        <HopTenDanhMuc
          tieuDe="Gộp danh mục"
          nhan="Tên danh mục mới"
          tenNut="Gộp"
          onDong={dongHop}
          onGui={(ten) => guiTen(() => gopDanhMuc([...daChon], ten), 'ten_moi', 'Đã gộp danh mục', thoatGop)}
        />
      )}
      {hop?.loai === 'xoa' && (
        <HopThoai
          tieuDe="Xóa danh mục này?"
          onDong={dongHop}
          dangGui={dangXoa}
          cacNut={
            <>
              <button type="button" className="nut-vien" onClick={dongHop} disabled={dangXoa}>
                Hủy
              </button>
              <button type="button" className="nut-dam nguy-hiem" onClick={xacNhanXoa} disabled={dangXoa}>
                Xóa danh mục
              </button>
            </>
          }
        >
          <p>Danh mục "{hop.danhMuc.ten}" sẽ bị xóa khỏi hệ thống. Hành động này không thể hoàn tác.</p>
        </HopThoai>
      )}
    </>
  )
}

export default TrangQuanTriDanhMuc
