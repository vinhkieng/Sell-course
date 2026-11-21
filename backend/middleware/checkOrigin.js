// Chống CSRF (trang web lạ lợi dụng cookie đăng nhập để gửi thao tác thay người dùng), Phần chung C6:
// mọi thao tác làm thay đổi dữ liệu (POST, PUT, PATCH, DELETE) chỉ nhận khi tiêu đề Origin
// đúng bằng CLIENT_ORIGIN. Hai đường nhận kết quả từ VNPay (Phần 13) là GET nên không bị chặn.
import config from '../config.js';
import { loi403 } from '../lib/httpError.js';

const PHUONG_THUC_DOC = new Set(['GET', 'HEAD', 'OPTIONS']);

export function checkOrigin(req, res, next) {
  if (PHUONG_THUC_DOC.has(req.method)) return next();
  if (req.get('origin') !== config.clientOrigin) {
    throw loi403('Yêu cầu không hợp lệ.');
  }
  next();
}
