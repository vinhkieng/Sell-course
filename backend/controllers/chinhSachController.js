// Trang Chính sách (Phần 1 mục 1.4)
import { docChinhSach } from '../services/chinhSachService.js';

export async function xem(req, res) {
  res.json(await docChinhSach());
}
