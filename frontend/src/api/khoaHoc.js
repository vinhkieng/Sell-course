// Tạo khóa học của người cung cấp (Phần 7 mục 7.5)
import client from './client.js'

// Gửi một file tạm. loai: 'Video', 'Tài liệu' hoặc 'Ảnh bìa'. Ô "loai" gửi trước ô "file" để máy chủ báo đúng câu.
// onTienDo(phanTram) báo tiến độ; signal (AbortController) để "Hủy tải lên".
// Trả { ma_file_tam, ten_file, dung_luong, thoi_luong }
export function guiFileTam({ loai, file, thoiLuong, soBaiHienCo = 0, maDangDung = [], onTienDo, signal }) {
  const duLieu = new FormData()
  duLieu.append('loai', loai)
  if (thoiLuong != null) duLieu.append('thoi_luong', String(thoiLuong))
  duLieu.append('so_bai_hien_co', String(soBaiHienCo))
  duLieu.append('ma_file_tam_dang_dung', JSON.stringify(maDangDung))
  duLieu.append('file', file)
  return client.post('/nguoi-cung-cap/file-tam', duLieu, {
    signal,
    onUploadProgress: (e) => e.total && onTienDo?.(Math.floor((e.loaded * 100) / e.total)),
  })
}

export const xoaFileTam = (ma) => client.delete(`/nguoi-cung-cap/file-tam/${ma}`)
export const xoaTatCaFileTam = () => client.delete('/nguoi-cung-cap/file-tam')

// duLieu theo utils/soanKhoaHoc.js taoDuLieuDang; trả { id }
export const dangKhoaHoc = (duLieu) => client.post('/nguoi-cung-cap/khoa-hoc', duLieu)
