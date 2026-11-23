// Nghiệp vụ tài khoản: thông tin người xem (Phần 1), đăng ký (Phần 2), đăng nhập và xác nhận địa chỉ mạng (Phần 3),
// quên mật khẩu (Phần 4).
import { randomInt } from 'node:crypto';
import bcrypt from 'bcrypt';
import { VAI_TRO } from '../constants/vaiTro.js';
import {
  CHAN_THEO_TEN_PHUT,
  CHAN_THEO_IP_PHUT,
  HIEU_LUC_MA_XAC_NHAN_PHUT,
  NHAP_MA_SAI_TOI_DA,
  GIAY_CHO_GUI_LAI_MA,
} from '../constants/nghiepVu.js';
import { withTransaction } from '../database/db.js';
import { loi400, loi401, loi409, loi429 } from '../lib/httpError.js';
import { sinhMaGioiThieu } from '../lib/maGioiThieu.js';
import { chuanHoaIp } from '../lib/diaChiIp.js';
import { guiEmail } from '../lib/email.js';
import * as boDem from '../lib/boDem.js';
import * as gioHangRepo from '../repositories/gioHangRepository.js';
import * as thongBaoRepo from '../repositories/thongBaoRepository.js';
import * as nguoiDungRepo from '../repositories/nguoiDungRepository.js';
import * as xacMinhIpRepo from '../repositories/xacMinhIpRepository.js';
import * as maDatLaiRepo from '../repositories/maDatLaiMatKhauRepository.js';

// Mã 6 chữ số ngẫu nhiên gửi qua Gmail (Phần 3, 4)
const taoMa6So = () => String(randomInt(0, 1000000)).padStart(6, '0');

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

// ===== Đăng nhập và xác nhận địa chỉ mạng (Phần 3) =====

const SAI_TEN_MAT_KHAU = 'Tên đăng nhập hoặc mật khẩu không đúng';
const GUI_MA_QUA_NHIEU = 'Bạn đã yêu cầu gửi mã quá nhiều lần. Vui lòng thử lại sau.';
const MA_KHONG_DUNG = 'Mã xác nhận không đúng.';
const MA_HET_HAN = 'Mã đã hết hạn, vui lòng bấm Gửi lại mã.';
const MA_SAI_QUA_NHIEU = 'Bạn đã nhập sai quá nhiều lần, vui lòng bấm Gửi lại mã.';

// Tên không tồn tại vẫn so với một bản băm giả, để thời gian trả lời như khi sai mật khẩu
const BAM_GIA = bcrypt.hashSync('000000', 10);

// Lỗi của trang xác nhận hiện chữ đỏ dưới ô mã
const loiMa = (cau) => loi400(cau, { cacO: { ma: cau } });
const khongCoLuotCho = () =>
  loi400('Không có lượt đăng nhập đang chờ xác nhận.', { ma: 'KHONG_CO_LUOT_CHO_XAC_NHAN' });

// "an01@gmail.com" -> "a***@gmail.com"
function cheGmail(gmail) {
  const [ten, mien] = gmail.split('@');
  return `${ten[0]}***@${mien}`;
}

// Tạo mã, ghi vào xac_minh_ip và gửi email. Ghi và gửi trong một giao dịch: gửi thư lỗi thì không để lại mã.
async function guiMaXacNhan(idHocVien, gmail, diaChiIpMoi) {
  if (!boDem.conGuiDuocMa(idHocVien)) throw loi429(GUI_MA_QUA_NHIEU);
  const ma = taoMa6So();
  const maDaBam = await bcrypt.hash(ma, 10);
  await withTransaction(async (conn) => {
    await xacMinhIpRepo.ghiMa(idHocVien, maDaBam, diaChiIpMoi, conn);
    await guiEmail({
      den: gmail,
      tieuDe: 'Mã xác nhận đăng nhập AVA',
      noiDung: `Có người vừa đăng nhập tài khoản AVA của bạn từ một địa chỉ mạng mới. Mã xác nhận của bạn là: ${ma}. Mã có hiệu lực trong ${HIEU_LUC_MA_XAC_NHAN_PHUT} phút. Nếu không phải bạn, hãy đổi mật khẩu ngay.`,
    });
  });
  boDem.ghiDaGuiMa(idHocVien);
  return { gmail_che: cheGmail(gmail), giay_cho_gui_lai: GIAY_CHO_GUI_LAI_MA };
}

