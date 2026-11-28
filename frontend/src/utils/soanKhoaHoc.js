// Hàm thuần của trang tạo khóa học (Phần 7 mục 7.3, 7.4, 7.7): kiểm bước 1 và bài, chèn, xóa, đổi số thứ tự bài,
// định dạng thời lượng, dung lượng, giá. Số và câu lấy đúng đặc tả, giống backend/validators/khoaHocValidator.js.
import { chuanHoaTenDanhMuc, kiemTraTenDanhMuc } from './kiemTraDanhMuc.js'

export const LOAI_BAI = Object.freeze({ VIDEO: 'Video', TAI_LIEU: 'Tài liệu', TRAC_NGHIEM: 'Trắc nghiệm' })
export const LOAI_ANH_BIA = 'Ảnh bìa'

export const TEN_TOI_DA = 200 // tên khóa học, tên bài
export const NOI_DUNG_DAI_TOI_DA = 10000
export const VIDEO_TOI_DA_BYTE = 314572800 // 300MB
export const TAI_LIEU_TOI_DA_BYTE = 20971520 // 20MB
export const ANH_BIA_TOI_DA_BYTE = 2 * 1024 * 1024
export const THOI_LUONG_TOI_DA_GIAY = 21600 // 6 giờ
export const SO_BAI_TOI_THIEU = 3
export const SO_CAU_TOI_THIEU = 5
export const SO_CAU_TOI_DA = 50
export const CAU_HOI_TOI_DA = 1000 // ký tự của nội dung câu hỏi
export const LUA_CHON_TOI_DA = 255 // ký tự của mỗi lựa chọn
const THOI_GIAN_TOI_DA_PHUT = 180
const GIA_TOI_THIEU = 10000
const GIA_TOI_DA = 50000000

export const GIA_SAI = 'Giá bán phải từ 10.000đ đến 50.000.000đ'
export const QUA_DAI = 'Nội dung quá dài.'
export const DANH_MUC_DA_CO = 'Danh mục này đã có, vui lòng chọn trong danh sách'
export const ANH_SAI = 'Ảnh phải là jpg hoặc png, tối đa 2MB'
export const VIDEO_SAI = 'File phải là video .mp4 và không quá 300MB'
export const TAI_LIEU_SAI = 'File phải là .pdf và không quá 20MB'
export const KHONG_PHAT_DUOC =
  'Video này không phát được trên trình duyệt. Hãy xuất lại video ở kiểu nén H.264. Với iPhone: vào Cài đặt, chọn Camera, chọn Định dạng, chọn Tương thích nhất.'
export const THOI_LUONG_SAI = 'Video phải dài từ 1 giây đến 6 giờ.'
export const FILE_DA_CO = 'File này đã có trên AVA'
export const FILE_KHONG_CON = 'File của bài này không còn trên máy chủ, vui lòng sửa bài và chọn lại file.'
export const BAI_1_SAI = 'Bài số 1 phải là bài video hoặc tài liệu.'
export const THOI_GIAN_SAI = 'Thời gian làm bài từ 1 đến 180 phút.'
export const CAU_IT_SAI = 'Bài trắc nghiệm cần ít nhất 5 câu.'

// Bốn lựa chọn của một câu trắc nghiệm: chữ hiện trên trang và tên ô (cột của cau_hoi_bai_tap)
export const CAC_LUA_CHON = [
  ['A', 'lua_chon_a'],
  ['B', 'lua_chon_b'],
  ['C', 'lua_chon_c'],
  ['D', 'lua_chon_d'],
]

// Một câu trống; khoa là khóa riêng trong trang để React phân biệt các câu, không gửi lên máy chủ
export const cauHoiTrong = (khoa) => ({
  khoa,
  noi_dung: '',
  lua_chon_a: '',
  lua_chon_b: '',
  lua_chon_c: '',
  lua_chon_d: '',
  dap_an_dung: '',
})

let demCau = 0
// Câu trống mới với khóa chưa dùng trong trang
export const taoCauMoi = () => cauHoiTrong(++demCau)

// Giá trị ô "Danh mục" khi chọn "Khác"
export const DANH_MUC_KHAC = 'khac'

// Đếm theo ký tự như máy chủ (chữ ngoài bảng mã cơ bản tính là 1)
export const soKyTu = (chu) => [...chu].length

// So tên danh mục không phân biệt hoa thường và dấu (mục 7.3)
const boDau = (ten) =>
  chuanHoaTenDanhMuc(ten)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/gi, 'd')
    .toLowerCase()

export const laTrungDanhMuc = (ten, danhMuc) => danhMuc.some((dm) => boDau(dm.ten) === boDau(ten))

