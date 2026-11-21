// Kiểm tra phiên đăng nhập và vai trò (Phần chung C4, C5).
// Mọi đường xử lý ở máy chủ đều kiểm tra đăng nhập và vai trò, không chỉ dựa vào việc ẩn nút.
import { TEN_COOKIE_PHIEN, docMaPhien, xoaPhien } from '../lib/token.js';
import { loi401, loi403 } from '../lib/httpError.js';
import { chuanHoaIp } from '../lib/diaChiIp.js';
import { VAI_TRO } from '../constants/vaiTro.js';
import * as nguoiDungRepo from '../repositories/nguoiDungRepository.js';

// Gắn toàn cục trong app.js, chạy ở MỌI đường có gửi kèm cookie ava_phien, kể cả đường công khai.
// Kết quả: req.nguoiDung = người đang đăng nhập (kèm id_hoc_vien, id_nguoi_cung_cap, id_quan_tri_vien)
// hoặc null nếu là khách.
export async function docPhien(req, res, next) {
  req.nguoiDung = null;
  const ma = req.cookies?.[TEN_COOKIE_PHIEN];
  if (!ma) return next();

  const phien = docMaPhien(ma);
  if (!phien) {
    // Mã sai hoặc hết hạn: coi như khách
    xoaPhien(res);
    return next();
  }

  const nguoiDung = await nguoiDungRepo.timTheoId(phien.id);
  if (!nguoiDung) {
    xoaPhien(res);
    return next();
  }

  if (nguoiDung.khoa === 1) {
    xoaPhien(res);
    throw loi401(
      `Tài khoản đã bị khóa. Lý do: ${nguoiDung.ly_do_khoa}. Liên hệ hỗ trợ nếu bạn cho rằng có nhầm lẫn.`,
      { ma: 'TAI_KHOAN_BI_KHOA', them: { ly_do_khoa: nguoiDung.ly_do_khoa } },
    );
  }

  // Học viên đã xác nhận đăng nhập ở nơi khác (địa chỉ trong phiên khác địa chỉ đang lưu)
  if (
    nguoiDung.vai_tro === VAI_TRO.HOC_VIEN &&
    chuanHoaIp(phien.ip) !== chuanHoaIp(nguoiDung.dia_chi_ip)
  ) {
    xoaPhien(res);
    throw loi401('Tài khoản của bạn vừa đăng nhập ở một địa chỉ mạng khác.', {
      ma: 'DANG_NHAP_NOI_KHAC',
    });
  }

  req.nguoiDung = nguoiDung;
  next();
}

// Bắt buộc đăng nhập. Dùng sau docPhien.
export function canDangNhap(req, res, next) {
  if (!req.nguoiDung) throw loi401();
  next();
}

// Chỉ cho các vai trò được liệt kê (sai vai trò trả 403). Ví dụ: canVaiTro(VAI_TRO.ADMIN)
export function canVaiTro(...danhSachVaiTro) {
  return (req, res, next) => {
    if (!req.nguoiDung) throw loi401();
    if (!danhSachVaiTro.includes(req.nguoiDung.vai_tro)) throw loi403();
    next();
  };
}
