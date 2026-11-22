// Nhóm /api/tai-khoan
import { Router } from 'express';
import * as taiKhoan from '../controllers/taiKhoanController.js';

const router = Router();

router.get('/toi', taiKhoan.toi);

export default router;
