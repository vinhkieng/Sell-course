// Trang hồ sơ (Phần 5 mục 5.5)
import client from './client.js'

export const layHoSo = () => client.get('/ho-so')

// duLieu: { ho_ten, gmail, so_dien_thoai, nghe_nghiep, ngay_sinh (yyyy-mm-dd hoặc rỗng) }; trả hồ sơ mới
export const capNhatHoSo = (duLieu) => client.put('/ho-so', duLieu)

// Gửi một file ảnh trong ô "anh"; trả { anh_dai_dien }
export function doiAnhDaiDien(file) {
  const duLieu = new FormData()
  duLieu.append('anh', file)
  return client.post('/ho-so/anh-dai-dien', duLieu)
}

// duLieu: { mat_khau_hien_tai, mat_khau_moi, xac_nhan }
export const doiMatKhau = (duLieu) => client.post('/ho-so/doi-mat-khau', duLieu)
