// Nội dung trang Chính sách nằm trong file chinh_sach.json, không nằm trong database (Phần 1 mục 1.3).
import fs from 'node:fs/promises';
import config from '../config.js';

// Trả { cac_dieu: [{ so, ten, noi_dung }], cap_nhat_luc }. File không lưu số điều: số là thứ tự trong danh sách.
export async function docChinhSach() {
  const { cac_dieu: cacDieu, cap_nhat_luc: capNhatLuc } = JSON.parse(
    await fs.readFile(config.duongDanChinhSach, 'utf8'),
  );
  return {
    cac_dieu: cacDieu.map((dieu, i) => ({ so: i + 1, ten: dieu.ten, noi_dung: dieu.noi_dung })),
    cap_nhat_luc: capNhatLuc,
  };
}
