// Danh mục khóa học: menu công khai (Phần 1 mục 1.4), danh sách cho người đã đăng nhập và khu quản trị (Phần 6)
import * as danhMucRepo from '../repositories/danhMucRepository.js';
import * as danhMucService from '../services/danhMucService.js';

export async function menu(req, res) {
  res.json(await danhMucRepo.layMenu());
}

export async function tatCa(req, res) {
  res.json(await danhMucRepo.layTatCa());
}

export async function quanTriDanhSach(req, res) {
  res.json(await danhMucService.layTrang(req.validated.query.trang));
}

export async function quanTriThem(req, res) {
  res.status(201).json(await danhMucService.them(req.validated.body.ten));
}

export async function quanTriDoiTen(req, res) {
  res.json(await danhMucService.doiTen(req.validated.params.id, req.validated.body.ten));
}

export async function quanTriXoa(req, res) {
  await danhMucService.xoa(req.validated.params.id);
  res.status(200).end();
}

export async function quanTriGop(req, res) {
  const { ids, ten_moi: tenMoi } = req.validated.body;
  res.json(await danhMucService.gop(ids, tenMoi, req.nguoiDung.id));
}
