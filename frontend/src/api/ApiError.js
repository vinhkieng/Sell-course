// Lỗi khi gọi backend, dùng thống nhất ở mọi trang. Theo mẫu lỗi của Phần chung C6:
// loi: câu thông báo hiện cho người dùng; ma: mã lỗi (nếu có, ví dụ TAI_KHOAN_BI_KHOA);
// cacO: { ten_o: "câu lỗi" } để hiện dòng đỏ dưới đúng ô của form;
// them: các trường khác backend trả kèm (ví dụ ly_do_khoa, vi_tri_bai).
export class ApiError extends Error {
  constructor({ status, loi, ma, cac_o: cacO, ...them }) {
    super(loi)
    this.name = 'ApiError'
    this.status = status
    this.ma = ma ?? null
    this.cacO = cacO ?? {}
    this.them = them
  }
}
