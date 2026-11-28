// File tạm lúc tạo hoặc sửa khóa (Phần 7 mục 7.5)
import * as fileTamService from '../services/fileTamService.js';

export async function nhan(req, res) {
  const idNguoiCungCap = req.nguoiDung.id_nguoi_cung_cap;
  res.status(201).json(await fileTamService.nhanFileTam(idNguoiCungCap, req.file, req.validated.body));
}

export async function xoaMot(req, res) {
  await fileTamService.xoaFileTam(req.nguoiDung.id_nguoi_cung_cap, req.validated.params.ma_file_tam);
  res.status(200).end();
}

export async function xoaTatCa(req, res) {
  await fileTamService.xoaTatCaFileTam(req.nguoiDung.id_nguoi_cung_cap);
  res.status(200).end();
}
