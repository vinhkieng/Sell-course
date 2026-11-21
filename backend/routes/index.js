// Gom mọi nhóm route. Khi làm chức năng mới thì tạo file route riêng (ví dụ taiKhoanRoutes.js)
// rồi gắn vào đây, ví dụ: router.use('/tai-khoan', taiKhoanRoutes);
import { Router } from 'express';
import { kiemTraKetNoiCsdl } from '../repositories/heThongRepository.js';

const router = Router();

// Kiểm tra máy chủ chạy và kết nối được MySQL (Phần chung C6). Trả thẳng dữ liệu, không bọc { data }.
router.get('/kiem-tra-ket-noi', async (req, res) => {
  await kiemTraKetNoiCsdl();
  res.json({ server: 'ok', database: 'ok' });
});

export default router;
