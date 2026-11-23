// Gửi email bằng nodemailer qua Gmail của website (Phần chung C14). Phần 3 và Phần 4 dùng.
// Khi chạy kiểm thử thì không gửi thật mà bỏ thư vào hộp thư giả để kiểm thử đọc được.
import nodemailer from 'nodemailer';
import config from '../config.js';
import logger from './logger.js';
import { HttpError } from './httpError.js';

// Hộp thư giả: mỗi thư là { den, tieuDe, noiDung }. Chỉ dùng khi NODE_ENV=test.
export const hopThuGia = [];

let boGui = null;

export async function guiEmail({ den, tieuDe, noiDung }) {
  if (config.laKiemThu) {
    hopThuGia.push({ den, tieuDe, noiDung });
    return;
  }

  const thieu = [
    ['GMAIL_USER', config.gmail.user],
    ['GMAIL_APP_PASSWORD', config.gmail.appPassword],
  ]
    .filter(([, giaTri]) => !giaTri)
    .map(([ten]) => ten);
  if (thieu.length > 0) {
    const cau = `Máy chủ chưa cấu hình gửi email: thiếu dòng ${thieu.join(', ')} trong file backend/.env.`;
    logger.error(cau);
    throw new HttpError(500, cau);
  }

  boGui ??= nodemailer.createTransport({
    service: 'gmail',
    auth: { user: config.gmail.user, pass: config.gmail.appPassword },
  });
  await boGui.sendMail({ from: `AVA <${config.gmail.user}>`, to: den, subject: tieuDe, text: noiDung });
}
