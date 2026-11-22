// Tài khoản người đang xem trang (Phần 1 mục 1.4)
import { thongTinNguoiXem } from '../services/taiKhoanService.js';

export async function toi(req, res) {
  res.json(await thongTinNguoiXem(req.nguoiDung));
}
