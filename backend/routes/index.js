// Gom mọi nhóm route. Khi làm chức năng mới thì tạo file route riêng (ví dụ taiKhoanRoutes.js)
// rồi gắn vào đây, ví dụ: router.use('/tai-khoan', taiKhoanRoutes);
import { Router } from 'express';
import { kiemTraKetNoiCsdl } from '../repositories/heThongRepository.js';
import taiKhoanRoutes from './taiKhoanRoutes.js';
import danhMucRoutes from './danhMucRoutes.js';
import congThanhToanRoutes from './congThanhToanRoutes.js';
import quanTriRoutes from './quanTriRoutes.js';
import chinhSachRoutes from './chinhSachRoutes.js';
import hoSoRoutes from './hoSoRoutes.js';
import anhRoutes from './anhRoutes.js';
import nguoiCungCapRoutes from './nguoiCungCapRoutes.js';

const router = Router();

router.use('/tai-khoan', taiKhoanRoutes);
router.use('/danh-muc', danhMucRoutes);
router.use('/cong-thanh-toan', congThanhToanRoutes);
router.use('/quan-tri', quanTriRoutes);
router.use('/chinh-sach', chinhSachRoutes);
router.use('/ho-so', hoSoRoutes);
router.use('/anh', anhRoutes);
router.use('/nguoi-cung-cap', nguoiCungCapRoutes);

// Kiểm tra máy chủ chạy và kết nối được MySQL (Phần chung C6). Trả thẳng dữ liệu, không bọc { data }.
router.get('/kiem-tra-ket-noi', async (req, res) => {
  await kiemTraKetNoiCsdl();
  res.json({ server: 'ok', database: 'ok' });
});

export default router;
