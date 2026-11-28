// Quy tắc dữ liệu gửi lên khi tạo khóa học (Phần 7 mục 7.4, 7.5, 7.7). Phần 8 dùng lại.
// Câu lỗi đúng nguyên văn đặc tả. Ô nào trang đã chặn sẵn (độ dài tên, số câu tối đa...) mà vẫn sai
// thì dùng câu chung hoặc "Nội dung quá dài.".
import { z } from 'zod';
import { LOAI_BAI_HOC, DAP_AN } from '../constants/trangThai.js';
import {
  GIA_BAN_TOI_THIEU,
  GIA_BAN_TOI_DA,
  SO_BAI_TOI_THIEU,
  SO_BAI_TOI_DA,
  SO_CAU_TOI_THIEU,
  SO_CAU_TOI_DA,
  THOI_GIAN_LAM_BAI_TOI_THIEU_PHUT,
  THOI_GIAN_LAM_BAI_TOI_DA_PHUT,
  TEN_KHOA_HOC_TOI_DA,
  TEN_BAI_HOC_TOI_DA,
  NOI_DUNG_DAI_TOI_DA,
  CAU_HOI_TOI_DA,
  LUA_CHON_TOI_DA,
} from '../constants/nghiepVu.js';
import { chuanHoaTenDanhMuc, TEN_DANH_MUC_SAI, laTenDanhMucDung } from './danhMucValidator.js';

const SAI_CHUNG = 'Thông tin chưa hợp lệ, vui lòng kiểm tra lại.';
const QUA_DAI = 'Nội dung quá dài.';
export const BAI_1_SAI = 'Bài số 1 phải là bài video hoặc tài liệu.';
export const LOAI_FILE_TAM = Object.freeze({ ...LOAI_BAI_HOC, ANH_BIA: 'Ảnh bìa' });

// Mã file tạm là uuid viết thường (tên file trong luu_tru/tam/<id người cung cấp>/)
const MAU_MA_FILE_TAM = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
export const laMaFileTam = (ma) => typeof ma === 'string' && MAU_MA_FILE_TAM.test(ma);
const oMaFileTam = z.string({ error: SAI_CHUNG }).refine(laMaFileTam, SAI_CHUNG);

// Đếm theo ký tự (kể cả chữ ngoài bảng mã cơ bản), không theo đơn vị UTF-16
const soKyTu = (chu) => [...chu].length;

// Ô chữ bắt buộc: bỏ khoảng trắng đầu cuối, trống thì báo cauTrong, dài quá thì báo cauDai
const oBatBuoc = (cauTrong, toiDa, cauDai = QUA_DAI) =>
  z
    .string({ error: cauTrong })
    .trim()
    .min(1, cauTrong)
    .refine((v) => soKyTu(v) <= toiDa, cauDai);

// Ô chữ dài không bắt buộc (mỗi dòng một ý); để trống thì lưu NULL
const oKhongBatBuoc = z
  .string({ error: QUA_DAI })
  .trim()
  .refine((v) => soKyTu(v) <= NOI_DUNG_DAI_TOI_DA, QUA_DAI)
  .optional()
  .transform((v) => v || null);

const GIA_SAI = 'Giá bán phải từ 10.000đ đến 50.000.000đ';

const schemaThongTin = z
  .object({
    ten_khoa_hoc: oBatBuoc('Vui lòng nhập tên khóa học', TEN_KHOA_HOC_TOI_DA),
    mo_ta: oBatBuoc('Vui lòng nhập mô tả khóa học', NOI_DUNG_DAI_TOI_DA),
    id_danh_muc: z.number({ error: 'Vui lòng chọn danh mục' }).int().positive().nullish(),
    ten_danh_muc_moi: z
      .string({ error: TEN_DANH_MUC_SAI })
      .nullish()
      .transform((v) => (v == null ? null : chuanHoaTenDanhMuc(v))),
    gia_ban: z.number({ error: GIA_SAI }).int(GIA_SAI).min(GIA_BAN_TOI_THIEU, GIA_SAI).max(GIA_BAN_TOI_DA, GIA_SAI),
    hoc_duoc_gi: oKhongBatBuoc,
    yeu_cau: oKhongBatBuoc,
    danh_cho_ai: oKhongBatBuoc,
    ma_file_tam_anh_bia: oMaFileTam.nullish(),
  })
  .superRefine((tt, ctx) => {
    // Đúng một danh mục: chọn trong danh sách, hoặc chọn "Khác" rồi gõ tên mới (Phần 6 mục 6.4)
    if (tt.ten_danh_muc_moi !== null) {
      if (tt.ten_danh_muc_moi === '') {
        ctx.addIssue({ code: 'custom', path: ['ten_danh_muc_moi'], message: 'Vui lòng nhập tên danh mục mới' });
      } else if (!laTenDanhMucDung(tt.ten_danh_muc_moi)) {
        ctx.addIssue({ code: 'custom', path: ['ten_danh_muc_moi'], message: TEN_DANH_MUC_SAI });
      }
    } else if (!tt.id_danh_muc) {
      ctx.addIssue({ code: 'custom', path: ['id_danh_muc'], message: 'Vui lòng chọn danh mục' });
    }
  });

