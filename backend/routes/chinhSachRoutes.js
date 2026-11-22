// Nhóm /api/chinh-sach
import { Router } from 'express';
import * as chinhSach from '../controllers/chinhSachController.js';

const router = Router();

router.get('/', chinhSach.xem);

export default router;
