// Nhóm /api/anh: công khai, không cần đăng nhập (Phần chung C12)
import { Router } from 'express';
import * as anh from '../controllers/anhController.js';

const router = Router();

router.get('/:thuMuc/:tenFile', anh.layAnh);

export default router;
