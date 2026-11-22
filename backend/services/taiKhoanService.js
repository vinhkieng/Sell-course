// Thông tin người đang xem trang (Phần 1 mục 1.4). Phần 3 dùng lại khi đăng nhập thành công.
import { VAI_TRO } from '../constants/vaiTro.js';
import * as gioHangRepo from '../repositories/gioHangRepository.js';
import * as thongBaoRepo from '../repositories/thongBaoRepository.js';

// nguoiDung: dòng đã đọc ở docPhien (req.nguoiDung), null là khách
export async function thongTinNguoiXem(nguoiDung) {
  if (!nguoiDung) return { dang_nhap: false };
  const thongTin = {
    dang_nhap: true,
    id: nguoiDung.id,
    ten_dang_nhap: nguoiDung.ten_dang_nhap,
    ho_ten: nguoiDung.ho_ten,
    vai_tro: nguoiDung.vai_tro,
    // Cột lưu đường dẫn tương đối, ví dụ anh_dai_dien/<uuid>.jpg; ảnh lấy qua GET /api/anh (Phần chung C12)
    anh_dai_dien: nguoiDung.anh_dai_dien ? `/api/anh/${nguoiDung.anh_dai_dien}` : null,
  };
  if (nguoiDung.vai_tro === VAI_TRO.HOC_VIEN) {
    thongTin.so_khoa_trong_gio = await gioHangRepo.demTheoHocVien(nguoiDung.id_hoc_vien);
  } else if (nguoiDung.vai_tro === VAI_TRO.NGUOI_CUNG_CAP) {
    thongTin.so_thong_bao_chua_doc = await thongBaoRepo.demChuaDoc(nguoiDung.id_nguoi_cung_cap);
  }
  return thongTin;
}
