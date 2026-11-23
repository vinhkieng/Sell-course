// Ba bộ đếm trong bộ nhớ máy chủ (Phần chung C13). Khởi động lại máy chủ thì về 0 (hạn chế đã biết, C17).
// Tính giờ bằng đồng hồ của Node vì bộ đếm không nằm trong MySQL.
// tạm: các Map không tự dọn tên và địa chỉ cũ; đủ cho đồ án, đưa lên máy chủ thật đông người thì cần dọn định kỳ.
import {
  SAI_THEO_TEN_TOI_DA,
  CHAN_THEO_TEN_PHUT,
  SAI_THEO_IP_TOI_DA,
  KHUNG_DEM_SAI_THEO_IP_PHUT,
  CHAN_THEO_IP_PHUT,
  GUI_MA_XAC_NHAN_TOI_DA,
  KHUNG_GUI_MA_XAC_NHAN_GIO,
} from '../constants/nghiepVu.js';

const PHUT = 60 * 1000;
const saiTheoTen = new Map(); // tên viết thường -> { so: số lần sai liên tiếp, chanDen }
const saiTheoIp = new Map(); // địa chỉ IP -> { lan: [thời điểm sai], chanDen }
const guiMa = new Map(); // id học viên -> [thời điểm gửi mã]

// 'ten' hoặc 'ip' nếu đang bị tạm chặn, null nếu không (Phần 3 mục 3.4 bước 2)
export function dangBiChan(tenThuong, ip) {
  const bayGio = Date.now();
  if ((saiTheoTen.get(tenThuong)?.chanDen ?? 0) > bayGio) return 'ten';
  if ((saiTheoIp.get(ip)?.chanDen ?? 0) > bayGio) return 'ip';
  return null;
}

// Một lần sai tên hoặc mật khẩu: tính cho cả tên đăng nhập và địa chỉ IP
export function ghiSaiDangNhap(tenThuong, ip) {
  const bayGio = Date.now();

  const ten = saiTheoTen.get(tenThuong) ?? { so: 0, chanDen: 0 };
  ten.so += 1;
  if (ten.so >= SAI_THEO_TEN_TOI_DA) {
    ten.chanDen = bayGio + CHAN_THEO_TEN_PHUT * PHUT;
    ten.so = 0; // hết thời gian chặn thì đếm lại từ đầu
  }
  saiTheoTen.set(tenThuong, ten);

  const theoIp = saiTheoIp.get(ip) ?? { lan: [], chanDen: 0 };
  theoIp.lan = theoIp.lan.filter((t) => t > bayGio - KHUNG_DEM_SAI_THEO_IP_PHUT * PHUT);
  theoIp.lan.push(bayGio);
  if (theoIp.lan.length >= SAI_THEO_IP_TOI_DA) {
    theoIp.chanDen = bayGio + CHAN_THEO_IP_PHUT * PHUT;
    theoIp.lan = [];
  }
  saiTheoIp.set(ip, theoIp);
}

// Đăng nhập thành công (Phần 3) hoặc đặt lại mật khẩu xong (Phần 4): xóa số lần sai và gỡ chặn của tên
export function xoaSaiTheoTen(tenThuong) {
  saiTheoTen.delete(tenThuong);
}

// Còn được gửi mã xác nhận đăng nhập không: tối đa 5 lần trong 1 giờ, tính cả lần gửi đầu
export function conGuiDuocMa(idHocVien) {
  const tu = Date.now() - KHUNG_GUI_MA_XAC_NHAN_GIO * 60 * PHUT;
  const lan = (guiMa.get(idHocVien) ?? []).filter((t) => t > tu);
  guiMa.set(idHocVien, lan);
  return lan.length < GUI_MA_XAC_NHAN_TOI_DA;
}

export function ghiDaGuiMa(idHocVien) {
  guiMa.set(idHocVien, [...(guiMa.get(idHocVien) ?? []), Date.now()]);
}