// Làm đúng thứ tự Phần 3 mục 3.4 (bước 1 đã qua schemaDangNhap). ip: địa chỉ đang dùng, đã chuẩn hóa.
// Trả { phien: { nguoiDung, ip }, thongTin } khi đăng nhập xong,
// hoặc { canXacNhan: { gmail_che, giay_cho_gui_lai }, choXacNhan: { id_hoc_vien, ip } } khi phải nhập mã.
export async function dangNhap({ ten_dang_nhap: tenDangNhap, mat_khau: matKhau }, ip) {
  const tenThuong = tenDangNhap.toLowerCase();

  // Bước 2
  const biChan = boDem.dangBiChan(tenThuong, ip);
  if (biChan === 'ten') throw loi429(`Bạn đã nhập sai nhiều lần, vui lòng thử lại sau ${CHAN_THEO_TEN_PHUT} phút`);
  if (biChan === 'ip') throw loi429(`Bạn đã nhập sai nhiều lần, vui lòng thử lại sau ${CHAN_THEO_IP_PHUT} phút`);

  // Bước 3
  const taiKhoan = await nguoiDungRepo.timDeDangNhap(tenDangNhap);
  const dungMatKhau = await bcrypt.compare(matKhau, taiKhoan?.mat_khau_da_bam ?? BAM_GIA);
  if (!taiKhoan || !dungMatKhau) {
    boDem.ghiSaiDangNhap(tenThuong, ip);
    throw loi400(SAI_TEN_MAT_KHAU);
  }

  // Bước 4
  if (taiKhoan.khoa === 1) {
    throw loi401(
      `Tài khoản đã bị khóa. Lý do: ${taiKhoan.ly_do_khoa}. Liên hệ hỗ trợ nếu bạn cho rằng có nhầm lẫn.`,
      { ma: 'TAI_KHOAN_BI_KHOA', them: { ly_do_khoa: taiKhoan.ly_do_khoa } },
    );
  }

  // Bước 5: chỉ học viên
  if (taiKhoan.vai_tro === VAI_TRO.HOC_VIEN) {
    if (!taiKhoan.dia_chi_ip) {
      await nguoiDungRepo.capNhatDiaChiIp(taiKhoan.id_hoc_vien, ip);
    } else if (chuanHoaIp(taiKhoan.dia_chi_ip) !== ip) {
      return {
        canXacNhan: await guiMaXacNhan(taiKhoan.id_hoc_vien, taiKhoan.gmail, ip),
        choXacNhan: { id_hoc_vien: taiKhoan.id_hoc_vien, ip },
      };
    }
  }

  // Bước 6
  boDem.xoaSaiTheoTen(tenThuong);
  return {
    phien: { nguoiDung: taiKhoan, ip },
    thongTin: await thongTinNguoiXem(await nguoiDungRepo.timTheoId(taiKhoan.id)),
  };
}

// cho: nội dung cookie tạm (null nếu không có). Trả như dangNhap khi xong (Phần 3 mục 3.5).
export async function xacNhanDangNhap(cho, ma) {
  if (!cho) throw khongCoLuotCho();
  const dong = await xacMinhIpRepo.timTheoHocVien(cho.id_hoc_vien);
  if (!dong || dong.da_het_han) throw loiMa(MA_HET_HAN);
  if (dong.so_lan_nhap_ma_sai >= NHAP_MA_SAI_TOI_DA) throw loiMa(MA_SAI_QUA_NHIEU);
  if (!(await bcrypt.compare(ma, dong.ma_xac_minh_da_bam))) {
    await xacMinhIpRepo.tangLanSai(cho.id_hoc_vien);
    throw loiMa(dong.so_lan_nhap_ma_sai + 1 >= NHAP_MA_SAI_TOI_DA ? MA_SAI_QUA_NHIEU : MA_KHONG_DUNG);
  }

  await withTransaction(async (conn) => {
    await nguoiDungRepo.capNhatDiaChiIp(cho.id_hoc_vien, dong.dia_chi_ip_moi, conn);
    await xacMinhIpRepo.xoaTheoHocVien(cho.id_hoc_vien, conn);
  });
  const nguoiDung = await nguoiDungRepo.timTheoId(dong.id_nguoi_dung);
  boDem.xoaSaiTheoTen(nguoiDung.ten_dang_nhap.toLowerCase());
  return {
    phien: { nguoiDung, ip: dong.dia_chi_ip_moi },
    thongTin: await thongTinNguoiXem(nguoiDung),
  };
}

// Gửi lại mã (Phần 3 mục 3.5). Trả { gmail_che, giay_cho_gui_lai }.
export async function guiLaiMaDangNhap(cho) {
  if (!cho) throw khongCoLuotCho();
  const dong = await xacMinhIpRepo.timTheoHocVien(cho.id_hoc_vien);
  if (!dong) throw khongCoLuotCho();
  if (dong.giay_cho_gui_lai > 0) {
    throw loi429(`Gửi lại mã sau ${dong.giay_cho_gui_lai} giây`, {
      them: { giay_cho_gui_lai: dong.giay_cho_gui_lai },
    });
  }
  return guiMaXacNhan(cho.id_hoc_vien, dong.gmail, cho.ip);
}

// ===== Quên mật khẩu (Phần 4) =====

