// Khóa học của người cung cấp (Phần 7). Phần 8 thêm xem, sửa, ẩn, xóa khóa vào đây.
import * as khoaHocService from '../services/khoaHocService.js';

export async function dang(req, res) {
  res.status(201).json(await khoaHocService.dangKhoaHoc(req.nguoiDung, req.validated.body));
}
