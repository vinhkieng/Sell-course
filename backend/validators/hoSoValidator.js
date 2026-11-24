// Quy tắc dữ liệu gửi lên của trang hồ sơ (Phần 5 mục 5.4, 5.7). Câu lỗi đúng nguyên văn đặc tả.
import { z } from 'zod';
import { oGmail, oMatKhau } from './taiKhoanValidator.js';
import { CHU_VIET } from './chuViet.js';

const HO_TEN_SAI = 'Họ tên từ 2 đến 100 ký tự, chỉ gồm chữ và dấu cách';
// Chỉ chữ a-z, chữ tiếng Việt có dấu và dấu cách (Phần 5 mục 5.4)
const HO_TEN_DUNG = new RegExp(`^[${CHU_VIET} ]{2,100}$`);
const SDT_SAI = 'Số điện thoại gồm 10 chữ số, bắt đầu bằng số 0';
export const NGAY_SINH_SAI = 'Ngày sinh không hợp lệ';

// Chuỗi rỗng nghĩa là để trống (lưu NULL); luật để trống theo vai trò kiểm ở hoSoService
const oChu = (cau) => z.string({ error: cau });

// Ngày có thật dạng yyyy-mm-dd, từ 1900-01-01. "Trước hôm nay" so ở MySQL (Phần chung C10).
function ngayCoThat(chu) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(chu)) return false;
  const ngay = new Date(`${chu}T00:00:00Z`);
  return !Number.isNaN(ngay.getTime()) && ngay.toISOString().slice(0, 10) === chu && chu >= '1900-01-01';
}

export const schemaCapNhatHoSo = z.object({
  // Chuẩn hóa dấu tiếng Việt (NFC) rồi bỏ khoảng trắng thừa ở đầu, cuối và giữa
  ho_ten: oChu(HO_TEN_SAI)
    .transform((v) => v.normalize('NFC').replace(/\s+/g, ' ').trim())
    .refine((v) => v === '' || HO_TEN_DUNG.test(v), HO_TEN_SAI),
  gmail: oGmail,
  so_dien_thoai: oChu(SDT_SAI)
    .trim()
    .refine((v) => v === '' || /^0\d{9}$/.test(v), SDT_SAI),
  // Hai ô chỉ học viên có; người khác gửi kèm thì bị bỏ qua
  nghe_nghiep: z.string().trim().max(100, 'Nghề nghiệp tối đa 100 ký tự').optional().default(''),
  ngay_sinh: z
    .string()
    .trim()
    .refine((v) => v === '' || ngayCoThat(v), NGAY_SINH_SAI)
    .optional()
    .default(''),
});

export const schemaDoiMatKhau = z
  .object({
    mat_khau_hien_tai: oChu('Vui lòng nhập mật khẩu').min(1, 'Vui lòng nhập mật khẩu'),
    mat_khau_moi: oMatKhau,
    xac_nhan: oChu('Vui lòng nhập lại mật khẩu').min(1, 'Vui lòng nhập lại mật khẩu'),
  })
  .refine((d) => d.mat_khau_moi === d.xac_nhan, {
    path: ['xac_nhan'],
    message: 'Mật khẩu nhập lại không khớp',
    when: () => true,
  });
