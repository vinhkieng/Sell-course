// Ảnh bìa và ảnh đại diện lấy qua đường công khai (Phần chung C12)
import path from 'node:path';
import config from '../config.js';
import { loi404 } from '../lib/httpError.js';

const THU_MUC_ANH = new Set(['anh_bia', 'anh_dai_dien']);
// Tên file máy chủ tự đặt: uuid kèm đuôi. Chặn luôn "../" vì không khớp mẫu.
const MAU_TEN_ANH = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpg|png)$/;

// GET /api/anh/:thuMuc/:tenFile
export function layAnh(req, res, next) {
  const { thuMuc, tenFile } = req.params;
  if (!THU_MUC_ANH.has(thuMuc) || !MAU_TEN_ANH.test(tenFile)) throw loi404();
  res.sendFile(path.join(config.thuMucLuuTru, thuMuc, tenFile), (loi) => {
    if (loi && !res.headersSent) next(loi404());
  });
}
