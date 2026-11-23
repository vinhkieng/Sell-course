// Hằng số nghiệp vụ dùng ở nhiều phần, chép đúng số trong Phần chung của đặc tả
// (docs/dac_ta/phan_00_chung.md) và ràng buộc trong file SQL. Hằng số chỉ dùng ở một phần
// thì phần đó tự thêm vào đây khi làm, lấy đúng số ghi trong phần đó.

// Chia doanh thu (Phần chung C1): phần trăm người cung cấp nhận
export const MUC_CHIA_GIOI_THIEU = 90; // mua qua link giới thiệu của chính chủ khóa trong 24 giờ
export const MUC_CHIA_MAC_DINH = 60; // các trường hợp còn lại
export const HIEU_LUC_LINK_GIOI_THIEU_GIO = 24;

// Tạm giữ tiền và hoàn tiền (Phần chung C1)
export const TAM_GIU_TIEN_NGAY = 7;
export const HAN_HOAN_TIEN_NGAY = 7;
export const TIEN_DO_HOAN_TIEN_TOI_DA = 30; // phần trăm

// Đơn hàng (Phần chung C13)
export const HAN_THANH_TOAN_PHUT = 30;

// Giá bán (ràng buộc ck_khoa_hoc_gia_ban trong file SQL)
export const GIA_BAN_TOI_THIEU = 10000;
export const GIA_BAN_TOI_DA = 50000000;

// Phân trang (Phần chung C16)
export const SO_KHOA_MOI_TRANG = 9;
export const SO_DONG_QUAN_TRI_MOI_TRANG = 20;
export const SO_DONG_DOANH_THU_GAN_DAY = 5;
export const SO_DONG_LICH_SU_DON_HANG = 10;
export const SO_DONG_LICH_SU_RUT_TIEN = 10;
export const SO_DANH_GIA_DAU_TIEN = 3;
export const SO_DANH_GIA_MOI_LAN_XEM_THEM = 10;
export const SO_THONG_BAO_TRONG_CHUONG = 5;

// Bộ đếm trong bộ nhớ (Phần chung C13)
export const SAI_THEO_TEN_TOI_DA = 5; // sai 5 lần liên tiếp theo tên đăng nhập
export const CHAN_THEO_TEN_PHUT = 5; // thì chặn tên đó 5 phút
export const SAI_THEO_IP_TOI_DA = 20; // 20 lần sai theo địa chỉ IP
export const KHUNG_DEM_SAI_THEO_IP_PHUT = 15; // trong 15 phút
export const CHAN_THEO_IP_PHUT = 15; // thì chặn địa chỉ đó 15 phút
export const GUI_MA_XAC_NHAN_TOI_DA = 5; // tối đa 5 lần gửi mã xác nhận đăng nhập
export const KHUNG_GUI_MA_XAC_NHAN_GIO = 1; // trong 1 giờ

// Mã 6 chữ số gửi qua Gmail: xác nhận địa chỉ mạng (Phần 3 mục 3.4) và đặt lại mật khẩu (Phần 4 mục 4.4)
export const HIEU_LUC_MA_XAC_NHAN_PHUT = 10;
export const NHAP_MA_SAI_TOI_DA = 5;
export const GIAY_CHO_GUI_LAI_MA = 60;

// File (Phần chung C12, C13)
export const THOI_LUONG_VIDEO_TOI_THIEU_GIAY = 1;
export const THOI_LUONG_VIDEO_TOI_DA_GIAY = 21600; // 6 giờ
export const FILE_TAM_HET_HAN_GIO = 24;
