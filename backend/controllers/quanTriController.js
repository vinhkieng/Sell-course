// Khu quản trị (Phần 1 mục 1.4)
import * as quanTriRepo from '../repositories/quanTriRepository.js';

export async function soChoXuLy(req, res) {
  res.json(await quanTriRepo.demChoXuLy());
}
