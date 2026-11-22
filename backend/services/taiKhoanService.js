// Nghiệp vụ tài khoản: thông tin người xem (Phần 1), đăng ký (Phần 2).
import bcrypt from 'bcrypt';
import { VAI_TRO } from '../constants/vaiTro.js';
import { withTransaction } from '../database/db.js';
import { loi409 } from '../lib/httpError.js';
import { sinhMaGioiThieu } from '../lib/maGioiThieu.js';
import * as gioHangRepo from '../repositories/gioHangRepository.js';
import * as thongBaoRepo from '../repositories/thongBaoRepository.js';
import * as nguoiDungRepo from '../repositories/nguoiDungRepository.js';

const TEN_DA_DUNG = 'Tên đăng nhập đã được sử dụng';
const GMAIL_DA_DUNG = 'Gmail này đã được sử dụng';

// 409 kèm lỗi dưới đúng ô; câu chung là câu của ô đầu tiên bị trùng
function loiTrung(trungTen, trungGmail) {
  const cacO = {};
  if (trungTen) cacO.ten_dang_nhap = TEN_DA_DUNG;
  if (trungGmail) cacO.gmail = GMAIL_DA_DUNG;
  return loi409(Object.values(cacO)[0], { cacO });
}

// duLieu đã qua schemaDangKy: tên đã trim, Gmail đã trim và viết thường (Phần 2 mục 2.4, 2.5)
export async function dangKy({ ten_dang_nhap: tenDangNhap, gmail, mat_khau: matKhau, vai_tro: vaiTro }) {
  // So trùng không phân biệt hoa thường nhờ collation của bảng
  const daCo = await nguoiDungRepo.timTheoTenDangNhapHoacGmail(tenDangNhap, gmail);
  if (daCo.length > 0) {
    throw loiTrung(
      daCo.some((nd) => nd.ten_dang_nhap.toLowerCase() === tenDangNhap.toLowerCase()),
      daCo.some((nd) => nd.gmail === gmail),
    );
  }

  const matKhauDaBam = await bcrypt.hash(matKhau, 10);
  try {
    await withTransaction(async (conn) => {
      let maGioiThieu = sinhMaGioiThieu();
      while (await nguoiDungRepo.maGioiThieuDaCo(maGioiThieu, conn)) maGioiThieu = sinhMaGioiThieu();
      const id = await nguoiDungRepo.themNguoiDung(
        { tenDangNhap, gmail, matKhauDaBam, vaiTro, maGioiThieu },
        conn,
      );
      if (vaiTro === VAI_TRO.HOC_VIEN) await nguoiDungRepo.themHocVien(id, conn);
      else await nguoiDungRepo.themNguoiCungCap(id, conn);
    });
  } catch (loi) {
    // Hai người cùng đăng ký một tên hoặc Gmail gần như cùng lúc: ràng buộc không trùng của MySQL chặn người sau
    if (loi.code !== 'ER_DUP_ENTRY') throw loi;
    const trungTen = loi.message.includes('uq_nguoi_dung_ten_dang_nhap');
    const trungGmail = loi.message.includes('uq_nguoi_dung_gmail');
    if (!trungTen && !trungGmail) throw loi;
    throw loiTrung(trungTen, trungGmail);
  }
}

// nguoiDung: dòng đã đọc ở docPhien (req.nguoiDung), null là khách
export async function thongTinNguoiXem(nguoiDung) {
  if (!nguoiDung) return { dang_nhap: false };
  const thongTin = {
    dang_nhap: true,
    id: nguoiDung.id,
    ten_dang_nhap: nguoiDung.ten_dang_nhap,
    ho_ten: nguoiDung.ho_ten,
    vai_tro: nguoiDung.vai_tro,
    // Cột lưu đường dẫn tương đối, ví dụ anh_dai_dien/<uuid>.jpg; ảnh lấy qua GET /api/anh (Phần chung C12)
    anh_dai_dien: nguoiDung.anh_dai_dien ? `/api/anh/${nguoiDung.anh_dai_dien}` : null,
  };
  if (nguoiDung.vai_tro === VAI_TRO.HOC_VIEN) {
    thongTin.so_khoa_trong_gio = await gioHangRepo.demTheoHocVien(nguoiDung.id_hoc_vien);
  } else if (nguoiDung.vai_tro === VAI_TRO.NGUOI_CUNG_CAP) {
    thongTin.so_thong_bao_chua_doc = await thongBaoRepo.demChuaDoc(nguoiDung.id_nguoi_cung_cap);
  }
  return thongTin;
}
