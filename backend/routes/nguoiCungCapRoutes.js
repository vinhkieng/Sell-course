// Nhóm /api/nguoi-cung-cap: mọi đường chỉ người cung cấp dùng được (Phần chung C5).
// Phần 7: file tạm và đăng khóa. Phần 8 trở đi thêm đường vào đây.
import { randomUUID } from 'node:crypto';
import fs from 'node:fs/promises';
import { Router } from 'express';
import multer from 'multer';
import { canVaiTro } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { VAI_TRO } from '../constants/vaiTro.js';
import { VIDEO_TOI_DA_BYTE } from '../constants/nghiepVu.js';
import { loi400, loi413 } from '../lib/httpError.js';
import { schemaFileTam, schemaMaFileTam, schemaDangKhoaHoc, LOAI_FILE_TAM } from '../validators/khoaHocValidator.js';
import { thuMucTam, LUAT_LOAI_FILE } from '../services/fileTamService.js';
import * as fileTam from '../controllers/fileTamController.js';
import * as khoaHoc from '../controllers/khoaHocController.js';

// File ghi thẳng xuống luu_tru/tam/<id người cung cấp>/ (không giữ cả file trong bộ nhớ, video tới 300MB).
// Tên tạm "tai-<uuid>" chưa có đuôi; kiểm xong mới đổi thành <uuid>.<đuôi> (fileTamService).
const nhanMotFile = multer({
  storage: multer.diskStorage({
    destination: (req, file, xong) => {
      const thuMuc = thuMucTam(req.nguoiDung.id_nguoi_cung_cap);
      fs.mkdir(thuMuc, { recursive: true }).then(() => xong(null, thuMuc), xong);
    },
    filename: (req, file, xong) => xong(null, `tai-${randomUUID()}`),
  }),
  limits: { fileSize: VIDEO_TOI_DA_BYTE, files: 1 },
  defParamCharset: 'utf8', // tên file gốc có dấu tiếng Việt
}).single('file');

// Đổi lỗi của multer sang câu của đúng loại file (trang gửi ô "loai" trước ô "file")
function nhanFileTam(req, res, next) {
  nhanMotFile(req, res, (loi) => {
    if (!loi) return next();
    const luat = LUAT_LOAI_FILE[req.body?.loai] ?? LUAT_LOAI_FILE[LOAI_FILE_TAM.VIDEO];
    const taoLoi = loi.code === 'LIMIT_FILE_SIZE' ? loi413 : loi400;
    next(taoLoi(luat.cauSai, { cacO: { file: luat.cauSai } }));
  });
}

// Dữ liệu kèm file sai thì xóa file vừa nhận rồi mới báo lỗi
async function xoaFileKhiLoi(loi, req, res, next) {
  if (req.file) await fs.rm(req.file.path, { force: true });
  next(loi);
}

const router = Router();

router.use(canVaiTro(VAI_TRO.NGUOI_CUNG_CAP));

router.post('/file-tam', nhanFileTam, validate({ body: schemaFileTam }), fileTam.nhan, xoaFileKhiLoi);
router.delete('/file-tam', fileTam.xoaTatCa);
router.delete('/file-tam/:ma_file_tam', validate({ params: schemaMaFileTam }), fileTam.xoaMot);

router.post('/khoa-hoc', validate({ body: schemaDangKhoaHoc }), khoaHoc.dang);

export default router;
