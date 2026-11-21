// Middleware lỗi duy nhất, gắn cuối app.js. Mọi lỗi trả về cùng một mẫu (Phần chung C6):
// { "loi": "câu thông báo", "ma": "MA_LOI_NEU_CO", "cac_o": { "ten_o": "câu lỗi" } }
import multer from 'multer';
import { HttpError } from '../lib/httpError.js';
import logger from '../lib/logger.js';

export function notFound(req, res, next) {
  next(new HttpError(404, 'Không tìm thấy trang'));
}

// Phải đủ 4 tham số (err, req, res, next) thì Express mới nhận đây là middleware lỗi
export function errorHandler(err, req, res, next) {
  // Phản hồi đã gửi đi một phần (ví dụ đang phát video thì lỗi): để Express tự đóng kết nối
  if (res.headersSent) return next(err);

  let loi = err;

  if (err instanceof multer.MulterError) {
    // File quá cỡ trả 413 (Phần chung C6)
    loi =
      err.code === 'LIMIT_FILE_SIZE'
        ? new HttpError(413, 'File tải lên quá lớn.')
        : new HttpError(400, 'File tải lên không hợp lệ.');
  } else if (err?.type === 'entity.parse.failed') {
    loi = new HttpError(400, 'Dữ liệu gửi lên không đúng định dạng.');
  } else if (err?.type === 'entity.too.large') {
    loi = new HttpError(413, 'Dữ liệu gửi lên quá lớn.');
  } else if (!(err instanceof HttpError) && err?.status >= 400 && err?.status < 500) {
    // Lỗi 4xx khác do thư viện đọc dữ liệu báo: giữ đúng mã trạng thái
    loi = new HttpError(err.status, 'Dữ liệu gửi lên không hợp lệ.');
  }

  if (!(loi instanceof HttpError)) {
    logger.error(`${req.method} ${req.path} gặp lỗi không lường trước`, err?.message);
    loi = new HttpError(500, 'Hệ thống đang gặp sự cố, vui lòng thử lại sau.');
  }

  const noiDung = { loi: loi.message };
  if (loi.ma) noiDung.ma = loi.ma;
  if (loi.cacO && Object.keys(loi.cacO).length > 0) noiDung.cac_o = loi.cacO;
  if (loi.them) Object.assign(noiDung, loi.them);
  res.status(loi.status).json(noiDung);
}