// Có tài khoản hay không đều trả đúng câu này, để người lạ không dò được Gmail nào đã đăng ký (mục 4.4)
const DA_GUI_MA_NEU_CO = 'Nếu Gmail này đã đăng ký, mã xác nhận đã được gửi. Vui lòng kiểm tra hộp thư.';
const MA_DAT_LAI_SAI = 'Mã xác nhận không đúng hoặc đã hết hạn';
const DAT_LAI_SAI_QUA_NHIEU = 'Bạn đã nhập sai quá nhiều lần, vui lòng gửi lại mã mới';

// Gửi mã đặt lại nếu Gmail thuộc tài khoản đang hoạt động. Trả số giây còn phải chờ (0 là đã gửi hoặc không có gì để gửi).
async function guiMaDatLai(gmail) {
  const taiKhoan = await nguoiDungRepo.timTheoGmail(gmail);
  if (!taiKhoan || taiKhoan.khoa === 1) return 0;
  const giayCho = await maDatLaiRepo.giayChoGuiLai(taiKhoan.id);
  if (giayCho > 0) return giayCho;

  const ma = taoMa6So();
  const maDaBam = await bcrypt.hash(ma, 10);
  // Ghi và gửi trong một giao dịch: gửi thư lỗi thì không để lại mã, mã cũ vẫn còn hiệu lực
  await withTransaction(async (conn) => {
    await maDatLaiRepo.huyMaChuaDung(taiKhoan.id, conn);
    await maDatLaiRepo.themMa(taiKhoan.id, maDaBam, conn);
    await guiEmail({
      den: taiKhoan.gmail,
      tieuDe: 'Mã đặt lại mật khẩu AVA',
      noiDung: `Mã xác nhận để đặt lại mật khẩu tài khoản AVA của bạn là: ${ma}. Mã có hiệu lực trong ${HIEU_LUC_MA_XAC_NHAN_PHUT} phút. Nếu bạn không yêu cầu đặt lại mật khẩu, hãy bỏ qua email này.`,
    });
  });
  return 0;
}

// POST /api/tai-khoan/quen-mat-khau: chưa đủ 60 giây thì không gửi thêm nhưng vẫn trả như thường
export async function quenMatKhau(gmail) {
  await guiMaDatLai(gmail);
  return { thong_bao: DA_GUI_MA_NEU_CO };
}

// POST /api/tai-khoan/gui-lai-ma-dat-lai: như quên mật khẩu nhưng báo 429 khi tài khoản có thật và chưa đủ 60 giây
export async function guiLaiMaDatLai(gmail) {
  const giayCho = await guiMaDatLai(gmail);
  if (giayCho > 0) {
    throw loi429(`Gửi lại mã sau ${giayCho} giây`, { them: { giay_cho_gui_lai: giayCho } });
  }
  return { thong_bao: DA_GUI_MA_NEU_CO };
}

// POST /api/tai-khoan/dat-lai-mat-khau (mật khẩu mới đã được kiểm ở schemaDatLaiMatKhau)
export async function datLaiMatKhau({ gmail, ma, mat_khau_moi: matKhauMoi }) {
  const taiKhoan = await nguoiDungRepo.timTheoGmail(gmail);
  // Tài khoản không có hoặc đang bị khóa thì coi như không có mã hợp lệ, không tăng số lần sai
  if (!taiKhoan || taiKhoan.khoa === 1) throw loiMaDatLai(MA_DAT_LAI_SAI);

  const matKhauDaBam = await bcrypt.hash(matKhauMoi, 10);
  // Trả câu lỗi (số lần sai vẫn được lưu vì giao dịch không bị hủy) hoặc null khi đặt lại xong
  const cauLoi = await withTransaction(async (conn) => {
    const dong = await maDatLaiRepo.khoaMaMoiNhatChuaDung(taiKhoan.id, conn);
    if (!dong || dong.da_het_han) return MA_DAT_LAI_SAI;
    if (!(await bcrypt.compare(ma, dong.ma_6_so_da_bam))) {
      const soLanSai = dong.so_lan_sai + 1;
      const huyMa = soLanSai >= NHAP_MA_SAI_TOI_DA;
      await maDatLaiRepo.ghiLanSai(dong.id, soLanSai, huyMa, conn);
      return huyMa ? DAT_LAI_SAI_QUA_NHIEU : MA_DAT_LAI_SAI;
    }
    await nguoiDungRepo.capNhatMatKhau(taiKhoan.id, matKhauDaBam, conn);
    await maDatLaiRepo.danhDauDaDung(dong.id, conn);
    return null;
  });
  if (cauLoi) throw loiMaDatLai(cauLoi);

  // Gỡ tạm chặn đăng nhập của tên này (mục 4.4)
  boDem.xoaSaiTheoTen(taiKhoan.ten_dang_nhap.toLowerCase());
}

// Lỗi mã hiện chữ đỏ dưới ô mã của trang đặt lại
function loiMaDatLai(cau) {
  return loi400(cau, { cacO: { ma: cau } });
}
