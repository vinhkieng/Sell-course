// Trang "Thêm bài học" và "Sửa bài học" lúc đang tạo khóa (mục 7.3; thiet_ke/tao_khoa_hoc/them_bai_*.html).
// Nằm trong trang tạo khóa, cùng đường dẫn. "Lưu bài học" chỉ giữ bài trong trang rồi về bước 2;
// "Hủy" và "Quay lại" về bước 2 không lưu (file vừa tải bị xóa). Sửa bài: ô "Loại bài" mờ (kế hoạch N4).
// baiDau: null khi thêm; khi sửa là { khoa, ten_bai_hoc, loai, file (null khi là trắc nghiệm hoặc file tạm không còn),
// thoi_gian_lam_bai, cau_hoi (trắc nghiệm) }.
// onLuu(bai, soThuTu) trả câu lỗi khi bài trắc nghiệm bị đưa lên số 1, '' khi đã lưu.
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { xoaFileTam } from '../../../api/khoaHoc.js'
import { LOAI_BAI, TEN_TOI_DA, kiemTraBai, taoCauMoi } from '../../../utils/soanKhoaHoc.js'
import OTruong from './OTruong.jsx'
import ChonFileBai from './ChonFileBai.jsx'
import SoanTracNghiem from './SoanTracNghiem.jsx'

let demKhoa = 0 // khóa riêng của mỗi bài trong trang (không phải id trong database)

