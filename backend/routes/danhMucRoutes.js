// Nhóm /api/danh-muc
import { Router } from 'express';
import * as danhMuc from '../controllers/danhMucController.js';

const router = Router();

router.get('/menu', danhMuc.menu);

export default router;
