// Nghiệp vụ trang hồ sơ (Phần 5). Số CCCD chỉ trả cho chính admin đó và không bao giờ ghi vào nhật ký (C2).
import { randomUUID } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import bcrypt from 'bcrypt';
import config from '../config.js';
import { VAI_TRO } from '../constants/vaiTro.js';
import { withTransaction } from '../database/db.js';
import { loi400, loi409 } from '../lib/httpError.js';
import { loaiFile } from '../lib/loaiFile.js';
import { NGAY_SINH_SAI } from '../validators/hoSoValidator.js';
import * as nguoiDungRepo from '../repositories/nguoiDungRepository.js';
import * as quanTriVienRepo from '../repositories/quanTriVienRepository.js';
import * as donHangRepo from '../repositories/donHangRepository.js';
import * as khoaHocRepo from '../repositories/khoaHocRepository.js';
import * as heThongRepo from '../repositories/heThongRepository.js';

export const ANH_SAI = 'Ảnh phải là jpg hoặc png, tối đa 2MB';
const CO_DON_HANG = 'Bạn đã có đơn hàng nên cần giữ họ tên và số điện thoại.';
const DA_DANG_KHOA = 'Đã đăng khóa học nên không đổi được họ tên và số điện thoại.';
const GMAIL_DA_DUNG = 'Gmail này đã được sử dụng';

// Lỗi dưới đúng ô; câu chung là câu của ô đầu tiên
const loiCacO = (cacO, taoLoi = loi400) => taoLoi(Object.values(cacO)[0], { cacO });

// GET /api/ho-so: thông tin cá nhân theo vai trò (Phần 5 mục 5.5)
export async function xemHoSo(idNguoiDung) {
  const nd = await nguoiDungRepo.timTheoId(idNguoiDung);
  const hoSo = {
    ten_dang_nhap: nd.ten_dang_nhap,
    ho_ten: nd.ho_ten,
    gmail: nd.gmail,
    so_dien_thoai: nd.so_dien_thoai,
    vai_tro: nd.vai_tro,
    anh_dai_dien: nd.anh_dai_dien ? `/api/anh/${nd.anh_dai_dien}` : null,
  };
  if (nd.vai_tro === VAI_TRO.HOC_VIEN) {
    Object.assign(hoSo, await nguoiDungRepo.docHocVien(nd.id_hoc_vien));
  } else if (nd.vai_tro === VAI_TRO.NGUOI_CUNG_CAP) {
    hoSo.da_dang_khoa_hoc = await khoaHocRepo.nguoiCungCapDaDangKhoa(nd.id_nguoi_cung_cap);
  } else {
    Object.assign(hoSo, await quanTriVienRepo.docHopDong(nd.id_quan_tri_vien));
  }
  return hoSo;
}

// PUT /api/ho-so. nd: người đang đăng nhập (req.nguoiDung). duLieu đã qua schemaCapNhatHoSo.
export async function capNhatHoSo(nd, duLieu) {
  const hoTen = duLieu.ho_ten || null;
  const soDienThoai = duLieu.so_dien_thoai || null;
  const cacO = {};

  if (nd.vai_tro === VAI_TRO.HOC_VIEN) {
    // Đã có đơn (bất kỳ trạng thái) thì không được xóa trống họ tên, số điện thoại
    if ((!hoTen || !soDienThoai) && (await donHangRepo.hocVienCoDonHang(nd.id_hoc_vien))) {
      if (!hoTen) cacO.ho_ten = CO_DON_HANG;
      if (!soDienThoai) cacO.so_dien_thoai = CO_DON_HANG;
    }
    if (duLieu.ngay_sinh && !(await heThongRepo.truocHomNay(duLieu.ngay_sinh))) cacO.ngay_sinh = NGAY_SINH_SAI;
  } else if (nd.vai_tro === VAI_TRO.NGUOI_CUNG_CAP && (await khoaHocRepo.nguoiCungCapDaDangKhoa(nd.id_nguoi_cung_cap))) {
    // Đã đăng khóa thì họ tên, số điện thoại phải giữ đúng giá trị đang lưu (kể cả khi gọi thẳng API)
    if (hoTen !== nd.ho_ten) cacO.ho_ten = DA_DANG_KHOA;
    if (soDienThoai !== nd.so_dien_thoai) cacO.so_dien_thoai = DA_DANG_KHOA;
  }
  if (Object.keys(cacO).length > 0) throw loiCacO(cacO);

  const trung = await nguoiDungRepo.timTheoGmail(duLieu.gmail);
  if (trung && trung.id !== nd.id) throw loiCacO({ gmail: GMAIL_DA_DUNG }, loi409);

  try {
    await withTransaction(async (conn) => {
      await nguoiDungRepo.capNhatThongTin(nd.id, { hoTen, gmail: duLieu.gmail, soDienThoai }, conn);
      if (nd.vai_tro === VAI_TRO.HOC_VIEN) {
        await nguoiDungRepo.capNhatHocVien(
          nd.id_hoc_vien,
          { ngheNghiep: duLieu.nghe_nghiep || null, ngaySinh: duLieu.ngay_sinh || null },
          conn,
        );
      }
    });
  } catch (loi) {
    // Người khác vừa lấy Gmail này ngay trước đó
    if (loi.code === 'ER_DUP_ENTRY' && loi.message.includes('uq_nguoi_dung_gmail')) {
      throw loiCacO({ gmail: GMAIL_DA_DUNG }, loi409);
    }
    throw loi;
  }
  return xemHoSo(nd.id);
}

// POST /api/ho-so/anh-dai-dien. file: tệp multer đã giữ trong bộ nhớ (đã chặn quá 2MB ở route).
export async function doiAnhDaiDien(nd, file) {
  const loai = file ? loaiFile(file.buffer) : null;
  if (loai !== 'jpg' && loai !== 'png') throw loiCacO({ anh_dai_dien: ANH_SAI });

  const duongDanMoi = `anh_dai_dien/${randomUUID()}.${loai}`;
  const fileMoi = path.join(config.thuMucLuuTru, duongDanMoi);
  await fs.writeFile(fileMoi, file.buffer);
  try {
    await nguoiDungRepo.capNhatAnhDaiDien(nd.id, duongDanMoi);
  } catch (loi) {
    await fs.rm(fileMoi, { force: true });
    throw loi;
  }
  // Ảnh mới thay ảnh cũ; file cũ bị xóa khỏi máy chủ (mục 5.4). Chỉ xóa file nằm trong anh_dai_dien.
  if (nd.anh_dai_dien?.startsWith('anh_dai_dien/')) {
    await fs.rm(path.join(config.thuMucLuuTru, 'anh_dai_dien', path.basename(nd.anh_dai_dien)), { force: true });
  }
  return { anh_dai_dien: `/api/anh/${duongDanMoi}` };
}

// POST /api/ho-so/doi-mat-khau (ba ô đã qua schemaDoiMatKhau). Sai mật khẩu hiện tại không bị chặn.
export async function doiMatKhau(nd, { mat_khau_hien_tai: hienTai, mat_khau_moi: moi }) {
  if (!(await bcrypt.compare(hienTai, await nguoiDungRepo.layMatKhauDaBam(nd.id)))) {
    throw loiCacO({ mat_khau_hien_tai: 'Mật khẩu hiện tại không đúng' });
  }
  if (moi === hienTai) {
    throw loiCacO({ mat_khau_moi: 'Mật khẩu mới trùng với mật khẩu cũ, vui lòng nhập mật khẩu khác' });
  }
  await nguoiDungRepo.capNhatMatKhau(nd.id, await bcrypt.hash(moi, 10));
}
