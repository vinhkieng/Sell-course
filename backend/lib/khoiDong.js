// Việc làm một lần khi máy chủ khởi động (gọi từ server.js).
import fs from 'node:fs/promises';
import path from 'node:path';
import config from '../config.js';
import logger from './logger.js';

// Các thư mục con trong backend/luu_tru (Phần chung C12). Thư mục luu_tru/tam/<id_nguoi_cung_cap>
// do Phần 7 tạo khi cần.
export const THU_MUC_CON = [
  'video',
  'tai_lieu',
  'anh_bia',
  'anh_dai_dien',
  'tam',
  'kho_luu_tru',
  'noi_dung',
];

export async function taoThuMucLuuTru() {
  for (const ten of THU_MUC_CON) {
    await fs.mkdir(path.join(config.thuMucLuuTru, ten), { recursive: true });
  }
}

// Chưa có file chinh_sach.json thì chép file mặc định sang (Phần 1 mục 1.3).
// Đã có thì giữ nguyên, không ghi đè nội dung admin đã sửa.
export async function chepChinhSachMacDinh() {
  try {
    await fs.access(config.duongDanChinhSach);
    return false;
  } catch {
    await fs.mkdir(path.dirname(config.duongDanChinhSach), { recursive: true });
    await fs.copyFile(config.duongDanChinhSachMacDinh, config.duongDanChinhSach);
    logger.info('Đã chép nội dung Chính sách mặc định vào luu_tru/noi_dung/chinh_sach.json');
    return true;
  }
}
