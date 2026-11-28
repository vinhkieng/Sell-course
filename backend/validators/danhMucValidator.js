// Quy tắc dữ liệu gửi lên của phần danh mục (Phần 6 mục 6.4, 6.6, 6.8). Phần 7 dùng lại oTenDanhMuc.
import { z } from 'zod';
import { CHU_VIET } from './chuViet.js';
import { TEN_DANH_MUC_TOI_THIEU, TEN_DANH_MUC_TOI_DA } from '../constants/nghiepVu.js';

export const TEN_DANH_MUC_SAI =
  'Tên danh mục từ 2 đến 50 ký tự, gồm chữ có dấu hoặc không dấu, chữ số, khoảng trắng và các ký tự + # . / -';
// Chữ a-z, chữ tiếng Việt có dấu, chữ số 0-9, dấu cách và + # . / -
const TEN_DUNG = new RegExp(`^[${CHU_VIET}0-9 +#./-]{${TEN_DANH_MUC_TOI_THIEU},${TEN_DANH_MUC_TOI_DA}}$`);
// Câu chung cho các ô người dùng không gõ (danh sách id, số trang); trang không để lọt dữ liệu sai tới đây
const SAI_CHUNG = 'Thông tin chưa hợp lệ, vui lòng kiểm tra lại.';

// Bỏ khoảng trắng ở đầu, cuối và khoảng trắng thừa ở giữa; viết hoa chữ đầu của mọi từ (từ cách nhau
// bằng dấu cách), các chữ khác giữ nguyên: "  luyện   thi IELTS " thành "Luyện Thi IELTS"
export function chuanHoaTenDanhMuc(ten) {
  return ten
    .normalize('NFC')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .map((tu) => tu.charAt(0).toUpperCase() + tu.slice(1))
    .join(' ');
}

// Tên đã chuẩn hóa có đúng luật 6.4 không (Phần 7 dùng khi chọn "Khác")
export const laTenDanhMucDung = (ten) => TEN_DUNG.test(ten);

export const oTenDanhMuc = z
  .string({ error: TEN_DANH_MUC_SAI })
  .transform(chuanHoaTenDanhMuc)
  .refine(laTenDanhMucDung, TEN_DANH_MUC_SAI);

export const schemaTenDanhMuc = z.object({ ten: oTenDanhMuc });

export const schemaGopDanhMuc = z.object({
  ids: z
    .array(z.number({ error: SAI_CHUNG }).int(SAI_CHUNG).positive(SAI_CHUNG), { error: SAI_CHUNG })
    .min(2, SAI_CHUNG)
    .refine((ids) => new Set(ids).size === ids.length, SAI_CHUNG),
  ten_moi: oTenDanhMuc,
});

export const schemaIdDanhMuc = z.object({
  id: z.coerce.number({ error: SAI_CHUNG }).int(SAI_CHUNG).positive(SAI_CHUNG),
});

export const schemaTrang = z.object({
  trang: z.coerce.number({ error: SAI_CHUNG }).int(SAI_CHUNG).min(1, SAI_CHUNG).default(1),
});
