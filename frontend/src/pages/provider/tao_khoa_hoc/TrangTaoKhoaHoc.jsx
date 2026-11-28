// Trang /nguoi-cung-cap/tao-khoa-hoc (Phần 7, thiet_ke/tao_khoa_hoc/). Bước 1, bước 2 và trang thêm hoặc sửa bài
// dùng chung một đường dẫn; toàn bộ dữ liệu đang tạo chỉ nằm trong trang cho tới khi bấm "Đăng" (mục 7.3).
// Mở trang thì xóa mọi file tạm cũ của người này (mục 7.5). Đang có dữ liệu mà rời trang thì hỏi lại (T2, T4).
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useThongBao } from '../../../hooks/useThongBao.js'
import { useHoiKhiRoiTrang } from '../../../hooks/useHoiKhiRoiTrang.js'
import { layHoSo } from '../../../api/hoSo.js'
import { layTatCaDanhMuc } from '../../../api/danhMuc.js'
import { dangKhoaHoc, xoaFileTam, xoaTatCaFileTam } from '../../../api/khoaHoc.js'
import HopThoai from '../../../components/hop_thoai/HopThoai.jsx'
import {
  BAI_1_SAI,
  FILE_DA_CO,
  FILE_KHONG_CON,
  bai1LaTracNghiem,
  chenBai,
  kiemTraBuoc1,
  loiBuoc1TuMayChu,
  suaBai,
  taoDuLieuDang,
  xoaBai,
} from '../../../utils/soanKhoaHoc.js'
import ThanhBuoc from './ThanhBuoc.jsx'
import BuocThongTin from './BuocThongTin.jsx'
import BuocBaiHoc from './BuocBaiHoc.jsx'
import TrangSoanBai from './TrangSoanBai.jsx'
import './TrangTaoKhoaHoc.css'

const THIEU_HO_SO = 'Hãy cập nhật họ tên và số điện thoại trong hồ sơ trước khi tạo khóa học.'
const VE_QUAN_LY = '/ho-so#quan-ly-khoa-hoc'

const THONG_TIN_TRONG = {
  ten_khoa_hoc: '',
  mo_ta: '',
  id_danh_muc: '',
  ten_danh_muc_moi: '',
  gia_ban: '',
  hoc_duoc_gi: '',
  yeu_cau: '',
  danh_cho_ai: '',
}

const boKhoa = (doiTuong, khoa) => Object.fromEntries(Object.entries(doiTuong).filter(([k]) => k !== String(khoa)))

