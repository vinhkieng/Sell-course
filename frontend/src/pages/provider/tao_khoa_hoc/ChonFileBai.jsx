// Ô "File video" / "File tài liệu" ở trang thêm hoặc sửa bài (mục 7.3; thiet_ke/tao_khoa_hoc/them_bai_video.html
// và các màn báo lỗi). Chọn file thì kiểm trước ở trình duyệt (video còn phát thử bằng thẻ video ẩn), rồi gửi lên ngay.
// file (ở trang cha): null, hoặc { trangThai: 'dang-tai' | 'xong' | 'loi', ten_file, dung_luong, tienDo, loi,
// ma_file_tam, thoi_luong }. maGoc: mã file của bài đang sửa, không xóa file này khi chọn file khác
// (trang cha xóa lúc bấm "Lưu bài học").
import { useEffect, useRef } from 'react'
import { guiFileTam, xoaFileTam } from '../../../api/khoaHoc.js'
import {
  KHONG_PHAT_DUOC,
  LOAI_BAI,
  TAI_LIEU_SAI,
  TAI_LIEU_TOI_DA_BYTE,
  THOI_LUONG_SAI,
  THOI_LUONG_TOI_DA_GIAY,
  VIDEO_SAI,
  VIDEO_TOI_DA_BYTE,
  dinhDangDungLuong,
} from '../../../utils/soanKhoaHoc.js'
import OTruong from './OTruong.jsx'

const THEO_LOAI = {
  [LOAI_BAI.VIDEO]: { nhan: 'File video', duoi: '.mp4', toiDa: VIDEO_TOI_DA_BYTE, cauSai: VIDEO_SAI, goiY: 'File .mp4, tối đa 300MB.', chuChon: 'Chọn file video', accept: 'video/mp4,.mp4' },
  [LOAI_BAI.TAI_LIEU]: { nhan: 'File tài liệu', duoi: '.pdf', toiDa: TAI_LIEU_TOI_DA_BYTE, cauSai: TAI_LIEU_SAI, goiY: 'File .pdf, tối đa 20MB.', chuChon: 'Chọn file', accept: 'application/pdf,.pdf' },
}

// Phát thử video trong thẻ video ẩn: trả thời lượng (giây) nếu phát được và có hình, không thì null
function thuPhatVideo(file) {
  return new Promise((xong) => {
    const video = document.createElement('video')
    const duongDan = URL.createObjectURL(file)
    const ketThuc = (kq) => {
      clearTimeout(hen)
      video.removeAttribute('src')
      video.load()
      URL.revokeObjectURL(duongDan)
      xong(kq)
    }
    // tạm: chờ tối đa 20 giây cho khung hình đầu tiên, máy quá chậm thì coi như không phát được
    const hen = setTimeout(() => ketThuc(null), 20000)
    video.muted = true
    video.preload = 'auto'
    video.onloadeddata = () => ketThuc(video.videoWidth > 0 ? video.duration : null)
    video.onerror = () => ketThuc(null)
    video.src = duongDan
  })
}

function BieuTuong({ loai, mau }) {
  return (
    <div className={`tkh-bieu-tuong ${mau}`}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {loai === LOAI_BAI.VIDEO ? (
          <>
            <rect x="3" y="5" width="18" height="14" rx="3" />
            <path d="m10 9 5 3-5 3z" />
          </>
        ) : (
          <>
            <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
            <path d="M14 3v5h5M9 13h6M9 17h6" />
          </>
        )}
      </svg>
    </div>
  )
}

