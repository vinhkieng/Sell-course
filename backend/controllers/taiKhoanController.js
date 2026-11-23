// Tài khoản: người đang xem trang (Phần 1 mục 1.4), đăng ký (Phần 2 mục 2.5), đăng nhập, đăng xuất (Phần 3 mục 3.5)
import * as taiKhoanService from '../services/taiKhoanService.js';
import { layIp } from '../lib/diaChiIp.js';
import {
  datPhien,
  xoaPhien,
  datCookieChoXacNhan,
  docCookieChoXacNhan,
  xoaCookieChoXacNhan,
} from '../lib/token.js';

export async function toi(req, res) {
  res.json(await taiKhoanService.thongTinNguoiXem(req.nguoiDung));
}

export async function dangKy(req, res) {
  await taiKhoanService.dangKy(req.validated.body);
  res.status(201).end();
}

export async function dangNhap(req, res) {
  const kq = await taiKhoanService.dangNhap(req.validated.body, layIp(req));
  if (kq.canXacNhan) {
    datCookieChoXacNhan(res, kq.choXacNhan.id_hoc_vien, kq.choXacNhan.ip);
    return res.json({ can_xac_nhan: true, ...kq.canXacNhan });
  }
  datPhien(res, kq.phien.nguoiDung, kq.phien.ip);
  res.json(kq.thongTin);
}

export async function xacNhanDangNhap(req, res) {
  const kq = await taiKhoanService.xacNhanDangNhap(docCookieChoXacNhan(req), req.validated.body.ma);
  xoaCookieChoXacNhan(res);
  datPhien(res, kq.phien.nguoiDung, kq.phien.ip);
  res.json(kq.thongTin);
}

export async function guiLaiMaDangNhap(req, res) {
  const cho = docCookieChoXacNhan(req);
  const kq = await taiKhoanService.guiLaiMaDangNhap(cho);
  // Mã mới có hiệu lực 10 phút nên đặt lại hạn của cookie tạm
  datCookieChoXacNhan(res, cho.id_hoc_vien, cho.ip);
  res.json(kq);
}

// Luôn xóa cookie phiên và trả 200, kể cả khi chưa đăng nhập hoặc phiên đã hết hạn (Phần 3 mục 3.5)
export async function dangXuat(req, res) {
  xoaPhien(res);
  res.status(200).end();
}
