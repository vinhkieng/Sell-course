// File tạm của người cung cấp lúc tạo hoặc sửa khóa (Phần 7 mục 7.4, 7.5; Phần chung C12, C13).
// Mỗi file nằm ở luu_tru/tam/<id người cung cấp>/<uuid>.<đuôi>, kèm file mô tả <uuid>.json.
// Mã file tạm (ma_file_tam) chính là uuid đó. Trang gửi kèm danh sách mã đang dùng trên trang;
// máy chủ chỉ so trùng và cộng hạn mức với các file trong danh sách đó, và chỉ đọc trong thư mục của chính người đó.
import { createHash, randomUUID } from 'node:crypto';
import { createReadStream } from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';
import { pipeline } from 'node:stream/promises';
import config from '../config.js';
import { loi400, loi409 } from '../lib/httpError.js';
import { loaiFileTrenDia } from '../lib/loaiFile.js';
import {
  VIDEO_TOI_DA_BYTE,
  TAI_LIEU_TOI_DA_BYTE,
  ANH_BIA_TOI_DA_MB,
  HAN_MUC_NGUOI_CUNG_CAP_BYTE,
  SO_BAI_TOI_DA,
  THOI_LUONG_VIDEO_TOI_THIEU_GIAY,
  THOI_LUONG_VIDEO_TOI_DA_GIAY,
  FILE_TAM_HET_HAN_GIO,
} from '../constants/nghiepVu.js';
import { LOAI_FILE_TAM, laMaFileTam } from '../validators/khoaHocValidator.js';
import { ANH_SAI } from './hoSoService.js';
import * as baiHocRepo from '../repositories/baiHocRepository.js';

export const FILE_DA_CO = 'File này đã có trên AVA';
const THOI_LUONG_SAI = 'Video phải dài từ 1 giây đến 6 giờ.';

// Luật của từng loại file: các kiểu thật được nhận (theo byte đầu), dung lượng tối đa, câu báo sai,
// thư mục chính thức khi đăng (Phần 7 mục 7.4, 7.7)
export const LUAT_LOAI_FILE = Object.freeze({
  [LOAI_FILE_TAM.VIDEO]: {
    cacKieu: ['mp4'],
    toiDa: VIDEO_TOI_DA_BYTE,
    cauSai: 'File phải là video .mp4 và không quá 300MB',
    thuMuc: 'video',
  },
  [LOAI_FILE_TAM.TAI_LIEU]: {
    cacKieu: ['pdf'],
    toiDa: TAI_LIEU_TOI_DA_BYTE,
    cauSai: 'File phải là .pdf và không quá 20MB',
    thuMuc: 'tai_lieu',
  },
  [LOAI_FILE_TAM.ANH_BIA]: {
    cacKieu: ['jpg', 'png'],
    toiDa: ANH_BIA_TOI_DA_MB * 1024 * 1024,
    cauSai: ANH_SAI,
    thuMuc: 'anh_bia',
  },
});

const loiFile = (cau) => loi400(cau, { cacO: { file: cau } });

export const thuMucTam = (idNguoiCungCap) => path.join(config.thuMucLuuTru, 'tam', String(idNguoiCungCap));

// Mã băm SHA-256 viết thường, đọc dần từng đoạn để file lớn không chiếm bộ nhớ (Phần chung C12)
async function bamFile(duongDan) {
  const bam = createHash('sha256');
  await pipeline(createReadStream(duongDan), bam);
  return bam.digest('hex');
}

// Đọc file mô tả của một file tạm thuộc người này. Không có (sai mã, đã xóa, của người khác) thì trả null.
export async function docFileTam(idNguoiCungCap, ma) {
  if (!laMaFileTam(ma)) return null;
  const thuMuc = thuMucTam(idNguoiCungCap);
  try {
    const moTa = JSON.parse(await fs.readFile(path.join(thuMuc, `${ma}.json`), 'utf8'));
    const duongDan = path.join(thuMuc, `${ma}.${moTa.duoi}`);
    await fs.access(duongDan);
    return { ...moTa, ma, duongDan };
  } catch {
    return null;
  }
}