function ChonFileBai({ loai, file, setFile, maGoc, soBaiHienCo, maDangDung }) {
  const oChon = useRef(null)
  const huyGui = useRef(null)
  const lanChon = useRef(0) // tăng khi chọn file khác, "Hủy tải lên" hoặc rời trang: bỏ việc đang làm dở
  const luat = THEO_LOAI[loai]

  // Rời trang soạn bài (Hủy, Lưu, đổi loại bài) khi đang phát thử hoặc đang gửi thì dừng
  useEffect(
    () => () => {
      lanChon.current += 1
      huyGui.current?.abort()
    },
    [],
  )

  async function chon(e) {
    const fileChon = e.target.files[0]
    e.target.value = ''
    if (!fileChon) return
    const lan = ++lanChon.current
    // Bỏ file vừa tải trước đó (không phải file gốc của bài đang sửa)
    if (file?.ma_file_tam && file.ma_file_tam !== maGoc) xoaFileTam(file.ma_file_tam).catch(() => {})
    const coBan = { ten_file: fileChon.name, dung_luong: fileChon.size }
    const baoLoi = (cau) => setFile({ ...coBan, trangThai: 'loi', loi: cau })

    if (!fileChon.name.toLowerCase().endsWith(luat.duoi) || fileChon.size === 0 || fileChon.size > luat.toiDa) {
      baoLoi(luat.cauSai)
      return
    }
    let thoiLuong = null
    if (loai === LOAI_BAI.VIDEO) {
      setFile({ ...coBan, trangThai: 'dang-tai', tienDo: 0 })
      const giay = await thuPhatVideo(fileChon)
      if (lan !== lanChon.current) return
      if (giay === null) {
        baoLoi(KHONG_PHAT_DUOC)
        return
      }
      thoiLuong = Math.ceil(giay)
      if (!(thoiLuong >= 1 && thoiLuong <= THOI_LUONG_TOI_DA_GIAY)) {
        baoLoi(THOI_LUONG_SAI)
        return
      }
    }

    const dieuKhien = new AbortController()
    huyGui.current = dieuKhien
    setFile({ ...coBan, trangThai: 'dang-tai', tienDo: 0 })
    try {
      const kq = await guiFileTam({
        loai,
        file: fileChon,
        thoiLuong,
        soBaiHienCo,
        maDangDung,
        signal: dieuKhien.signal,
        onTienDo: (tienDo) => setFile((cu) => (cu?.trangThai === 'dang-tai' ? { ...cu, tienDo } : cu)),
      })
      setFile({ ...kq, trangThai: 'xong' })
    } catch (loiGoi) {
      if (!dieuKhien.signal.aborted) baoLoi(loiGoi.cacO.file ?? loiGoi.message)
    } finally {
      if (huyGui.current === dieuKhien) huyGui.current = null
    }
  }

  // "Hủy tải lên": dừng gửi, ô về trống. File gửi dở trên máy chủ được việc dọn mỗi giờ xóa.
  function huyTaiLen() {
    lanChon.current += 1
    huyGui.current?.abort()
    setFile(null)
  }

  const dangTai = file?.trangThai === 'dang-tai'
  const coLoi = file?.trangThai === 'loi'
  const nutChon = (chu) => (
    <button type="button" className="tkh-nut-nho" onClick={() => oChon.current?.click()}>{chu}</button>
  )

  return (
    <OTruong nhan={luat.nhan} batBuoc loi={file?.loi} goiY={file ? luat.goiY : undefined}>
      <input ref={oChon} type="file" accept={luat.accept} hidden onChange={chon} />
      {!file ? (
        <div className="tkh-tha">
          <BieuTuong loai={loai} mau="xam" />
          <div className="tkh-chon-cot tkh-gian">
            {nutChon(luat.chuChon)}
            <span className="tkh-goi-y">{luat.goiY}</span>
          </div>
        </div>
      ) : (
        <div className={`tkh-tha${dangTai ? ' tkh-tha-doc' : ''}`}>
          <div className="tkh-file-hang">
            <BieuTuong loai={loai} mau={coLoi ? 'do' : 'xanh'} />
            <div className="tkh-file-ten">
              <b>{file.ten_file}</b>
              <span className="tkh-goi-y">{dinhDangDungLuong(file.dung_luong)}</span>
            </div>
            {dangTai ? (
              <button type="button" className="tkh-nut-nho" onClick={huyTaiLen}>Hủy tải lên</button>
            ) : (
              nutChon(maGoc && !coLoi ? 'Thay file' : 'Chọn lại')
            )}
          </div>
          {dangTai && (
            <div className="tkh-tien-do">
              <div className="tkh-tien-do-thanh">
                <div style={{ width: `${file.tienDo}%` }} />
              </div>
              <span>Đang tải lên {file.tienDo}%</span>
            </div>
          )}
        </div>
      )}
    </OTruong>
  )
}

export default ChonFileBai
