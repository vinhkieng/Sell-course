// Nhóm /api/tai-khoan
import { Router } from 'express';
import { canChuaDangNhap } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { schemaDangKy } from '../validators/taiKhoanValidator.js';
import * as taiKhoan from '../controllers/taiKhoanController.js';

const router = Router();

router.get('/toi', taiKhoan.toi);
router.post('/dang-ky', canChuaDangNhap, validate({ body: schemaDangKy }), taiKhoan.dangKy);

export default router;
