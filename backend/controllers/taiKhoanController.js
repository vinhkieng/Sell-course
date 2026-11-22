// Tài khoản: người đang xem trang (Phần 1 mục 1.4), đăng ký (Phần 2 mục 2.5)
import { thongTinNguoiXem, dangKy as dangKyTaiKhoan } from '../services/taiKhoanService.js';

export async function toi(req, res) {
  res.json(await thongTinNguoiXem(req.nguoiDung));
}

export async function dangKy(req, res) {
  await dangKyTaiKhoan(req.validated.body);
  res.status(201).end();
}
