// Phiên đăng nhập: mã có chữ ký (JWT) cất trong cookie ava_phien (Phần chung C4).
// httpOnly (mã JavaScript của trang không đọc được), SameSite=Lax, hạn 7 ngày.
// Trong mã có id người dùng, vai trò, thời điểm hết hạn; với học viên có thêm địa chỉ IP đã xác nhận.
// Không có bảng phiên trong cơ sở dữ liệu.
import jwt from 'jsonwebtoken';
import config from '../config.js';
import { VAI_TRO } from '../constants/vaiTro.js';

export const TEN_COOKIE_PHIEN = 'ava_phien';
const HAN_PHIEN_MS = 7 * 24 * 60 * 60 * 1000;

const tuyChonCookie = {
  httpOnly: true,
  sameSite: 'lax',
  secure: config.laProduction,
  path: '/',
};

// nguoiDung: { id, vai_tro }. ipDaXacNhan: chỉ truyền với học viên (địa chỉ đã chuẩn hóa).
export function datPhien(res, nguoiDung, ipDaXacNhan) {
  const noiDung = { id: nguoiDung.id, vai_tro: nguoiDung.vai_tro };
  if (nguoiDung.vai_tro === VAI_TRO.HOC_VIEN) noiDung.ip = ipDaXacNhan;
  const ma = jwt.sign(noiDung, config.jwtSecret, { expiresIn: '7d' });
  res.cookie(TEN_COOKIE_PHIEN, ma, { ...tuyChonCookie, maxAge: HAN_PHIEN_MS });
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
