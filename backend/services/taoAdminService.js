// Tạo tài khoản admin (Phần chung C2). Dùng chung cho lệnh npm run seed và cho phần chuẩn bị kiểm thử.
import bcrypt from 'bcrypt';
import { z } from 'zod';
import { withTransaction } from '../database/db.js';
import { VAI_TRO } from '../constants/vaiTro.js';
import { sinhMaGioiThieu } from '../lib/maGioiThieu.js';
import * as nguoiDungRepo from '../repositories/nguoiDungRepository.js';
import * as quanTriVienRepo from '../repositories/quanTriVienRepository.js';

// Thông tin hợp đồng mẫu của admin đầu tiên (Phần chung C2). Admin thứ hai trở đi dùng số tự tăng:
// CCCD 079200001235, 079200001236...; hợp đồng HD-2026-002, HD-2026-003...
const CCCD_DAU_TIEN = 79200001234;
const HOP_DONG_DAU_TIEN = 1;
const HOP_DONG_MAU = {
  ngayCapCccd: '2021-05-01',
  noiCapCccd: 'Cục Cảnh sát quản lý hành chính về trật tự xã hội',
  ngayBatDauLam: '2026-01-02',
};

// Luật giống các ràng buộc CHECK trong file SQL
export const schemaAdmin = z.object({
  tenDangNhap: z
    .string()
    .regex(/^[A-Za-z0-9]{4,30}$/, 'ADMIN_TEN_DANG_NHAP chỉ gồm chữ không dấu và số, 4 đến 30 ký tự'),
  gmail: z
    .string()
    .trim()
    .toLowerCase()
    .regex(
      /^[a-z0-9]+(\.[a-z0-9]+)*@gmail\.com$/,
      'ADMIN_GMAIL phải là Gmail đúng định dạng, ví dụ ten@gmail.com',
    ),
  matKhau: z.string().regex(/^\d{6}$/, 'ADMIN_MAT_KHAU phải gồm đúng 6 chữ số'),
});

// Trả về { daTao: false } nếu tên đăng nhập hoặc Gmail đã có (bỏ qua, không báo lỗi),
// hoặc { daTao: true, soHopDong } khi tạo xong.
export async function taoAdmin(thongTin) {
  const { tenDangNhap, gmail, matKhau } = schemaAdmin.parse(thongTin);

  const daCo = await nguoiDungRepo.timTheoTenDangNhapHoacGmail(tenDangNhap, gmail);
  if (daCo.length > 0) return { daTao: false };

  const matKhauDaBam = await bcrypt.hash(matKhau, 10);

  return withTransaction(async (conn) => {
    let maGioiThieu = sinhMaGioiThieu();
    while (await nguoiDungRepo.maGioiThieuDaCo(maGioiThieu, conn)) maGioiThieu = sinhMaGioiThieu();

    // Tìm số CCCD và số hợp đồng mẫu kế tiếp chưa dùng
    let thuTu = 0;
    let soCccd;
    let soHopDong;
    for (;;) {
      soCccd = String(CCCD_DAU_TIEN + thuTu).padStart(12, '0');
      soHopDong = `HD-2026-${String(HOP_DONG_DAU_TIEN + thuTu).padStart(3, '0')}`;
      const trung =
        (await quanTriVienRepo.soCccdDaCo(soCccd, conn)) ||
        (await quanTriVienRepo.soHopDongDaCo(soHopDong, conn));
      if (!trung) break;
      thuTu += 1;
    }

    const idNguoiDung = await nguoiDungRepo.themNguoiDung(
      { tenDangNhap, gmail, matKhauDaBam, vaiTro: VAI_TRO.ADMIN, maGioiThieu },
      conn,
    );
    await quanTriVienRepo.themQuanTriVien({ idNguoiDung, soCccd, soHopDong, ...HOP_DONG_MAU }, conn);
    return { daTao: true, soHopDong };
  });
}
