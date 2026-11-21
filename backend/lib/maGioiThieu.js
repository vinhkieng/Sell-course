// Sinh mã giới thiệu 8 ký tự gồm chữ in hoa và chữ số (Phần 2; ràng buộc ck_nguoi_dung_ma_gioi_thieu
// trong file SQL), ví dụ K7P2QX9M. Nơi gọi tự kiểm tra trùng, trùng thì sinh lại.
import { randomInt } from 'node:crypto';

const KY_TU = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

export function sinhMaGioiThieu() {
  let ma = '';
  for (let i = 0; i < 8; i += 1) ma += KY_TU[randomInt(KY_TU.length)];
  return ma;
}