const CAC_LOAI = [
  [LOAI_BAI.VIDEO, <><rect x="3" y="5" width="18" height="14" rx="3" /><path d="m10 9 5 3-5 3z" /></>],
  [LOAI_BAI.TAI_LIEU, <><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5M9 13h6M9 17h6" /></>],
  [LOAI_BAI.TRAC_NGHIEM, <><path d="M9 6h11M9 12h11M9 18h11" /><circle cx="4.5" cy="6" r="1.5" /><circle cx="4.5" cy="12" r="1.5" /><circle cx="4.5" cy="18" r="1.5" /></>],
]

function TrangSoanBai({ baiDau, soThuTuDau, tenKhoa, soBaiHienCo, maDangDung, onLuu, onHuy }) {
  const laSua = Boolean(baiDau)
  const maGoc = baiDau?.file?.ma_file_tam ?? null
  const [ten, setTen] = useState(baiDau?.ten_bai_hoc ?? '')
  const [soThuTu, setSoThuTu] = useState(String(soThuTuDau))
  const [loai, setLoai] = useState(baiDau?.loai ?? LOAI_BAI.VIDEO)
  const [file, setFile] = useState(baiDau?.file ? { ...baiDau.file, trangThai: 'xong' } : null)
  // Phần trắc nghiệm giữ trong trang cả khi đổi sang loại khác (đổi lại thì còn nguyên); mới chọn thì có 1 câu trống
  const [thoiGian, setThoiGian] = useState(baiDau?.thoi_gian_lam_bai ? String(baiDau.thoi_gian_lam_bai) : '')
  const [cauHoi, setCauHoi] = useState(() => baiDau?.cau_hoi ?? [taoCauMoi()])
  const [loi, setLoi] = useState({})
  const [lanBaoLoi, setLanBaoLoi] = useState(0)

  useEffect(() => {
    if (lanBaoLoi) document.querySelector('.tkh-trang .co-loi')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [lanBaoLoi])

  // File vừa tải trong lần soạn này (không phải file gốc của bài đang sửa)
  const fileMoi = file?.ma_file_tam && file.ma_file_tam !== maGoc ? file.ma_file_tam : null

  function doiLoai(loaiMoi) {
    if (fileMoi) xoaFileTam(fileMoi).catch(() => {})
    setFile(null)
    setLoai(loaiMoi)
    setLoi({})
  }

  function huy() {
    if (fileMoi) xoaFileTam(fileMoi).catch(() => {})
    onHuy()
  }

  function baoLoi(loiMoi) {
    setLoi(loiMoi)
    setLanBaoLoi((n) => n + 1)
  }

  function luu() {
    const laTracNghiem = loai === LOAI_BAI.TRAC_NGHIEM
    const loiTruoc = kiemTraBai({ ten_bai_hoc: ten, loai, thoi_gian_lam_bai: thoiGian, cau_hoi: cauHoi })
    if (Object.keys(loiTruoc).length > 0) {
      baoLoi(loiTruoc)
      return
    }
    // Chỉ lưu dữ liệu của loại đang chọn: bài video, tài liệu không kèm câu hỏi
    const bai = { khoa: baiDau?.khoa ?? ++demKhoa, ten_bai_hoc: ten.trim(), loai }
    if (laTracNghiem) {
      Object.assign(bai, { file: null, thoi_gian_lam_bai: Number(thoiGian), cau_hoi: cauHoi })
    } else {
      const { ma_file_tam: ma, ten_file: tenFile, dung_luong: dungLuong, thoi_luong: thoiLuong } = file
      bai.file = { ma_file_tam: ma, ten_file: tenFile, dung_luong: dungLuong, thoi_luong: thoiLuong }
    }
    const loiSo = onLuu(bai, soThuTu)
    if (loiSo) {
      baoLoi({ so_thu_tu: loiSo })
      return
    }
    // Sửa bài đã thay file: file cũ không dùng nữa
    if (maGoc && fileMoi) xoaFileTam(maGoc).catch(() => {})
  }

  const tieuDe = laSua ? 'Sửa bài học' : 'Thêm bài học'
  const loaiMo = (l) => laSua && l !== loai

  return (
    <main className="tkh-trang">
      <button type="button" className="tkh-quay-lai" onClick={huy}>Quay lại</button>
      <nav className="tkh-vi-tri" aria-label="Vị trí">
        <Link to="/ho-so">Hồ sơ</Link>
        <span>/</span>
        <Link to="/ho-so#quan-ly-khoa-hoc">Quản lý khóa học</Link>
        <span>/</span>
        <button type="button" onClick={huy}>Tạo khóa học mới</button>
        <span>/</span>
        <b>{tieuDe}</b>
      </nav>
      <h1 className="tkh-tieu-de tkh-tieu-de-sat">{tieuDe}</h1>
      <p className="tkh-khoa">
        Khóa: <b>{tenKhoa}</b>
      </p>

      <div className="hop tkh-hop">
        <div className="tkh-form">
          <OTruong nhan="Tên bài" htmlFor="tkh-ten-bai" batBuoc loi={loi.ten_bai_hoc}>
            <input
              id="tkh-ten-bai"
              className="tkh-nhap"
              placeholder="Ví dụ: Giới thiệu khóa học"
              maxLength={TEN_TOI_DA}
              value={ten}
              onChange={(e) => setTen(e.target.value)}
            />
          </OTruong>

          <OTruong
            nhan="Số thứ tự"
            htmlFor="tkh-so-thu-tu"
            batBuoc
            loi={loi.so_thu_tu}
            goiY={loi.so_thu_tu ? undefined : 'Nếu trùng với bài khác, các bài từ số này trở đi sẽ tự dời xuống một số.'}
          >
            <input
              id="tkh-so-thu-tu"
              className="tkh-nhap"
              inputMode="numeric"
              maxLength={3}
              value={soThuTu}
              onChange={(e) => setSoThuTu(e.target.value.replace(/\D/g, ''))}
            />
          </OTruong>

          <OTruong
            nhan="Loại bài"
            batBuoc
            goiY="Mỗi bài chỉ có một nội dung: một video, một file hoặc một bài trắc nghiệm."
          >
            <div className="tkh-loai" role="radiogroup" aria-label="Loại bài">
              {CAC_LOAI.map(([l, hinh]) => (
                <label
                  key={l}
                  className={`tkh-loai-o${l === loai ? ' dang-chon' : ''}${loaiMo(l) ? ' mo' : ''}${laSua ? ' co-dinh' : ''}`}
                >
                  <input
                    type="radio"
                    name="loai-bai"
                    className="tkh-an"
                    checked={l === loai}
                    disabled={laSua || loaiMo(l)}
                    onChange={() => doiLoai(l)}
                  />
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{hinh}</svg>
                  {l}
                </label>
              ))}
            </div>
          </OTruong>

          {loai === LOAI_BAI.TRAC_NGHIEM ? (
            <SoanTracNghiem
              thoiGian={thoiGian}
              setThoiGian={setThoiGian}
              cauHoi={cauHoi}
              setCauHoi={setCauHoi}
              loi={loi}
            />
          ) : (
            <ChonFileBai
              key={loai}
              loai={loai}
              file={file}
              setFile={setFile}
              maGoc={maGoc}
              soBaiHienCo={soBaiHienCo}
              maDangDung={maDangDung}
            />
          )}

          <div className="tkh-hang-nut">
            <button
              type="button"
              className="nut-dam tkh-nut-lon"
              onClick={luu}
              disabled={loai !== LOAI_BAI.TRAC_NGHIEM && file?.trangThai !== 'xong'}
            >
              Lưu bài học
            </button>
            <button type="button" className="nut-vien tkh-nut-lon" onClick={huy}>Hủy</button>
          </div>
        </div>
      </div>
    </main>
  )
}

export default TrangSoanBai
