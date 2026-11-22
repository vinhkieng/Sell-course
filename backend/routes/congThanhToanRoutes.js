// Nhóm /api/cong-thanh-toan
import { Router } from 'express';
import * as congThanhToan from '../controllers/congThanhToanController.js';

const router = Router();

router.get('/mac-dinh', congThanhToan.macDinh);

export default router;
