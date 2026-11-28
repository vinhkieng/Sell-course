// Đăng khóa học mới của người cung cấp (Phần 7 mục 7.4, 7.5). Phần 8 thêm việc sửa, ẩn, xóa khóa vào đây.
// Dữ liệu tới đây đã qua schemaDangKhoaHoc (validators/khoaHocValidator.js).
import { randomUUID } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import config from '../config.js';
import { withTransaction } from '../database/db.js';
import { loi400, loi409 } from '../lib/httpError.js';
import { LOAI_BAI_HOC, HANH_DONG_LICH_SU } from '../constants/trangThai.js';
import { LOAI_FILE_TAM } from '../validators/khoaHocValidator.js';
import { docFileTam, FILE_DA_CO, LUAT_LOAI_FILE } from './fileTamService.js';
import * as nguoiDungRepo from '../repositories/nguoiDungRepository.js';
import * as danhMucRepo from '../repositories/danhMucRepository.js';
import * as khoaHocRepo from '../repositories/khoaHocRepository.js';
import * as baiHocRepo from '../repositories/baiHocRepository.js';
import { ghiLichSu } from '../repositories/lichSuKhoaHocRepository.js';

export const THIEU_HO_SO = 'Hãy cập nhật họ tên và số điện thoại trong hồ sơ trước khi tạo khóa học.';
const SAI_CHUNG = 'Thông tin chưa hợp lệ, vui lòng kiểm tra lại.';

const loiTrungFile = (viTriBai) =>
  loi409(FILE_DA_CO, { ma: 'TRUNG_FILE', them: { vi_tri_bai: viTriBai } });

// File tạm không còn (đã bị xóa ở tab khác, quá 24 giờ) hoặc không thuộc người này, hoặc sai loại
const loiFileTam = (viTriBai) =>
  loi400(SAI_CHUNG, { ma: 'FILE_TAM_KHONG_CON', them: viTriBai ? { vi_tri_bai: viTriBai } : undefined });

// Đọc file tạm của từng bài và ảnh bìa; kiểm thuộc đúng người, còn tồn tại, đúng loại
async function docCacFileTam(idNguoiCungCap, thongTin, cacBai) {
  const fileBai = new Map();
  for (const bai of cacBai) {
    if (bai.loai === LOAI_BAI_HOC.TRAC_NGHIEM) continue;
    const file = await docFileTam(idNguoiCungCap, bai.ma_file_tam);
    if (!file || file.loai !== bai.loai) throw loiFileTam(bai.so_thu_tu);
    fileBai.set(bai.so_thu_tu, file);
  }
  let anhBia = null;
  if (thongTin.ma_file_tam_anh_bia) {
    anhBia = await docFileTam(idNguoiCungCap, thongTin.ma_file_tam_anh_bia);
    if (!anhBia || anhBia.loai !== LOAI_FILE_TAM.ANH_BIA) throw loiFileTam(null);
  }
  return { fileBai, anhBia };
}

// Kiểm trùng dấu vân tay trước khi ghi: với bài trên AVA và giữa các bài của chính khóa này.
// Trùng thì báo bài có số thứ tự nhỏ nhất bị trùng.
async function kiemTrungFile(cacBai, fileBai) {
  const daGap = new Set();
  for (const bai of cacBai) {
    const file = fileBai.get(bai.so_thu_tu);
    if (!file) continue;
    if (daGap.has(file.ma_bam) || (await baiHocRepo.coMaBamDangDung(file.ma_bam))) throw loiTrungFile(bai.so_thu_tu);
    daGap.add(file.ma_bam);
  }
}

// Chỗ chính thức của một file tạm: <thư mục theo loại>/<uuid mới>.<đuôi>, đường dẫn tương đối tính từ luu_tru
const duongDanChinhThuc = (file) => `${LUAT_LOAI_FILE[file.loai].thuMuc}/${randomUUID()}.${file.duoi}`;

