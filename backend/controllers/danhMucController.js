// Danh mục khóa học (Phần 1 mục 1.4)
import * as danhMucRepo from '../repositories/danhMucRepository.js';

export async function menu(req, res) {
  res.json(await danhMucRepo.layMenu());
}
