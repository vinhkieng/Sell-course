// Nhóm /api/quan-tri: mọi đường chỉ admin dùng được (Phần chung C5)
import { Router } from 'express';
import { canVaiTro } from '../middleware/auth.js';
import { VAI_TRO } from '../constants/vaiTro.js';
import * as quanTri from '../controllers/quanTriController.js';
import quanTriDanhMucRoutes from './quanTriDanhMucRoutes.js';

const router = Router();

router.use(canVaiTro(VAI_TRO.ADMIN));
router.get('/so-cho-xu-ly', quanTri.soChoXuLy);
router.use('/danh-muc', quanTriDanhMucRoutes);

export default router;
