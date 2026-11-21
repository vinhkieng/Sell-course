// Giá trị ENUM chép đúng từng chữ từ database/AVA_CSDL_18-11.sql.
// Trong code luôn dùng các hằng số này, không gõ tay chuỗi trạng thái.
// Chữ hiển thị trên giao diện có thể khác giá trị lưu: xem Phần chung C11.

// khoa_hoc.trang_thai
export const TRANG_THAI_KHOA_HOC = Object.freeze({
  DANG_BAN: 'Đang bán',
  BI_AN: 'Bị ẩn',
  BI_GO_VINH_VIEN: 'Bị gỡ vĩnh viễn',
});

// khoa_hoc.bi_an_boi (gạch ngắn, đúng file SQL, Phần chung C3)
export const BI_AN_BOI = Object.freeze({
  TU_AN: 'Tự ẩn',
  ADMIN_AN: 'Admin ẩn',
  HE_THONG_KHOA_TAI_KHOAN: 'Hệ thống - khóa tài khoản',
});

// bai_hoc.loai
export const LOAI_BAI_HOC = Object.freeze({
  VIDEO: 'Video',
  TAI_LIEU: 'Tài liệu',
  TRAC_NGHIEM: 'Trắc nghiệm',
});

// cau_hoi_bai_tap.dap_an_dung
export const DAP_AN = Object.freeze(['A', 'B', 'C', 'D']);

// don_hang.trang_thai
export const TRANG_THAI_DON_HANG = Object.freeze({
  CHO_THANH_TOAN: 'Chờ thanh toán',
  DA_THANH_TOAN: 'Đã thanh toán',
  HET_HAN: 'Hết hạn',
  THAT_BAI: 'Thất bại',
});

// chi_tiet_don_hang.nguon_ban
export const NGUON_BAN = Object.freeze({
  GIOI_THIEU: 'Giới thiệu',
  HOC_VIEN_GIOI_THIEU: 'Học viên giới thiệu',
  TU_NHIEN: 'Tự nhiên',
});

// giao_dich_thanh_toan.nguon_den
export const NGUON_DEN = Object.freeze({
  TRINH_DUYET: 'Trình duyệt',
  MAY_CHU_CONG_THANH_TOAN: 'Máy chủ cổng thanh toán',
  KIEM_TRA_LAI: 'Kiểm tra lại',
});

// yeu_cau_rut_tien.trang_thai
export const TRANG_THAI_RUT_TIEN = Object.freeze({
  CHO_DUYET: 'Chờ duyệt',
  DA_CHUYEN: 'Đã chuyển',
  TU_CHOI: 'Từ chối',
});

// thong_bao.loai
export const LOAI_THONG_BAO = Object.freeze({
  KHOA_HOC_BI_AN: 'Khóa học bị ẩn',
  KHOA_HOC_BI_GO_VINH_VIEN: 'Khóa học bị gỡ vĩnh viễn',
  DA_CHUYEN_TIEN: 'Đã chuyển tiền',
  TU_CHOI_RUT_TIEN: 'Từ chối rút tiền',
});

// bao_cao_danh_gia.ly_do
export const LY_DO_BAO_CAO_DANH_GIA = Object.freeze([
  'Ngôn từ phản cảm',
  'Quảng cáo hoặc spam',
  'Lý do khác',
]);

// bao_cao_danh_gia.bien_phap_xu_ly (NULL là chưa xử lý)
export const BIEN_PHAP_BAO_CAO_DANH_GIA = Object.freeze({
  AN_DANH_GIA: 'Ẩn đánh giá',
  KHONG_VI_PHAM: 'Không vi phạm',
});

// bao_cao_khoa_hoc.ly_do
export const LY_DO_BAO_CAO_KHOA_HOC = Object.freeze([
  'Nội dung phản cảm',
  'Vi phạm bản quyền',
  'Lừa đảo hoặc mô tả sai nội dung',
  'Lý do khác',
]);

// bao_cao_khoa_hoc.bien_phap_xu_ly (NULL là chưa xử lý)
export const BIEN_PHAP_BAO_CAO_KHOA_HOC = Object.freeze({
  KHONG_VI_PHAM: 'Không vi phạm',
  AN_KHOA: 'Ẩn khóa',
  GO_VINH_VIEN: 'Gỡ vĩnh viễn',
});

// lich_su_khoa_hoc.hanh_dong (19 giá trị, Phần chung C15)
export const HANH_DONG_LICH_SU = Object.freeze({
  DANG_KHOA_HOC: 'Đăng khóa học',
  SUA_THONG_TIN_KHOA: 'Sửa thông tin khóa',
  DOI_GIA: 'Đổi giá',
  DOI_ANH_BIA: 'Đổi ảnh bìa',
  DOI_DANH_MUC: 'Đổi danh mục',
  THEM_BAI: 'Thêm bài',
  SUA_BAI: 'Sửa bài',
  THAY_FILE: 'Thay file',
  DOI_THU_TU_BAI: 'Đổi thứ tự bài',
  XOA_BAI: 'Xóa bài',
  NGUOI_CUNG_CAP_AN: 'Người cung cấp ẩn',
  NGUOI_CUNG_CAP_DANG_LAI: 'Người cung cấp đăng lại',
  NGUOI_CUNG_CAP_XOA_KHOA_HOC: 'Người cung cấp xóa khóa học',
  QUAN_TRI_VIEN_AN_KHOA: 'Quản trị viên ẩn khóa',
  QUAN_TRI_VIEN_GO_VINH_VIEN: 'Quản trị viên gỡ vĩnh viễn',
  QUAN_TRI_VIEN_GOP_DANH_MUC: 'Quản trị viên gộp danh mục',
  HE_THONG_AN_DO_KHOA_TAI_KHOAN: 'Hệ thống ẩn do khóa tài khoản',
  HE_THONG_GO_VINH_VIEN: 'Hệ thống gỡ vĩnh viễn',
  HE_THONG_BAN_LAI_DO_MO_KHOA_TAI_KHOAN: 'Hệ thống bán lại do mở khóa tài khoản',
});
