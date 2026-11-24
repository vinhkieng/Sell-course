// Nhóm /api/ho-so: mọi đường cần đăng nhập, cả ba vai trò (Phần 5)
import { Router } from 'express';
import multer from 'multer';
import { canDangNhap } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { loi400, loi413 } from '../lib/httpError.js';
import { ANH_DAI_DIEN_TOI_DA_MB } from '../constants/nghiepVu.js';
import { schemaCapNhatHoSo, schemaDoiMatKhau } from '../validators/hoSoValidator.js';
import { ANH_SAI } from '../services/hoSoService.js';
import * as hoSo from '../controllers/hoSoController.js';

// Ảnh đại diện nhỏ nên giữ trong bộ nhớ, ô gửi file tên "anh"
const nhanMotAnh = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: ANH_DAI_DIEN_TOI_DA_MB * 1024 * 1024, files: 1 },
}).single('anh');

// Đổi lỗi của multer sang câu của Phần 5 (bộ xử lý lỗi chung chỉ có câu "File tải lên quá lớn.")
function nhanAnhDaiDien(req, res, next) {
  nhanMotAnh(req, res, (loi) => {
    if (!loi) return next();
    const taoLoi = loi.code === 'LIMIT_FILE_SIZE' ? loi413 : loi400;
    next(taoLoi(ANH_SAI, { cacO: { anh_dai_dien: ANH_SAI } }));
  });
}

const router = Router();

router.use(canDangNhap);
router.get('/', hoSo.xem);
router.put('/', validate({ body: schemaCapNhatHoSo }), hoSo.capNhat);
router.post('/anh-dai-dien', nhanAnhDaiDien, hoSo.doiAnhDaiDien);
router.post('/doi-mat-khau', validate({ body: schemaDoiMatKhau }), hoSo.doiMatKhau);

export default router;
