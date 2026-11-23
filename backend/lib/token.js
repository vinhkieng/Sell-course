// Phiên đăng nhập: mã có chữ ký (JWT) cất trong cookie ava_phien (Phần chung C4).
// httpOnly (mã JavaScript của trang không đọc được), SameSite=Lax, hạn 7 ngày.
// Trong mã có id người dùng, vai trò, thời điểm hết hạn; với học viên có thêm địa chỉ IP đã xác nhận.
// Không có bảng phiên trong cơ sở dữ liệu.
import jwt from 'jsonwebtoken';
import config from '../config.js';
import { VAI_TRO } from '../constants/vaiTro.js';
import { HIEU_LUC_MA_XAC_NHAN_PHUT } from '../constants/nghiepVu.js';

export const TEN_COOKIE_PHIEN = 'ava_phien';
const HAN_PHIEN_MS = 7 * 24 * 60 * 60 * 1000;

const tuyChonCookie = {
  httpOnly: true,
  sameSite: 'lax',
  secure: config.laProduction,
  path: '/',
};

// nguoiDung: { id, vai_tro }. ipDaXacNhan: chỉ truyền với học viên (địa chỉ đã chuẩn hóa).
export function taoMaPhien(nguoiDung, ipDaXacNhan) {
  const noiDung = { id: nguoiDung.id, vai_tro: nguoiDung.vai_tro };
  if (nguoiDung.vai_tro === VAI_TRO.HOC_VIEN) noiDung.ip = ipDaXacNhan;
  return jwt.sign(noiDung, config.jwtSecret, { expiresIn: '7d' });
}

export function datPhien(res, nguoiDung, ipDaXacNhan) {
  res.cookie(TEN_COOKIE_PHIEN, taoMaPhien(nguoiDung, ipDaXacNhan), {
    ...tuyChonCookie,
    maxAge: HAN_PHIEN_MS,
  });
}

export function xoaPhien(res) {
  res.clearCookie(TEN_COOKIE_PHIEN, tuyChonCookie);
}

// Trả về { id, vai_tro, ip?, exp } nếu mã hợp lệ, ngược lại trả về null
export function docMaPhien(ma) {
  if (!ma) return null;
  try {
    return jwt.verify(ma, config.jwtSecret);
  } catch {
    return null;
  }
}

// Lượt đăng nhập đang chờ xác nhận địa chỉ mạng (Phần 3 mục 3.4): cookie tạm có chữ ký bằng COOKIE_SECRET,
// chỉ nằm trong trình duyệt, ghi id học viên và địa chỉ IP mới.
export const TEN_COOKIE_CHO_XAC_NHAN = 'ava_cho_xac_nhan';

export function datCookieChoXacNhan(res, idHocVien, ip) {
  res.cookie(
    TEN_COOKIE_CHO_XAC_NHAN,
    { id_hoc_vien: idHocVien, ip },
    { ...tuyChonCookie, signed: true, maxAge: HIEU_LUC_MA_XAC_NHAN_PHUT * 60 * 1000 },
  );
}

// { id_hoc_vien, ip } hoặc null khi không có, đã hết hạn hoặc bị sửa chữ ký
export function docCookieChoXacNhan(req) {
  const giaTri = req.signedCookies?.[TEN_COOKIE_CHO_XAC_NHAN];
  return Number.isInteger(giaTri?.id_hoc_vien) && typeof giaTri.ip === 'string' ? giaTri : null;
}

export function xoaCookieChoXacNhan(res) {
  res.clearCookie(TEN_COOKIE_CHO_XAC_NHAN, tuyChonCookie);
}
