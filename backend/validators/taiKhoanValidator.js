// Quy tắc dữ liệu gửi lên của nhóm tài khoản. Câu lỗi đúng nguyên văn đặc tả.
import { z } from 'zod';
import { VAI_TRO } from '../constants/vaiTro.js';

// Ô bắt buộc: thiếu hẳn hoặc để trống đều báo cùng một câu
const oBatBuoc = (cau) => z.string({ error: cau });

// Giống ràng buộc ck_nguoi_dung_gmail trong file SQL (kiểm sau khi đã đổi chữ thường)
const MAU_GMAIL = /^[a-z0-9]+(\.[a-z0-9]+)*@gmail\.com$/;
const GMAIL_SAI = 'Gmail không đúng định dạng. Ví dụ: ten@gmail.com';

// Đăng ký (Phần 2 mục 2.4, 2.7)
export const schemaDangKy = z
  .object({
    ten_dang_nhap: oBatBuoc('Vui lòng nhập tên đăng nhập')
      .trim()
      .min(1, 'Vui lòng nhập tên đăng nhập')
      .regex(
        /^[A-Za-z0-9]{4,30}$/,
        'Tên đăng nhập chỉ gồm chữ không dấu và số, không có khoảng trắng, dấu hay ký tự đặc biệt (4 đến 30 ký tự)',
      ),
    // Đổi chữ thường trước khi kiểm, để "Abc@GMAIL.com" được nhận và lưu "abc@gmail.com"
    gmail: oBatBuoc('Vui lòng nhập Gmail')
      .trim()
      .toLowerCase()
      .min(1, 'Vui lòng nhập Gmail')
      .refine((v) => v.endsWith('@gmail.com'), 'Gmail phải có đuôi @gmail.com')
      .regex(MAU_GMAIL, GMAIL_SAI),
    mat_khau: oBatBuoc('Vui lòng nhập mật khẩu')
      .min(1, 'Vui lòng nhập mật khẩu')
      .regex(/^\d{6}$/, 'Mật khẩu phải gồm đúng 6 chữ số'),
    xac_nhan_mat_khau: oBatBuoc('Vui lòng nhập lại mật khẩu').min(1, 'Vui lòng nhập lại mật khẩu'),
    vai_tro: z.literal([VAI_TRO.HOC_VIEN, VAI_TRO.NGUOI_CUNG_CAP], { error: 'Vui lòng chọn vai trò' }),
    dong_y: z.literal(true, { error: 'Vui lòng đồng ý với Chính sách và điều khoản' }),
  })
  .refine((d) => d.mat_khau === d.xac_nhan_mat_khau, {
    path: ['xac_nhan_mat_khau'],
    message: 'Mật khẩu nhập lại không khớp',
    // Vẫn so khi ô khác đang sai, để trả lỗi của mọi ô trong một lần
    when: () => true,
  });

// Đăng nhập (Phần 3 mục 3.4 bước 1, 3.7)
export const schemaDangNhap = z.object({
  ten_dang_nhap: oBatBuoc('Vui lòng nhập tên đăng nhập').trim().min(1, 'Vui lòng nhập tên đăng nhập'),
  mat_khau: oBatBuoc('Vui lòng nhập mật khẩu')
    .min(1, 'Vui lòng nhập mật khẩu')
    .regex(/^\d{6}$/, 'Mật khẩu phải gồm đúng 6 chữ số'),
});

// Xác nhận địa chỉ mạng: mã 6 chữ số (trang không cho bấm khi chưa đủ 6 chữ số)
export const schemaXacNhanDangNhap = z.object({
  ma: z.string({ error: 'Mã xác nhận không đúng.' }).regex(/^\d{6}$/, 'Mã xác nhận không đúng.'),
});

// Quên mật khẩu (Phần 4 mục 4.3, 4.7): để trống, sai định dạng hay sai đuôi đều báo một câu
const oGmailQuenMatKhau = z.string({ error: GMAIL_SAI }).trim().toLowerCase().regex(MAU_GMAIL, GMAIL_SAI);

export const schemaQuenMatKhau = z.object({ gmail: oGmailQuenMatKhau });

// Đặt lại mật khẩu (Phần 4 mục 4.5): kiểm mật khẩu mới ở đây, trước khi xét mã
const MA_DAT_LAI_SAI = 'Mã xác nhận không đúng hoặc đã hết hạn';
const NHAP_LAI_KHONG_KHOP = 'Mật khẩu nhập lại không khớp';

export const schemaDatLaiMatKhau = z
  .object({
    gmail: oGmailQuenMatKhau,
    ma: z.string({ error: MA_DAT_LAI_SAI }).regex(/^\d{6}$/, MA_DAT_LAI_SAI),
    mat_khau_moi: z
      .string({ error: 'Mật khẩu phải gồm đúng 6 chữ số' })
      .regex(/^\d{6}$/, 'Mật khẩu phải gồm đúng 6 chữ số'),
    nhap_lai: z.string({ error: NHAP_LAI_KHONG_KHOP }),
  })
  .refine((d) => d.mat_khau_moi === d.nhap_lai, {
    path: ['nhap_lai'],
    message: NHAP_LAI_KHONG_KHOP,
    when: () => true,
  });
