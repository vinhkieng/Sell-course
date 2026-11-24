// Nhóm /api/danh-muc
import { Router } from 'express';
import { canDangNhap } from '../middleware/auth.js';
import * as danhMuc from '../controllers/danhMucController.js';

const router = Router();

router.get('/menu', danhMuc.menu);
// Mọi danh mục cho người đã đăng nhập, dùng khi tạo khóa (Phần 6 mục 6.6, Phần 7)
router.get('/', canDangNhap, danhMuc.tatCa);

export default router;
