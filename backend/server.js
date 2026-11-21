// Điểm khởi động backend: chuẩn bị thư mục lưu file, thử kết nối MySQL rồi bật máy chủ.
// Việc chạy định kỳ (Phần chung C13) cũng đặt ở file này, không đặt ở app.js:
// - mỗi phút chuyển đơn "Chờ thanh toán" quá 30 phút sang "Hết hạn" (Phần 13 làm);
// - mỗi giờ xóa file tạm quá 24 giờ trong luu_tru/tam (Phần 7 làm).
import config from './config.js';
import app from './app.js';
import { kiemTraKetNoiCsdl } from './repositories/heThongRepository.js';
import { taoThuMucLuuTru, chepChinhSachMacDinh } from './lib/khoiDong.js';
import logger from './lib/logger.js';

await taoThuMucLuuTru();
await chepChinhSachMacDinh();

try {
  await kiemTraKetNoiCsdl();
  logger.info(`Đã kết nối MySQL, database "${config.db.database}"`);
} catch (loi) {
  logger.error(
    'Không kết nối được MySQL. Kiểm tra Laragon đã bấm Start All chưa và các dòng DB_ trong file .env.',
    loi.message,
  );
}

app.listen(config.port, (loi) => {
  if (loi) {
    // Hay gặp nhất: còn một cửa sổ npm run dev cũ đang chạy, hoặc chương trình khác dùng cổng này
    logger.error(
      `Không bật được backend ở cổng ${config.port}. Có thể cổng đang bị chương trình khác dùng (ví dụ một cửa sổ npm run dev cũ chưa tắt).`,
      loi.message,
    );
    process.exit(1);
  }
  logger.info(`Backend đang chạy tại http://localhost:${config.port}`);
});