// Câu lỗi của ô "Tên danh mục mới", '' khi hợp lệ
export function loiTenDanhMucMoi(ten, danhMuc) {
  if (!ten.trim()) return 'Vui lòng nhập tên danh mục mới'
  return kiemTraTenDanhMuc(ten) || (laTrungDanhMuc(ten, danhMuc) ? DANH_MUC_DA_CO : '')
}

// Ô giá khi gõ: chỉ có chữ số (và dấu chấm) thì tự thêm dấu chấm ngăn nghìn ("349000" thành "349.000");
// có ký tự khác (ví dụ "10000,5") thì giữ nguyên để báo lỗi khi bấm "Tiếp tục"
export function dinhDangGiaKhiGo(chu) {
  if (!/^[\d.]*$/.test(chu)) return chu
  return chu
    .replace(/\./g, '')
    .replace(/^0+(?=\d)/, '')
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

// "349.000" thành 349000; không phải số nguyên đồng thì NaN
export const docGia = (chu) => (/^\d{1,3}(\.\d{3})*$|^\d+$/.test(chu) ? Number(chu.replace(/\./g, '')) : NaN)

// Kiểm bước 1 trước khi sang bước 2. tt: các ô dạng chữ; id_danh_muc là '' (chưa chọn), DANH_MUC_KHAC hoặc id.
// Trả { ten_o: câu lỗi }, rỗng khi hợp lệ.
export function kiemTraBuoc1(tt, danhMuc) {
  const loi = {}
  if (!tt.ten_khoa_hoc.trim()) loi.ten_khoa_hoc = 'Vui lòng nhập tên khóa học'
  else if (soKyTu(tt.ten_khoa_hoc.trim()) > TEN_TOI_DA) loi.ten_khoa_hoc = QUA_DAI
  if (!tt.mo_ta.trim()) loi.mo_ta = 'Vui lòng nhập mô tả khóa học'
  for (const o of ['mo_ta', 'hoc_duoc_gi', 'yeu_cau', 'danh_cho_ai']) {
    if (!loi[o] && soKyTu(tt[o].trim()) > NOI_DUNG_DAI_TOI_DA) loi[o] = QUA_DAI
  }
  if (!tt.id_danh_muc) loi.id_danh_muc = 'Vui lòng chọn danh mục'
  else if (tt.id_danh_muc === DANH_MUC_KHAC) {
    const loiTen = loiTenDanhMucMoi(tt.ten_danh_muc_moi, danhMuc)
    if (loiTen) loi.ten_danh_muc_moi = loiTen
  }
  const gia = docGia(tt.gia_ban)
  if (!(gia >= GIA_TOI_THIEU && gia <= GIA_TOI_DA)) loi.gia_ban = GIA_SAI
  return loi
}

// Lỗi bước 1 máy chủ trả lúc đăng (cac_o "thong_tin.mo_ta"...) đổi sang tên ô của trang
export function loiBuoc1TuMayChu(cacO) {
  const loi = {}
  for (const [o, cau] of Object.entries(cacO)) {
    if (o.startsWith('thong_tin.')) loi[o.slice('thong_tin.'.length)] = cau
  }
  return loi
}

// Kiểm một bài trước khi "Lưu bài học". Bài trắc nghiệm kiểm thêm thời gian, số câu và từng câu (mục 7.4, 7.7).
// Trả { ten_bai_hoc, thoi_gian_lam_bai, cau_hoi (số câu), cac_cau: { [khoa]: { noi_dung, lua_chon_trong, lua_chon, dap_an } } },
// chỉ có các ô sai; rỗng khi hợp lệ.
export function kiemTraBai(bai) {
  const loi = {}
  if (!bai.ten_bai_hoc.trim()) loi.ten_bai_hoc = 'Vui lòng nhập tên bài'
  if (bai.loai !== LOAI_BAI.TRAC_NGHIEM) return loi

  const phut = Number(bai.thoi_gian_lam_bai)
  if (!bai.thoi_gian_lam_bai || !Number.isInteger(phut) || phut < 1 || phut > THOI_GIAN_TOI_DA_PHUT) {
    loi.thoi_gian_lam_bai = THOI_GIAN_SAI
  }
  if (bai.cau_hoi.length < SO_CAU_TOI_THIEU) loi.cau_hoi = CAU_IT_SAI

  const cacCau = {}
  for (const cau of bai.cau_hoi) {
    const loiCau = {}
    if (!cau.noi_dung.trim()) loiCau.noi_dung = 'Vui lòng nhập nội dung câu hỏi'
    const trong = CAC_LUA_CHON.filter(([, o]) => !cau[o].trim()).map(([, o]) => o)
    if (trong.length > 0) {
      loiCau.lua_chon_trong = trong
      loiCau.lua_chon = 'Vui lòng nhập đủ 4 lựa chọn'
    }
    if (!cau.dap_an_dung) loiCau.dap_an = 'Vui lòng chọn đáp án đúng'
    if (Object.keys(loiCau).length > 0) cacCau[cau.khoa] = loiCau
  }
  if (Object.keys(cacCau).length > 0) loi.cac_cau = cacCau
  return loi
}

// Bài số 1 phải là video hoặc tài liệu (mục 7.4)
export const bai1LaTracNghiem = (ds) => ds[0]?.loai === LOAI_BAI.TRAC_NGHIEM

// Chữ trên nhãn loại bài ở bước 2: "Video, 05:40", "Tài liệu", "Trắc nghiệm, 5 câu, 10 phút"
export function chuLoaiBai(bai) {
  if (bai.loai === LOAI_BAI.VIDEO) return `Video, ${dinhDangThoiLuong(bai.file.thoi_luong)}`
  if (bai.loai === LOAI_BAI.TRAC_NGHIEM) return `Trắc nghiệm, ${bai.cau_hoi.length} câu, ${bai.thoi_gian_lam_bai} phút`
  return bai.loai
}

// Vị trí (tính từ 0) của số thứ tự đã gõ trong danh sách đang có soBai bài.
// Lớn hơn số bài, để trống hoặc 0 thì xếp vào cuối.
export function viTriChen(chuSo, soBai) {
  const so = Number(chuSo)
  return chuSo && Number.isInteger(so) && so >= 1 && so <= soBai ? so - 1 : soBai
}

// Chèn bài vào số đã gõ: bài đang ở số đó và các bài sau dời xuống một số
export function chenBai(ds, bai, chuSo) {
  const i = viTriChen(chuSo, ds.length)
  return [...ds.slice(0, i), bai, ...ds.slice(i)]
}

// Xóa bài: các bài sau dồn lên (số thứ tự là vị trí trong danh sách)
export const xoaBai = (ds, khoa) => ds.filter((b) => b.khoa !== khoa)

// Sửa bài (có thể đổi số thứ tự): bỏ bài ra rồi chèn lại vào số mới
export const suaBai = (ds, bai, chuSo) => chenBai(xoaBai(ds, bai.khoa), bai, chuSo)

// Dữ liệu gửi POST /api/nguoi-cung-cap/khoa-hoc (mục 7.5)
export function taoDuLieuDang(tt, anhBia, baiHoc) {
  const khac = tt.id_danh_muc === DANH_MUC_KHAC
  return {
    thong_tin: {
      ten_khoa_hoc: tt.ten_khoa_hoc,
      mo_ta: tt.mo_ta,
      id_danh_muc: khac ? null : Number(tt.id_danh_muc),
      ten_danh_muc_moi: khac ? tt.ten_danh_muc_moi : null,
      gia_ban: docGia(tt.gia_ban),
      hoc_duoc_gi: tt.hoc_duoc_gi,
      yeu_cau: tt.yeu_cau,
      danh_cho_ai: tt.danh_cho_ai,
      ma_file_tam_anh_bia: anhBia?.ma_file_tam ?? null,
    },
    bai_hoc: baiHoc.map((b, i) => {
      const chung = { ten_bai_hoc: b.ten_bai_hoc, so_thu_tu: i + 1, loai: b.loai }
      if (b.loai !== LOAI_BAI.TRAC_NGHIEM) return { ...chung, ma_file_tam: b.file.ma_file_tam }
      return {
        ...chung,
        thoi_gian_lam_bai: Number(b.thoi_gian_lam_bai),
        cau_hoi: b.cau_hoi.map(({ khoa: _khoa, ...cau }) => cau),
      }
    }),
    cam_ket: true,
  }
}

const hai = (so) => String(so).padStart(2, '0')

// Thời lượng video: dưới 1 giờ "05:40", từ 1 giờ "1:02:05" (mục 7.3)
export function dinhDangThoiLuong(giay) {
  const gio = Math.floor(giay / 3600)
  const phut = Math.floor((giay % 3600) / 60)
  return gio > 0 ? `${gio}:${hai(phut)}:${hai(giay % 60)}` : `${hai(phut)}:${hai(giay % 60)}`
}

// Dung lượng file: dưới 1 MB ghi KB ("850 KB"), dưới 10 MB một chữ số thập phân ("3,4 MB"), từ 10 MB số nguyên ("48 MB")
export function dinhDangDungLuong(byte) {
  const mb = byte / (1024 * 1024)
  if (mb < 1) return `${Math.max(1, Math.round(byte / 1024))} KB`
  const motSo = Math.round(mb * 10) / 10
  return motSo < 10 ? `${motSo.toFixed(1).replace('.', ',')} MB` : `${Math.round(mb)} MB`
}
