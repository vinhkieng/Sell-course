// Nghiệp vụ danh mục ở khu quản trị: thêm, đổi tên, xóa, gộp (Phần 6 mục 6.4, 6.5, 6.6).
// Tên gửi tới đây đã được chuẩn hóa và kiểm luật ở validators/danhMucValidator.js.
import { withTransaction } from '../database/db.js';
import { loi404, loi409 } from '../lib/httpError.js';
import { HANH_DONG_LICH_SU } from '../constants/trangThai.js';
import { SO_DONG_QUAN_TRI_MOI_TRANG } from '../constants/nghiepVu.js';
import * as danhMucRepo from '../repositories/danhMucRepository.js';
import * as khoaHocRepo from '../repositories/khoaHocRepository.js';
import { ghiLichSu } from '../repositories/lichSuKhoaHocRepository.js';

const TEN_TRUNG = 'Tên danh mục đã tồn tại';

const loiTrung = (tenO) => loi409(TEN_TRUNG, { ma: 'TEN_DANH_MUC_TRUNG', cacO: { [tenO]: TEN_TRUNG } });
const loiKhongCon = () => loi404('Danh mục không còn tồn tại.', { ma: 'DANH_MUC_KHONG_CON' });

// Hai admin thêm cùng một tên cùng lúc: ràng buộc không trùng của MySQL chặn người sau, đổi thành câu trùng tên
async function chanTrungTen(congViec, tenO) {
  try {
    return await congViec();
  } catch (loi) {
    if (loi.code === 'ER_DUP_ENTRY') throw loiTrung(tenO);
    throw loi;
  }
}

export async function layTrang(trang) {
  const boQua = (trang - 1) * SO_DONG_QUAN_TRI_MOI_TRANG;
  const [danhSach, tong] = await Promise.all([
    danhMucRepo.layTrangQuanTri(SO_DONG_QUAN_TRI_MOI_TRANG, boQua),
    danhMucRepo.demTatCa(),
  ]);
  return { danh_sach: danhSach, tong, trang };
}

export async function them(ten) {
  if (await danhMucRepo.timTheoTen(ten)) throw loiTrung('ten');
  const id = await chanTrungTen(() => danhMucRepo.them(ten), 'ten');
  return { id, ten };
}

// Đổi tên không ghi lịch sử khóa học (Phần 6 mục 6.6). Trùng chính nó (chỉ khác hoa thường, dấu) thì được.
export async function doiTen(id, ten) {
  return chanTrungTen(
    () =>
      withTransaction(async (conn) => {
        const [danhMuc] = await danhMucRepo.khoaTheoIds([id], conn);
        if (!danhMuc) throw loiKhongCon();
        const trung = await danhMucRepo.timTheoTen(ten, conn);
        if (trung && trung.id !== id) throw loiTrung('ten');
        await danhMucRepo.doiTen(id, ten, conn);
        return { id, ten };
      }),
    'ten',
  );
}

// Chỉ xóa được khi không còn khóa nào, kể cả khóa đã xóa (Phần 6 mục 6.5)
export async function xoa(id) {
  await withTransaction(async (conn) => {
    // Khóa dòng danh mục trước: người cung cấp đăng khóa vào danh mục này cùng lúc phải chờ giao dịch này xong
    const [danhMuc] = await danhMucRepo.khoaTheoIds([id], conn);
    if (!danhMuc) throw loiKhongCon();
    const soKhoa = await khoaHocRepo.demTheoDanhMuc(id, conn);
    if (soKhoa > 0) {
      throw loi409(`Danh mục đang có ${soKhoa} khóa học`, { ma: 'DANH_MUC_CON_KHOA', them: { so_khoa: soKhoa } });
    }
    await danhMucRepo.xoaTheoIds([id], conn);
  });
}

// Gộp trong một giao dịch (Phần 6 mục 6.5). Tên mới trùng một danh mục đang tích thì giữ danh mục đó
// (đổi theo cách viết mới), không thì tạo danh mục mới. Chỉ khóa thật sự chuyển danh mục mới ghi lịch sử.
export async function gop(ids, tenMoi, idAdmin) {
  return chanTrungTen(
    () =>
      withTransaction(async (conn) => {
        const cacDanhMuc = await danhMucRepo.khoaTheoIds(ids, conn);
        if (cacDanhMuc.length !== ids.length) throw loiKhongCon();

        const trung = await danhMucRepo.timTheoTen(tenMoi, conn);
        let idDich;
        if (trung) {
          if (!ids.includes(trung.id)) throw loiTrung('ten_moi');
          idDich = trung.id;
          await danhMucRepo.doiTen(idDich, tenMoi, conn);
        } else {
          idDich = await danhMucRepo.them(tenMoi, conn);
        }

        const cacNguon = cacDanhMuc.filter((dm) => dm.id !== idDich);
        const idsNguon = cacNguon.map((dm) => dm.id);
        const tenCu = new Map(cacNguon.map((dm) => [dm.id, dm.ten]));
        const cacKhoa = await khoaHocRepo.khoaTheoDanhMuc(idsNguon, conn);
        if (cacKhoa.length > 0) {
          await khoaHocRepo.chuyenDanhMuc(idsNguon, idDich, conn);
          await ghiLichSu(
            cacKhoa.map((kh) => ({
              idKhoaHoc: kh.id,
              idNguoiDung: idAdmin,
              hanhDong: HANH_DONG_LICH_SU.QUAN_TRI_VIEN_GOP_DANH_MUC,
              giaTriCu: tenCu.get(kh.id_danh_muc),
              giaTriMoi: tenMoi,
            })),
            conn,
          );
        }
        await danhMucRepo.xoaTheoIds(idsNguon, conn);
        return { id: idDich, ten: tenMoi };
      }),
    'ten_moi',
  );
}
