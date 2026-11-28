// Bước 2 "Bài học" (mục 7.3; thiet_ke/tao_khoa_hoc/buoc_2_chua_du_3_bai.html, buoc_2_hop_dang.html):
// danh sách bài theo số thứ tự, hộp "Xóa bài học này?", hộp cam kết khi bấm "Đăng".
// loiBai: { [khoa của bài]: câu lỗi } khi máy chủ báo trùng file hoặc file tạm không còn: bài đó viền đỏ.
// onDang: hàm async của trang cha, xong (thành công hay lỗi) thì hộp "Đăng" đóng.
// Bấm "Xóa" ở bài 1 khi bài 2 là trắc nghiệm: không mở hộp xóa, hiện dải đỏ và viền đỏ bài 1
// (như thiet_ke/quan_ly_khoa_hoc/buoc_2_loi_bai_so_1.html); bấm việc khác ở bước 2 hoặc rời bước 2 thì mất.
import { useEffect, useState } from 'react'
import HopThoai from '../../../components/hop_thoai/HopThoai.jsx'
import {
  BAI_1_SAI,
  LOAI_BAI,
  SO_BAI_TOI_THIEU,
  bai1LaTracNghiem,
  chuLoaiBai,
  xoaBai,
} from '../../../utils/soanKhoaHoc.js'

const CAM_KET =
  'Tôi cam kết có quyền sử dụng toàn bộ video, tài liệu và hình ảnh trong khóa học này, và chịu trách nhiệm nếu vi phạm bản quyền.'

const LOP_NHAN = {
  [LOAI_BAI.VIDEO]: 'tkh-nhan-video',
  [LOAI_BAI.TAI_LIEU]: 'tkh-nhan-tai-lieu',
  [LOAI_BAI.TRAC_NGHIEM]: 'tkh-nhan-trac-nghiem',
}

function BuocBaiHoc({ tenKhoa, baiHoc, loiBai, onThem, onSua, onXoa, onDang, onHuy }) {
  const [baiCanXoa, setBaiCanXoa] = useState(null)
  const [moHopDang, setMoHopDang] = useState(false)
  const [daCamKet, setDaCamKet] = useState(false)
  const [dangGui, setDangGui] = useState(false)
  const [baoBai1, setBaoBai1] = useState(false)

  // Mọi nút ở bước 2 đi qua đây để bỏ dải báo đỏ trước khi làm việc khác
  const lam = (viec) => (...thamSo) => {
    setBaoBai1(false)
    viec(...thamSo)
  }

  function bamXoa(khoa) {
    if (bai1LaTracNghiem(xoaBai(baiHoc, khoa))) {
      setBaoBai1(true)
      return
    }
    setBaoBai1(false)
    setBaiCanXoa(khoa)
  }

  // Có bài bị báo lỗi thì cuộn tới bài đó (T7)
  useEffect(() => {
    if (Object.keys(loiBai).length > 0) {
      document.querySelector('.tkh-dong.co-loi')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [loiBai])

  async function dang() {
    setDangGui(true)
    try {
      await onDang()
    } finally {
      setDangGui(false)
      setMoHopDang(false)
    }
  }

  return (
    <>
      <div className="tkh-dau-buoc-2">
        <div className="tkh-dau-buoc-2-ten">
          <div className="tkh-chu-nho">Tạo khóa học mới</div>
          <h1 className="tkh-tieu-de tkh-tieu-de-khoa">{tenKhoa}</h1>
        </div>
        <button type="button" className="nut-dam" onClick={lam(onThem)}>+ Thêm bài học</button>
      </div>

      <div className="hop tkh-hop tkh-hop-buoc-2">
        <div className="tkh-chu-nho tkh-so-bai">{baiHoc.length} bài học</div>
        {baoBai1 && (
          <div className="tkh-dai-loi" role="alert">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 7.5v5M12 16h.01" /></svg>
            {BAI_1_SAI}
          </div>
        )}
        <div className="tkh-ds">
          {baiHoc.map((bai, i) => (
            <div
              key={bai.khoa}
              className={`tkh-dong${loiBai[bai.khoa] || (baoBai1 && i === 0) ? ' co-loi' : ''}`}
            >
              <span className="tkh-so">{i + 1}</span>
              <div className="tkh-ten-bai">
                {bai.ten_bai_hoc}
                {i === 0 && <span className="tkh-nhan-thu">Bài học thử</span>}
              </div>
              <span className={`nhan ${LOP_NHAN[bai.loai]}`}>{chuLoaiBai(bai)}</span>
              <div className="tkh-dong-nut">
                <button type="button" className="tkh-nut-sua" onClick={lam(() => onSua(bai.khoa))}>Sửa</button>
                <button type="button" className="tkh-nut-xoa" onClick={() => bamXoa(bai.khoa)}>Xóa</button>
              </div>
              {loiBai[bai.khoa] && <p className="tkh-loi tkh-loi-dong">{loiBai[bai.khoa]}</p>}
            </div>
          ))}
        </div>
        <div className="tkh-hang-nut tkh-hang-nut-ke">
          <button
            type="button"
            className="nut-dam tkh-nut-lon"
            disabled={baiHoc.length < SO_BAI_TOI_THIEU}
            onClick={lam(() => {
              setDaCamKet(false)
              setMoHopDang(true)
            })}
          >
            Đăng
          </button>
          <button type="button" className="nut-vien tkh-nut-lon" onClick={lam(onHuy)}>Hủy</button>
        </div>
      </div>

      {baiCanXoa !== null && (
        <HopThoai
          tieuDe="Xóa bài học này?"
          gon
          onDong={() => setBaiCanXoa(null)}
          cacNut={
            <>
              <button
                type="button"
                className="nut-dam nguy-hiem"
                onClick={() => {
                  onXoa(baiCanXoa)
                  setBaiCanXoa(null)
                }}
              >
                Xóa
              </button>
              <button type="button" className="nut-vien" onClick={() => setBaiCanXoa(null)}>Hủy</button>
            </>
          }
        />
      )}

      {moHopDang && (
        <HopThoai
          gon
          dangGui={dangGui}
          onDong={() => setMoHopDang(false)}
          cacNut={
            <>
              <button type="button" className="nut-dam" disabled={!daCamKet || dangGui} onClick={dang}>Đăng</button>
              <button type="button" className="nut-vien" disabled={dangGui} onClick={() => setMoHopDang(false)}>
                Hủy
              </button>
            </>
          }
        >
          <label className="tkh-cam-ket">
            <input type="checkbox" checked={daCamKet} onChange={(e) => setDaCamKet(e.target.checked)} />
            {CAM_KET}
          </label>
        </HopThoai>
      )}
    </>
  )
}

export default BuocBaiHoc