const oTenBai = oBatBuoc('Vui lòng nhập tên bài', TEN_BAI_HOC_TOI_DA);
const oSoThuTu = z.number({ error: SAI_CHUNG }).int(SAI_CHUNG).min(1, SAI_CHUNG);

const LUA_CHON_THIEU = 'Vui lòng nhập đủ 4 lựa chọn';
const oLuaChon = oBatBuoc(LUA_CHON_THIEU, LUA_CHON_TOI_DA);

const schemaCauHoi = z.object({
  noi_dung: oBatBuoc('Vui lòng nhập nội dung câu hỏi', CAU_HOI_TOI_DA),
  lua_chon_a: oLuaChon,
  lua_chon_b: oLuaChon,
  lua_chon_c: oLuaChon,
  lua_chon_d: oLuaChon,
  dap_an_dung: z.enum(DAP_AN, { error: 'Vui lòng chọn đáp án đúng' }),
});

const THOI_GIAN_SAI = 'Thời gian làm bài từ 1 đến 180 phút.';

const schemaBaiHoc = z.discriminatedUnion(
  'loai',
  [
    z.object({ loai: z.literal(LOAI_BAI_HOC.VIDEO), ten_bai_hoc: oTenBai, so_thu_tu: oSoThuTu, ma_file_tam: oMaFileTam }),
    z.object({ loai: z.literal(LOAI_BAI_HOC.TAI_LIEU), ten_bai_hoc: oTenBai, so_thu_tu: oSoThuTu, ma_file_tam: oMaFileTam }),
    z.object({
      loai: z.literal(LOAI_BAI_HOC.TRAC_NGHIEM),
      ten_bai_hoc: oTenBai,
      so_thu_tu: oSoThuTu,
      thoi_gian_lam_bai: z
        .number({ error: THOI_GIAN_SAI })
        .int(THOI_GIAN_SAI)
        .min(THOI_GIAN_LAM_BAI_TOI_THIEU_PHUT, THOI_GIAN_SAI)
        .max(THOI_GIAN_LAM_BAI_TOI_DA_PHUT, THOI_GIAN_SAI),
      cau_hoi: z
        .array(schemaCauHoi, { error: 'Bài trắc nghiệm cần ít nhất 5 câu.' })
        .min(SO_CAU_TOI_THIEU, 'Bài trắc nghiệm cần ít nhất 5 câu.')
        .max(SO_CAU_TOI_DA, SAI_CHUNG),
    }),
  ],
  { error: SAI_CHUNG },
);

export const schemaDangKhoaHoc = z
  .object({
    thong_tin: schemaThongTin,
    bai_hoc: z.array(schemaBaiHoc, { error: SAI_CHUNG }).min(SO_BAI_TOI_THIEU, SAI_CHUNG).max(SO_BAI_TOI_DA, SAI_CHUNG),
    cam_ket: z.literal(true, { error: SAI_CHUNG }),
  })
  .superRefine((d, ctx) => {
    // Số thứ tự liền nhau từ 1; bài số 1 là video hoặc tài liệu (Phần 7 mục 7.4, 7.5)
    const cacSo = d.bai_hoc.map((b) => b.so_thu_tu).sort((a, b) => a - b);
    if (cacSo.some((so, i) => so !== i + 1)) {
      ctx.addIssue({ code: 'custom', path: ['bai_hoc'], message: SAI_CHUNG });
      return;
    }
    if (d.bai_hoc.find((b) => b.so_thu_tu === 1).loai === LOAI_BAI_HOC.TRAC_NGHIEM) {
      ctx.addIssue({ code: 'custom', path: ['bai_hoc'], message: BAI_1_SAI });
    }
  });

// Các ô gửi kèm file tạm (multipart, mọi giá trị là chữ). thoi_luong kiểm ở service theo loại file.
export const schemaFileTam = z.object({
  loai: z.enum(Object.values(LOAI_FILE_TAM), { error: SAI_CHUNG }),
  thoi_luong: z.string().optional(),
  so_bai_hien_co: z.coerce.number({ error: SAI_CHUNG }).int(SAI_CHUNG).min(0, SAI_CHUNG).default(0),
  // Danh sách mã file tạm đang dùng trên trang, gửi dạng chuỗi JSON
  ma_file_tam_dang_dung: z
    .string()
    .optional()
    .transform((chu, ctx) => {
      if (!chu) return [];
      try {
        const ds = JSON.parse(chu);
        if (Array.isArray(ds) && ds.every(laMaFileTam)) return ds;
      } catch {
        // rơi xuống báo lỗi bên dưới
      }
      ctx.addIssue({ code: 'custom', message: SAI_CHUNG });
      return z.NEVER;
    }),
});

export const schemaMaFileTam = z.object({ ma_file_tam: oMaFileTam });