// Nhận một file vừa được multer ghi vào thư mục tạm (tên tạm chưa có đuôi). Kiểm lần lượt theo mục 7.5:
// loại thật, dung lượng, thời lượng, hạn mức 5GB, số bài, dấu vân tay. Sai ở bước nào thì xóa file ngay.
export async function nhanFileTam(idNguoiCungCap, file, duLieu) {
  const luat = LUAT_LOAI_FILE[duLieu.loai];
  if (!file) throw loiFile(luat.cauSai);
  try {
    const kieu = await loaiFileTrenDia(file.path);
    if (!luat.cacKieu.includes(kieu) || file.size === 0 || file.size > luat.toiDa) throw loiFile(luat.cauSai);

    const laAnhBia = duLieu.loai === LOAI_FILE_TAM.ANH_BIA;
    let thoiLuong = null;
    if (duLieu.loai === LOAI_FILE_TAM.VIDEO) {
      thoiLuong = Number(duLieu.thoi_luong);
      if (
        !Number.isInteger(thoiLuong) ||
        thoiLuong < THOI_LUONG_VIDEO_TOI_THIEU_GIAY ||
        thoiLuong > THOI_LUONG_VIDEO_TOI_DA_GIAY
      ) {
        throw loiFile(THOI_LUONG_SAI);
      }
    }

    let maBam = null;
    if (!laAnhBia) {
      const cacFileTrang = (
        await Promise.all(duLieu.ma_file_tam_dang_dung.map((ma) => docFileTam(idNguoiCungCap, ma)))
      ).filter((f) => f && f.loai !== LOAI_FILE_TAM.ANH_BIA);

      // Hạn mức 5GB: bài đã đăng + file tạm đang dùng trên trang + file mới; ảnh bìa không tính
      const daDung =
        (await baiHocRepo.dungLuongDaDung(idNguoiCungCap)) + cacFileTrang.reduce((tong, f) => tong + f.dung_luong, 0);
      if (daDung + file.size > HAN_MUC_NGUOI_CUNG_CAP_BYTE) throw loiFile('Bạn đã dùng hết 5GB dung lượng.');

      if (duLieu.so_bai_hien_co >= SO_BAI_TOI_DA) throw loiFile('Khóa học đã có đủ 50 bài.');

      maBam = await bamFile(file.path);
      if ((await baiHocRepo.coMaBamDangDung(maBam)) || cacFileTrang.some((f) => f.ma_bam === maBam)) {
        throw loi409(FILE_DA_CO, { ma: 'TRUNG_FILE', cacO: { file: FILE_DA_CO } });
      }
    }

    const ma = randomUUID();
    const thuMuc = path.dirname(file.path);
    const moTa = {
      ten_file: file.originalname,
      dung_luong: file.size,
      ma_bam: maBam,
      loai: duLieu.loai,
      thoi_luong: thoiLuong,
      duoi: kieu,
      thoi_diem_tai: new Date().toISOString(),
    };
    await fs.rename(file.path, path.join(thuMuc, `${ma}.${kieu}`));
    await fs.writeFile(path.join(thuMuc, `${ma}.json`), JSON.stringify(moTa));
    return { ma_file_tam: ma, ten_file: moTa.ten_file, dung_luong: moTa.dung_luong, thoi_luong: thoiLuong };
  } catch (loi) {
    await fs.rm(file.path, { force: true });
    throw loi;
  }
}

// Xóa một file tạm (cả file mô tả) của chính người này; mã của người khác nằm ở thư mục khác nên không bị đụng
export async function xoaFileTam(idNguoiCungCap, ma) {
  const thuMuc = thuMucTam(idNguoiCungCap);
  let cacTen;
  try {
    cacTen = await fs.readdir(thuMuc);
  } catch {
    return;
  }
  for (const ten of cacTen.filter((t) => t.startsWith(`${ma}.`))) {
    await fs.rm(path.join(thuMuc, ten), { force: true });
  }
}

// Xóa mọi file tạm của chính người này (khi mở trang tạo khóa hoặc trang quản lý khóa)
export async function xoaTatCaFileTam(idNguoiCungCap) {
  await fs.rm(thuMucTam(idNguoiCungCap), { recursive: true, force: true });
}

// Việc chạy mỗi giờ (Phần chung C13): xóa file tạm và file mô tả quá 24 giờ. So theo giờ ghi file trên
// máy chủ, vì file tạm không nằm trong MySQL (ngoại lệ thứ hai ở Phần chung C10). File tải dở không có
// file mô tả cũng bị dọn theo cách này.
export async function donFileTamQuaHan() {
  const thuMucGoc = path.join(config.thuMucLuuTru, 'tam');
  const hetHanTruoc = Date.now() - FILE_TAM_HET_HAN_GIO * 60 * 60 * 1000;
  let soFile = 0;
  for (const con of await fs.readdir(thuMucGoc, { withFileTypes: true })) {
    if (!con.isDirectory()) continue;
    const thuMuc = path.join(thuMucGoc, con.name);
    for (const ten of await fs.readdir(thuMuc)) {
      const duongDan = path.join(thuMuc, ten);
      const thongTin = await fs.stat(duongDan);
      if (thongTin.mtimeMs < hetHanTruoc) {
        await fs.rm(duongDan, { force: true });
        soFile += 1;
      }
    }
  }
  return soFile;
}
