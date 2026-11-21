# PHẦN 12. GIỎ HÀNG

Làm sau Phần 11.

## 12.1 Mục đích và ai dùng
- Khách (giỏ tạm trong trình duyệt) và học viên (giỏ của tài khoản trong cơ sở dữ liệu). Người cung cấp và admin không có giỏ.

## 12.2 Màn thiết kế
- thiet_ke/gio_hang/gio_hang_da_dang_nhap.html (màn "Giỏ hàng (đã đăng nhập)"): học viên có khóa trong giỏ.
- thiet_ke/gio_hang/gio_hang_chua_dang_nhap.html (màn "Giỏ hàng (chưa đăng nhập)"): khách chưa đăng nhập.
- thiet_ke/gio_hang/gio_hang_trong.html (màn "Giỏ hàng (trống)"): giỏ trống.
- thiet_ke/gio_hang/gio_hang_chua_chon_khoa.html (màn "Giỏ hàng (chưa chọn khóa nào)"): chưa tích khóa nào (nút "Mua" mờ, dòng "Hãy chọn ít nhất một khóa học").
- thiet_ke/gio_hang/gio_hang_co_khoa_khong_con_ban.html (màn "Giỏ hàng (có khóa không còn bán)"): có khóa không còn bán và khóa đã sở hữu.

## 12.3 Giao diện và hành vi
- "Thêm vào giỏ hàng" ở trang chi tiết: học viên thì lưu vào bảng gio_hang; khách thì lưu id khóa vào giỏ tạm trong trình duyệt (localStorage, bọc try/catch). Thêm xong hiện ô thông báo nhỏ "Đã thêm vào giỏ hàng" và nút đổi thành "Đã có trong giỏ - Xem giỏ hàng". Số trên biểu tượng giỏ tăng.
- Trang /gio-hang: "Bạn có N khóa học trong giỏ hàng.", ô "Chọn tất cả (M)" (M là số khóa tích được), "Xóa tất cả", mỗi khóa một dòng (ô tích, tên khóa, "Người cung cấp: họ tên", "N bài học", giá bán hiện tại, nút "Xóa"), khung "Tóm tắt đơn hàng" ("Đã chọn N khóa học", tên và giá các khóa đã tích, "Tổng tiền", nút "Mua").
- Khác thiết kế: mở giỏ thì không khóa nào được tích sẵn. Trạng thái tích chỉ giữ trong lúc ở trang giỏ (không lưu cơ sở dữ liệu).
- Chưa tích khóa nào: nút "Mua" mờ kèm dòng "Hãy chọn ít nhất một khóa học".
- Khóa bị ẩn hoặc bị gỡ vĩnh viễn hiện nhãn "Không còn bán"; khóa học viên đã có quyền học hiện "Bạn đã sở hữu khóa học này". Hai loại này bị mờ, không tích được, không tính tiền, vẫn xóa được. Khóa đã bị người cung cấp xóa thì tự biến khỏi giỏ.
- "Xóa" một khóa và "Xóa tất cả" (hỏi lại "Xóa tất cả khóa học khỏi giỏ hàng?" với nút "Xóa" và "Hủy") có tác dụng ngay.
- Giỏ trống: "Giỏ hàng của bạn đang trống", nút "Khám phá khóa học".
- Bấm "Mua": học viên thì sang /thong-tin-don-hang với danh sách id các khóa đã tích (Phần 13). Khách thì không tạo gì, chuyển sang /dang-nhap?tu=mua&quay_lai=/gio-hang (dòng "Vui lòng đăng nhập để mua khóa học"); giỏ tạm giữ nguyên.
- Bấm "Mua ngay" ở trang chi tiết: học viên thì sang /thong-tin-don-hang với đúng một khóa đó, không đụng tới giỏ. Khách thì chuyển sang /dang-nhap?tu=mua&quay_lai=/thong-tin-don-hang?mua_ngay=<id khóa>.
- Sau khi khách đăng nhập (Phần 3), nếu trình duyệt có giỏ tạm:
  - Tài khoản học viên: gửi giỏ tạm lên máy chủ để gộp; khóa đã có sẵn trong giỏ tài khoản thì không thêm lần nữa; khóa đã sở hữu hoặc không còn bán vẫn được gộp và hiện như ở giỏ thường; rồi xóa giỏ tạm. Không báo gì thêm. Đến từ nút "Mua" thì quay lại /gio-hang (các khóa vừa gộp không được tích sẵn). Đến từ "Mua ngay" thì đi thẳng tới trang Thông tin đơn hàng của khóa đó.
  - Tài khoản người cung cấp hoặc admin: không gộp, xóa giỏ tạm, hiện ô thông báo nhỏ "Tài khoản này không mua được khóa học", rồi đi tiếp như đăng nhập bình thường (không quay lại giỏ hay trang thanh toán).

## 12.4 Quy tắc
- Chỉ thêm được khóa 'Đang bán'. Học viên không thêm được khóa mình đang có quyền học hoặc khóa đã có trong giỏ (máy chủ trả 409).
- Giỏ không lưu giá; mỗi lần hiển thị lấy giá bán hiện tại. Người cung cấp đổi giá thì giỏ hiện giá mới.
- Giỏ tạm của khách chỉ chứa id khóa; mỗi lần mở trang giỏ, trang hỏi máy chủ thông tin hiện tại của các id đó.

## 12.5 Đường xử lý ở máy chủ
- GET /api/gio-hang (học viên): các khóa trong giỏ (bỏ khóa đã xóa và tự xóa các dòng đó khỏi bảng), mỗi khóa kèm trạng thái mua được, không còn bán hay đã sở hữu.
- POST /api/gio-hang: nhận id_khoa_hoc. DELETE /api/gio-hang/:id_khoa_hoc. DELETE /api/gio-hang (xóa tất cả).
- POST /api/gio-hang/gop: nhận danh sách id khóa từ giỏ tạm; chỉ học viên; bỏ qua id không tồn tại hoặc khóa đã xóa.
- POST /api/gio-hang/xem-tam (không cần đăng nhập): nhận danh sách id khóa, trả thông tin hiện tại để hiện giỏ của khách.

## 12.6 Bảng dữ liệu dùng
- gio_hang: id_hoc_vien, id_khoa_hoc (một học viên không có hai dòng cùng một khóa).
- khoa_hoc (trang_thai, da_xoa, gia_ban), bai_hoc (đếm bài), quyền học (Phần chung C5).

## 12.7 Câu thông báo
- "Đã thêm vào giỏ hàng", "Khóa học đã có trong giỏ hàng", "Bạn đã sở hữu khóa học này", "Không còn bán"
- "Hãy chọn ít nhất một khóa học"
- "Giỏ hàng của bạn đang trống"
- "Vui lòng đăng nhập để mua khóa học"
- "Tài khoản này không mua được khóa học"

## 12.8 Kiểm tra khi làm xong
- Khách thêm 2 khóa, đăng nhập bằng học viên đã có 1 trong 2 khóa đó trong giỏ: giỏ tài khoản có đủ 2 khóa, không trùng; giỏ tạm bị xóa.
- Khách thêm khóa rồi đăng nhập bằng người cung cấp: giỏ tạm bị xóa, thấy câu không mua được.
- Admin ẩn một khóa đang nằm trong giỏ: giỏ hiện "Không còn bán", không tích được.
- Người cung cấp gọi thẳng API giỏ hàng: 403.
- Danh sách kiểm thử đầy đủ: docs/kiem_thu/phan_12_gio_hang.md
