// Lỗi có mã trạng thái HTTP. Controller và service gặp lỗi thì throw lớp này,
// middleware lỗi ở cuối app.js trả về đúng mẫu của Phần chung C6:
// { "loi": "câu thông báo", "ma": "MA_LOI_NEU_CO", "cac_o": { "ten_o": "câu lỗi dưới ô" } }
// Chỗ nào phần chức năng cần trả thêm thông tin thì truyền vào them, ví dụ { vi_tri_bai: 3 },
// các trường này đứng cùng cấp với loi, ma, cac_o.
export class HttpError extends Error {
  constructor(status, loi, { ma, cacO, them } = {}) {
    super(loi);
    this.name = 'HttpError';
    this.status = status;
    this.ma = ma;
    this.cacO = cacO;
    this.them = them;
  }
}

// Các hàm tắt theo mã trạng thái ở Phần chung C6
export const loi400 = (loi, tuyChon) => new HttpError(400, loi, tuyChon);
export const loi401 = (loi = 'Bạn cần đăng nhập để tiếp tục.', tuyChon) =>
  new HttpError(401, loi, tuyChon);
export const loi403 = (loi = 'Bạn không có quyền truy cập', tuyChon) =>
  new HttpError(403, loi, tuyChon);
export const loi404 = (loi = 'Không tìm thấy trang', tuyChon) => new HttpError(404, loi, tuyChon);
export const loi409 = (loi, tuyChon) => new HttpError(409, loi, tuyChon);
export const loi413 = (loi = 'Dữ liệu gửi lên quá lớn.', tuyChon) =>
  new HttpError(413, loi, tuyChon);
export const loi429 = (loi, tuyChon) => new HttpError(429, loi, tuyChon);
