// Cổng thanh toán (Phần 1 mục 1.4)
import * as congThanhToanRepo from '../repositories/congThanhToanRepository.js';

export async function macDinh(req, res) {
  res.json(await congThanhToanRepo.layMacDinh());
}
