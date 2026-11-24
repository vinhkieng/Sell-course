// Trang hồ sơ (Phần 5 mục 5.5)
import * as hoSoService from '../services/hoSoService.js';

export async function xem(req, res) {
  res.json(await hoSoService.xemHoSo(req.nguoiDung.id));
}

export async function capNhat(req, res) {
  res.json(await hoSoService.capNhatHoSo(req.nguoiDung, req.validated.body));
}

export async function doiAnhDaiDien(req, res) {
  res.json(await hoSoService.doiAnhDaiDien(req.nguoiDung, req.file));
}

export async function doiMatKhau(req, res) {
  await hoSoService.doiMatKhau(req.nguoiDung, req.validated.body);
  res.status(200).end();
}
