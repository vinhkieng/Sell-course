// Nhóm /api/quan-tri/danh-muc (Phần 6 mục 6.6). Gắn trong quanTriRoutes.js nên chỉ admin dùng được.
import { Router } from 'express';
import { validate } from '../middleware/validate.js';
import {
  schemaTenDanhMuc,
  schemaGopDanhMuc,
  schemaIdDanhMuc,
  schemaTrang,
} from '../validators/danhMucValidator.js';
import * as danhMuc from '../controllers/danhMucController.js';

const router = Router();

router.get('/', validate({ query: schemaTrang }), danhMuc.quanTriDanhSach);
router.post('/', validate({ body: schemaTenDanhMuc }), danhMuc.quanTriThem);
router.post('/gop', validate({ body: schemaGopDanhMuc }), danhMuc.quanTriGop);
router.put('/:id', validate({ params: schemaIdDanhMuc, body: schemaTenDanhMuc }), danhMuc.quanTriDoiTen);
router.delete('/:id', validate({ params: schemaIdDanhMuc }), danhMuc.quanTriXoa);

export default router;
