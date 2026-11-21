// Đọc cấu hình từ file .env một lần duy nhất, kiểm tra bằng Zod (Phần chung C2).
// Thiếu biến bắt buộc thì dừng ngay lúc khởi động và báo rõ dòng nào sai.
// Không bao giờ in giá trị bí mật ra màn hình hay ghi vào nhật ký.
import 'dotenv/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';

const THU_MUC_BACKEND = path.dirname(fileURLToPath(import.meta.url));

const chuoiTuyChon = z.string().optional().default('');
const batBuoc = (ten) =>
  z.string({ error: `Chưa có dòng ${ten}` }).min(1, `Chưa điền giá trị cho ${ten}`);
const khoaBiMat = (ten) =>
  z.string({ error: `Chưa có dòng ${ten}` }).min(16, `${ten} phải dài ít nhất 16 ký tự`);
const soCong = (ten, macDinh) =>
  z.coerce
    .number({ error: `${ten} phải là số` })
    .int(`${ten} phải là số nguyên`)
    .positive(`${ten} phải lớn hơn 0`)
    .max(65535, `${ten} không được lớn hơn 65535`)
    .default(macDinh);

const schema = z.object({
  // test: dùng khi chạy kiểm thử (npm test tự đặt)
  NODE_ENV: z
    .enum(['development', 'production', 'test'], {
      error: 'NODE_ENV chỉ được là development, production hoặc test',
    })
    .default('development'),
  PORT: soCong('PORT', 8000),
  // Bỏ dấu "/" ở cuối nếu lỡ ghi, vì kiểm tra Origin so khớp từng ký tự (Phần chung C6)
  CLIENT_ORIGIN: z
    .url({ error: 'CLIENT_ORIGIN phải là địa chỉ đầy đủ, ví dụ http://localhost:5173' })
    .default('http://localhost:5173')
    .transform((diaChi) => diaChi.replace(/\/+$/, '')),
  // Để trống là tắt (Phần chung C4). Chỉ điền khi đưa web lên máy chủ thật có máy trung gian khác
  // đứng trước: ghi địa chỉ IP của máy trung gian đó, nhiều địa chỉ thì cách nhau bằng dấu phẩy.
  TIN_MAY_TRUNG_GIAN: chuoiTuyChon,

  DB_HOST: batBuoc('DB_HOST'),
  DB_PORT: soCong('DB_PORT', 3306),
  DB_NAME: batBuoc('DB_NAME'),
  DB_USER: batBuoc('DB_USER'),
  DB_PASSWORD: chuoiTuyChon,

  JWT_SECRET: khoaBiMat('JWT_SECRET'),
  COOKIE_SECRET: khoaBiMat('COOKIE_SECRET'),

  // Các biến dưới đây chỉ cần khi làm tới chức năng tương ứng. Thiếu mà dùng tới thì
  // chức năng đó báo rõ thiếu dòng nào (Phần chung C2, C14; Phần 13 mục 13.5).
  VNP_TMN_CODE: chuoiTuyChon,
  VNP_HASH_SECRET: chuoiTuyChon,
  VNP_URL: chuoiTuyChon,
  VNP_API_URL: chuoiTuyChon,
  GMAIL_USER: chuoiTuyChon,
  GMAIL_APP_PASSWORD: chuoiTuyChon,
  ADMIN_TEN_DANG_NHAP: chuoiTuyChon,
  ADMIN_GMAIL: chuoiTuyChon,
  ADMIN_MAT_KHAU: chuoiTuyChon,

  // Chỉ dùng khi chạy kiểm thử, không ghi trong .env.example: đổi chỗ để file chinh_sach.json
  // để kiểm thử không ghi đè file thật (Phần 1 mục 1.4, Phần 24).
  DUONG_DAN_CHINH_SACH: chuoiTuyChon,
});

const ketQua = schema.safeParse(process.env);
if (!ketQua.success) {
  console.error('Cấu hình trong file .env chưa đúng:');
  for (const loi of ketQua.error.issues) {
    console.error(`  - ${loi.path.join('.')}: ${loi.message}`);
  }
  console.error('Hãy mở file backend/.env, sửa các dòng trên rồi chạy lại.');
  process.exit(1);
}

const env = ketQua.data;
const thuMucLuuTru = path.join(THU_MUC_BACKEND, 'luu_tru');

const config = {
  moiTruong: env.NODE_ENV,
  laProduction: env.NODE_ENV === 'production',
  laKiemThu: env.NODE_ENV === 'test',
  port: env.PORT,
  clientOrigin: env.CLIENT_ORIGIN,
  // Danh sách địa chỉ máy trung gian thêm vào ngoài loopback (Phần chung C4)
  mayTrungGianThem: env.TIN_MAY_TRUNG_GIAN.split(',')
    .map((diaChi) => diaChi.trim())
    .filter(Boolean),
  db: {
    host: env.DB_HOST,
    port: env.DB_PORT,
    database: env.DB_NAME,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
  },
  jwtSecret: env.JWT_SECRET,
  cookieSecret: env.COOKIE_SECRET,
  vnpay: {
    tmnCode: env.VNP_TMN_CODE,
    hashSecret: env.VNP_HASH_SECRET,
    url: env.VNP_URL,
    apiUrl: env.VNP_API_URL,
  },
  gmail: {
    user: env.GMAIL_USER,
    appPassword: env.GMAIL_APP_PASSWORD,
  },
  admin: {
    tenDangNhap: env.ADMIN_TEN_DANG_NHAP,
    gmail: env.ADMIN_GMAIL,
    matKhau: env.ADMIN_MAT_KHAU,
  },
  // Thư mục lưu file (Phần chung C12)
  thuMucBackend: THU_MUC_BACKEND,
  thuMucLuuTru,
  duongDanChinhSach:
    env.DUONG_DAN_CHINH_SACH || path.join(thuMucLuuTru, 'noi_dung', 'chinh_sach.json'),
  duongDanChinhSachMacDinh: path.join(THU_MUC_BACKEND, 'du_lieu_mac_dinh', 'chinh_sach.json'),
};

export default config;
