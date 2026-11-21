// Lệnh npm run seed: tạo tài khoản admin từ ba dòng ADMIN_TEN_DANG_NHAP, ADMIN_GMAIL, ADMIN_MAT_KHAU
// trong backend/.env (Phần chung C2). Chạy lại được: tài khoản đã có thì bỏ qua, không báo lỗi.
// Script chỉ thêm dòng, không tạo hay sửa bảng. Không in mật khẩu hay số CCCD ra màn hình.
import config from '../config.js';
import pool from '../database/db.js';
import { schemaAdmin, taoAdmin } from '../services/taoAdminService.js';

async function main() {
  const kiemTra = schemaAdmin.safeParse(config.admin);
  if (!kiemTra.success) {
    console.error('Thông tin admin trong file .env chưa đúng:');
    for (const loi of kiemTra.error.issues) console.error(`  - ${loi.message}`);
    process.exitCode = 1;
    return;
  }

  const ketQua = await taoAdmin(config.admin);
  if (!ketQua.daTao) {
    console.log(
      `Đã có tài khoản dùng tên đăng nhập "${config.admin.tenDangNhap}" hoặc Gmail này, bỏ qua, không thêm trùng.`,
    );
    return;
  }
  console.log(
    `Đã tạo tài khoản admin "${config.admin.tenDangNhap}" (số hợp đồng ${ketQua.soHopDong}).`,
  );
}

try {
  await main();
} catch (loi) {
  console.error('Tạo tài khoản admin thất bại:', loi.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
