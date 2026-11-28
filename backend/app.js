// Tạo ứng dụng Express: gắn các lớp bảo vệ, đọc dữ liệu, đọc phiên, routes, rồi middleware lỗi ở cuối.
// File này không bật máy chủ và không chạy việc định kỳ, để kiểm thử nạp app.js mà không kéo theo
// (máy chủ bật ở server.js).
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import config from './config.js';
import { DU_LIEU_DANG_KHOA_TOI_DA } from './constants/nghiepVu.js';
import routes from './routes/index.js';
import { checkOrigin } from './middleware/checkOrigin.js';
import { docPhien } from './middleware/auth.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

const app = express();

// Máy trung gian (Phần chung C4): luôn tin máy trung gian chạy ngay trên máy mình (loopback, tức Vite),
// cộng thêm các địa chỉ ghi trong TIN_MAY_TRUNG_GIAN (để trống là không thêm).
app.set('trust proxy', ['loopback', ...config.mayTrungGianThem]);

// 'same-site' để trang học (localhost:5173) phát được video và ảnh từ backend
app.use(helmet({ crossOriginResourcePolicy: { policy: 'same-site' } }));
app.use(cors({ origin: config.clientOrigin, credentials: true }));
// Giới hạn chung 1MB. Đường đăng và sửa khóa học (Phần 7, 8) tự đặt giới hạn 20MB cho riêng đường đó.
// Bộ đọc riêng gắn trước bộ đọc chung: đã đọc xong thì bộ đọc chung bỏ qua (Phần 7 mục 7.5).
app.use('/api/nguoi-cung-cap/khoa-hoc', express.json({ limit: DU_LIEU_DANG_KHOA_TOI_DA }));
app.use(express.json({ limit: '1mb' }));
// COOKIE_SECRET dùng để ký các cookie có chữ ký (ava_cho_xac_nhan ở Phần 3, ava_gioi_thieu ở Phần 11)
app.use(cookieParser(config.cookieSecret));
app.use(checkOrigin);
// Đọc phiên ở mọi đường có gửi kèm cookie ava_phien, kể cả đường công khai (Phần chung C4)
app.use(docPhien);

app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

export default app;
