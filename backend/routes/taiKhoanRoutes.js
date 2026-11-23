// Nhóm /api/tai-khoan
import { Router } from 'express';
import { canChuaDangNhap } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  schemaDangKy,
  schemaDangNhap,
  schemaXacNhanDangNhap,
} from '../validators/taiKhoanValidator.js';
import * as taiKhoan from '../controllers/taiKhoanController.js';

const router = Router();

router.get('/toi', taiKhoan.toi);
router.post('/dang-ky', canChuaDangNhap, validate({ body: schemaDangKy }), taiKhoan.dangKy);
router.post('/dang-nhap', canChuaDangNhap, validate({ body: schemaDangNhap }), taiKhoan.dangNhap);
router.post(
  '/xac-nhan-dang-nhap',
  canChuaDangNhap,
  validate({ body: schemaXacNhanDangNhap }),
  taiKhoan.xacNhanDangNhap,
);
router.post('/gui-lai-ma-dang-nhap', canChuaDangNhap, taiKhoan.guiLaiMaDangNhap);
router.post('/dang-xuat', taiKhoan.dangXuat);

export default router;