export async function dangKhoaHoc(nguoiDung, { thong_tin: thongTin, bai_hoc: baiHoc }) {
  const nd = await nguoiDungRepo.timTheoId(nguoiDung.id);
  if (!nd.ho_ten || !nd.so_dien_thoai) throw loi400(THIEU_HO_SO, { ma: 'THIEU_HO_SO' });

  const idNguoiCungCap = nguoiDung.id_nguoi_cung_cap;
  const cacBai = [...baiHoc].sort((a, b) => a.so_thu_tu - b.so_thu_tu);
  const { fileBai, anhBia } = await docCacFileTam(idNguoiCungCap, thongTin, cacBai);
  await kiemTrungFile(cacBai, fileBai);

  // Các file sẽ chuyển từ chỗ tạm sang chỗ chính thức: { tu, den (tuyệt đối), duongDan (lưu vào database) }
  const cacFile = [];
  const chuanBi = (file) => {
    const duongDan = duongDanChinhThuc(file);
    cacFile.push({ tu: file.duongDan, den: path.join(config.thuMucLuuTru, duongDan), moTa: file, duongDan });
    return duongDan;
  };
  const duongDanAnhBia = anhBia ? chuanBi(anhBia) : null;
  const duongDanBai = new Map([...fileBai].map(([so, file]) => [so, chuanBi(file)]));

  const daChuyen = [];
  try {
    const idKhoaHoc = await withTransaction(async (conn) => {
      const idDanhMuc = await layDanhMuc(thongTin, conn);
      const id = await khoaHocRepo.them(
        {
          idNguoiCungCap,
          idDanhMuc,
          ten: thongTin.ten_khoa_hoc,
          moTa: thongTin.mo_ta,
          anhBia: duongDanAnhBia,
          giaBan: thongTin.gia_ban,
          hocDuocGi: thongTin.hoc_duoc_gi,
          yeuCau: thongTin.yeu_cau,
          danhChoAi: thongTin.danh_cho_ai,
        },
        conn,
      );

      for (const bai of cacBai) {
        const file = fileBai.get(bai.so_thu_tu);
        let idBai;
        try {
          idBai = await baiHocRepo.them(
            {
              idKhoaHoc: id,
              ten: bai.ten_bai_hoc,
              soThuTu: bai.so_thu_tu,
              loai: bai.loai,
              duongDanFile: duongDanBai.get(bai.so_thu_tu),
              tenFile: file?.ten_file,
              dungLuong: file?.dung_luong,
              thoiLuong: file?.thoi_luong,
              maBam: file?.ma_bam,
              thoiGianLamBai: bai.thoi_gian_lam_bai,
            },
            conn,
          );
        } catch (loi) {
          // Có người vừa đăng cùng file sau lúc kiểm ở trên: ràng buộc không trùng của MySQL chặn đúng bài này
          if (loi.code === 'ER_DUP_ENTRY' && loi.message.includes('ma_bam_dang_dung')) throw loiTrungFile(bai.so_thu_tu);
          throw loi;
        }
        if (bai.loai === LOAI_BAI_HOC.TRAC_NGHIEM) await baiHocRepo.themCauHoi(idBai, bai.cau_hoi, conn);
      }

      // Một dòng lịch sử cho cả khóa (Phần 7 mục 7.4, Phần chung C15)
      await ghiLichSu([{ idKhoaHoc: id, idNguoiDung: nguoiDung.id, hanhDong: HANH_DONG_LICH_SU.DANG_KHOA_HOC }], conn);

      // Chuyển file trước khi giao dịch xong; có lỗi thì trả file về chỗ tạm ở khối catch bên dưới
      for (const f of cacFile) {
        await fs.rename(f.tu, f.den);
        daChuyen.push(f);
      }
      return id;
    });

    // Đăng xong: xóa file mô tả của các file tạm đã chuyển
    for (const f of cacFile) {
      await fs.rm(path.join(path.dirname(f.tu), `${f.moTa.ma}.json`), { force: true });
    }
    return { id: idKhoaHoc };
  } catch (loi) {
    for (const f of daChuyen.reverse()) {
      await fs.rename(f.den, f.tu).catch(() => {});
    }
    throw loi;
  }
}

// Danh mục của khóa: chọn có sẵn (phải còn tồn tại), hoặc "Khác" thì tạo mới; tên mới mà lúc này đã có
// (ví dụ admin vừa thêm) thì dùng danh mục có sẵn, không báo lỗi (Phần 7 mục 7.4)
async function layDanhMuc(thongTin, conn) {
  if (thongTin.ten_danh_muc_moi) {
    const coSan = await danhMucRepo.timTheoTen(thongTin.ten_danh_muc_moi, conn);
    if (coSan) return coSan.id;
    try {
      return await danhMucRepo.them(thongTin.ten_danh_muc_moi, conn);
    } catch (loi) {
      // Người khác vừa thêm đúng tên này cùng lúc: dùng danh mục đó
      const vuaThem = loi.code === 'ER_DUP_ENTRY' && (await danhMucRepo.timTheoTen(thongTin.ten_danh_muc_moi, conn));
      if (!vuaThem) throw loi;
      return vuaThem.id;
    }
  }
  // Khóa dòng danh mục để admin không xóa hoặc gộp nó giữa chừng
  const [danhMuc] = await danhMucRepo.khoaTheoIds([thongTin.id_danh_muc], conn);
  if (!danhMuc) {
    const cau = 'Danh mục không còn tồn tại.';
    throw loi400(cau, { ma: 'DANH_MUC_KHONG_CON', cacO: { 'thong_tin.id_danh_muc': cau } });
  }
  return danhMuc.id;
}