function TrangTaoKhoaHoc() {
  const hienThongBao = useThongBao()
  const navigate = useNavigate()
  const [hoSo, setHoSo] = useState(null)
  const [danhMuc, setDanhMuc] = useState([])
  const [buoc, setBuoc] = useState(1)
  const [thongTin, setThongTin] = useState(THONG_TIN_TRONG)
  const [anhBia, setAnhBia] = useState(null)
  const [loi1, setLoi1] = useState({})
  const [lanBaoLoi1, setLanBaoLoi1] = useState(0)
  const [baiHoc, setBaiHoc] = useState([])
  const [loiBai, setLoiBai] = useState({})
  const [soan, setSoan] = useState(null) // null: không soạn bài; { bai: null }: thêm; { bai }: sửa

  const taiDanhMuc = () => layTatCaDanhMuc().then(setDanhMuc, () => {})

  // Xóa file tạm cũ xong mới hiện form, để file tải lên sau đó không bị xóa nhầm
  useEffect(() => {
    Promise.all([layHoSo(), xoaTatCaFileTam().catch(() => {})]).then(
      ([hs]) => setHoSo(hs),
      (loi) => hienThongBao(loi.message, 'loi'),
    )
    taiDanhMuc()
  }, [hienThongBao])

  const coDuLieu =
    buoc !== 1 ||
    soan !== null ||
    baiHoc.length > 0 ||
    anhBia !== null ||
    Object.values(thongTin).some((giaTri) => giaTri !== '')
  const chanRoiTrang = useHoiKhiRoiTrang(coDuLieu)

  // Đổi bước hoặc mở trang soạn bài: về đầu trang (cùng đường dẫn nên bộ cuộn trang không tự làm)
  function chuyen(buocMoi, soanMoi = null) {
    setBuoc(buocMoi)
    setSoan(soanMoi)
    window.scrollTo(0, 0)
  }

  function baoLoi1(loi) {
    setLoi1(loi)
    setLanBaoLoi1((n) => n + 1)
  }

  function tiepTuc() {
    const loi = kiemTraBuoc1(thongTin, danhMuc)
    if (loi1.anh_bia) loi.anh_bia = loi1.anh_bia
    baoLoi1(loi)
    if (Object.keys(loi).length === 0) chuyen(2)
  }

  // Lưu bài từ trang soạn bài. Bài trắc nghiệm mà lên số 1 thì không lưu, trả câu lỗi để báo dưới ô Số thứ tự.
  function luuBai(bai, soThuTu) {
    const cu = soan.bai
    const dsMoi = cu ? suaBai(baiHoc, bai, soThuTu) : chenBai(baiHoc, bai, soThuTu)
    if (bai1LaTracNghiem(dsMoi)) return BAI_1_SAI
    setBaiHoc(dsMoi)
    if (cu && bai.file?.ma_file_tam !== cu.file?.ma_file_tam) setLoiBai((l) => boKhoa(l, bai.khoa))
    chuyen(2)
    return ''
  }

  function xoaBaiHoc(khoa) {
    const bai = baiHoc.find((b) => b.khoa === khoa)
    if (bai.file?.ma_file_tam) xoaFileTam(bai.file.ma_file_tam).catch(() => {})
    setBaiHoc((ds) => xoaBai(ds, khoa))
    setLoiBai((l) => boKhoa(l, khoa))
  }

  // Bài có file tạm không còn: mở sửa với ô file trống để chọn lại
  function moSua(khoa) {
    const bai = baiHoc.find((b) => b.khoa === khoa)
    chuyen(2, { bai: loiBai[khoa] === FILE_KHONG_CON ? { ...bai, file: null } : bai })
  }

  async function dang() {
    try {
      await dangKhoaHoc(taoDuLieuDang(thongTin, anhBia, baiHoc))
      hienThongBao('Đã đăng khóa học')
      navigate(VE_QUAN_LY, { state: { boQuaHoiRoiTrang: true } })
    } catch (loi) {
      const viTri = loi.them.vi_tri_bai
      if (viTri && (loi.ma === 'TRUNG_FILE' || loi.ma === 'FILE_TAM_KHONG_CON')) {
        setLoiBai({ [baiHoc[viTri - 1].khoa]: loi.ma === 'TRUNG_FILE' ? FILE_DA_CO : FILE_KHONG_CON })
      } else if (loi.ma === 'FILE_TAM_KHONG_CON') {
        // Ảnh bìa không còn: quay về bước 1, báo dưới ô Ảnh bìa
        if (anhBia?.xemTruoc) URL.revokeObjectURL(anhBia.xemTruoc)
        setAnhBia((cu) => ({ ...cu, ma_file_tam: null, xemTruoc: null }))
        chuyen(1)
        baoLoi1({ anh_bia: FILE_KHONG_CON })
      } else if (loi.ma === 'DANH_MUC_KHONG_CON') {
        // T1: danh mục vừa bị xóa hoặc gộp
        taiDanhMuc()
        setThongTin((cu) => ({ ...cu, id_danh_muc: '' }))
        chuyen(1)
        baoLoi1({ id_danh_muc: loi.message })
      } else {
        const loiBuoc1 = loiBuoc1TuMayChu(loi.cacO)
        if (Object.keys(loiBuoc1).length > 0) {
          chuyen(1)
          baoLoi1(loiBuoc1)
        } else {
          hienThongBao(loi.message, 'loi')
        }
      }
    }
  }

  if (!hoSo) return null

  if (!hoSo.ho_ten || !hoSo.so_dien_thoai) {
    return (
      <main className="tkh-trang">
        <div className="hop tkh-hop tkh-thieu-ho-so">
          <p>{THIEU_HO_SO}</p>
          <Link to="/ho-so#thong-tin-ca-nhan" className="tkh-lien-ket">Cập nhật hồ sơ</Link>
        </div>
      </main>
    )
  }

  const hopRoiTrang = chanRoiTrang.state === 'blocked' && (
    <HopThoai
      tieuDe="Rời trang?"
      onDong={() => chanRoiTrang.reset()}
      cacNut={
        <>
          <button type="button" className="nut-vien" onClick={() => chanRoiTrang.reset()}>Ở lại</button>
          <button
            type="button"
            className="nut-dam"
            onClick={() => {
              xoaTatCaFileTam().catch(() => {})
              chanRoiTrang.proceed()
            }}
          >
            Rời trang
          </button>
        </>
      }
    >
      <p>Dữ liệu khóa học đang tạo sẽ bị mất.</p>
    </HopThoai>
  )

  if (soan) {
    const dangSua = soan.bai
    return (
      <>
        <TrangSoanBai
          baiDau={dangSua}
          soThuTuDau={dangSua ? baiHoc.findIndex((b) => b.khoa === dangSua.khoa) + 1 : baiHoc.length + 1}
          tenKhoa={thongTin.ten_khoa_hoc.trim()}
          soBaiHienCo={dangSua ? baiHoc.length - 1 : baiHoc.length}
          maDangDung={baiHoc
            .filter((b) => b.khoa !== dangSua?.khoa && b.file?.ma_file_tam)
            .map((b) => b.file.ma_file_tam)}
          onLuu={luuBai}
          onHuy={() => chuyen(2)}
        />
        {hopRoiTrang}
      </>
    )
  }

  return (
    <main className={`tkh-trang${buoc === 2 ? ' rong' : ''}`}>
      {buoc === 2 && (
        <button type="button" className="tkh-quay-lai" onClick={() => chuyen(1)}>Quay lại</button>
      )}
      <nav className="tkh-vi-tri" aria-label="Vị trí">
        <Link to="/ho-so">Hồ sơ</Link>
        <span>/</span>
        <Link to={VE_QUAN_LY}>Quản lý khóa học</Link>
        <span>/</span>
        <b>Tạo khóa học mới</b>
      </nav>
      <ThanhBuoc buoc={buoc} onVeBuoc1={() => chuyen(1)} />

      {buoc === 1 ? (
        <>
          <h1 className="tkh-tieu-de">Tạo khóa học mới</h1>
          <BuocThongTin
            thongTin={thongTin}
            doi={(ten, giaTri) => setThongTin((cu) => ({ ...cu, [ten]: giaTri }))}
            loi={loi1}
            setLoi={setLoi1}
            lanBaoLoi={lanBaoLoi1}
            danhMuc={danhMuc}
            anhBia={anhBia}
            setAnhBia={setAnhBia}
            onTiepTuc={tiepTuc}
            onHuy={() => navigate(VE_QUAN_LY)}
          />
        </>
      ) : (
        <BuocBaiHoc
          tenKhoa={thongTin.ten_khoa_hoc.trim()}
          baiHoc={baiHoc}
          loiBai={loiBai}
          onThem={() => chuyen(2, { bai: null })}
          onSua={moSua}
          onXoa={xoaBaiHoc}
          onDang={dang}
          onHuy={() => navigate(VE_QUAN_LY)}
        />
      )}
      {hopRoiTrang}
    </main>
  )
}

export default TrangTaoKhoaHoc
