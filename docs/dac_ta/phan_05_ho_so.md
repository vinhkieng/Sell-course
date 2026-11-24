# PHẦN 5. HỒ SƠ CÁ NHÂN VÀ ĐỔI MẬT KHẨU

Làm sau Phần 3. Phần này dựng khung trang hồ sơ cho cả ba vai trò và hai mục "Thông tin cá nhân", "Đổi mật khẩu" (admin thêm "Thông tin hợp đồng"). Các mục khác của trang hồ sơ do phần khác làm: học viên "Khóa học của tôi", "Tiến độ học" (Phần 14) và "Lịch sử đơn hàng" (Phần 13); người cung cấp "Quản lý khóa học" (Phần 8), "Ví" và "Rút tiền" (Phần 17). Ở phần này các mục đó chỉ cần chừa chỗ.

## 5.1 Mục đích và ai dùng
- Học viên, người cung cấp, admin xem và sửa thông tin cá nhân, đổi mật khẩu. Admin xem thêm thông tin hợp đồng (chỉ xem).

## 5.2 Màn thiết kế
- thiet_ke/ho_so/ho_so_hoc_vien.html (màn "Hồ sơ - Học viên"): hồ sơ học viên (trang dài, menu trái).
- thiet_ke/ho_so/ho_so_hoc_vien_bao_loi.html (màn "Hồ sơ - Học viên (báo lỗi: ảnh, số điện thoại, để trống mật khẩu)"): báo lỗi ảnh, số điện thoại, để trống mật khẩu.
- thiet_ke/ho_so/ho_so_hoc_vien_loi_mat_khau.html (màn "Hồ sơ - Học viên (lỗi mật khẩu: sai định dạng, không khớp)"): lỗi mật khẩu sai định dạng, nhập lại không khớp.
- thiet_ke/ho_so/ho_so_hoc_vien_da_luu.html (màn "Hồ sơ - Học viên (đã lưu thông tin, mật khẩu mới trùng cũ)"): đã lưu thông tin; báo mật khẩu mới trùng mật khẩu cũ.
- thiet_ke/ho_so/ho_so_nguoi_cung_cap.html (màn "Hồ sơ người cung cấp"): hồ sơ người cung cấp (ở phần này chỉ làm khung trang và mục Thông tin cá nhân, Đổi mật khẩu).
- thiet_ke/ho_so/ho_so_admin.html (màn "Hồ sơ - Admin"): hồ sơ admin (đầu trang khu quản trị, có mục Thông tin hợp đồng).

## 5.3 Giao diện và hành vi
- Trang /ho-so dài một trang; menu trái theo vai trò:
  - Học viên: Thông tin cá nhân, Đổi mật khẩu, Khóa học của tôi, Tiến độ học, Lịch sử đơn hàng, Đăng xuất.
  - Người cung cấp: Thông tin cá nhân, Đổi mật khẩu, Quản lý khóa học, Ví, Rút tiền, Đăng xuất.
  - Admin: Thông tin cá nhân, Thông tin hợp đồng, Đổi mật khẩu, Đăng xuất.
  Bấm một mục thì cuộn tới mục đó (dùng neo ở Phần chung C7); mở /ho-so#ten-muc thì tự cuộn tới mục đó. Neo sai thì ở đầu trang, không lỗi.
- Thông tin cá nhân: ảnh đại diện và nút "Đổi ảnh" (dòng "JPG hoặc PNG, tối đa 2 MB"), Tên đăng nhập (chỉ xem), Họ và tên, Gmail (luôn điền sẵn Gmail hiện tại), Số điện thoại; học viên thêm Nghề nghiệp (không bắt buộc) và Ngày sinh (không bắt buộc, dạng dd/mm/yyyy); nút "Lưu thay đổi" và "Hủy" (Hủy trả các ô về giá trị đang lưu).
- Người cung cấp đã từng đăng ít nhất một khóa học (có ít nhất một dòng khoa_hoc của người đó, kể cả khóa đã xóa) thì ô Họ và tên và Số điện thoại bị mờ kèm dòng "Đã đăng khóa học nên không đổi được họ tên và số điện thoại."
- Đổi ảnh: chọn file là gửi lên ngay; thành công thì ảnh mới hiện ngay ở hồ sơ và ở đầu trang.
- Đổi mật khẩu: ô "Mật khẩu hiện tại", "Mật khẩu mới", "Xác nhận mật khẩu mới" (dòng gợi ý "Mật khẩu gồm 6 chữ số"), nút "Đổi mật khẩu".
- Thông tin hợp đồng (chỉ admin, chỉ xem): Số CCCD, Ngày cấp, Nơi cấp, Số hợp đồng, Ngày bắt đầu làm, dòng "Thông tin hợp đồng chỉ để xem. Cần thay đổi thì liên hệ bộ phận quản lý nhân sự." Số CCCD chỉ trả về cho chính admin đó và không ghi vào nhật ký máy chủ.

## 5.4 Quy tắc
- Họ và tên: 2 đến 100 ký tự, chỉ chữ (có dấu hoặc không dấu) và dấu cách; tự bỏ khoảng trắng thừa ở đầu, cuối và giữa.
- Số điện thoại: 10 chữ số, bắt đầu bằng 0.
- Gmail: luật như lúc đăng ký (Phần 2), không trùng tài khoản khác, không cần nhập mật khẩu, không gửi email xác minh. Lưu chữ thường.
- Học viên đã có ít nhất một đơn hàng (bất kỳ trạng thái) thì không được xóa trống họ tên và số điện thoại. Học viên chưa có đơn thì được để trống hai ô này. Người cung cấp và admin được để trống (người cung cấp cần đủ hai ô mới tạo được khóa, Phần 7).
- Nghề nghiệp tối đa 100 ký tự. Ngày sinh phải là ngày có thật, trước hôm nay và từ 01/01/1900 trở về sau.
- Ảnh đại diện: JPG hoặc PNG thật (kiểm bằng byte đầu file), tối đa 2MB. Ảnh mới thay ảnh cũ; file ảnh cũ bị xóa khỏi máy chủ.
- Đổi mật khẩu: ba ô bắt buộc; mật khẩu mới đúng 6 chữ số; hai ô mới giống nhau; mật khẩu hiện tại phải đúng; mật khẩu mới khác mật khẩu hiện tại. Sai mật khẩu hiện tại không bị chặn. Đổi xong không đăng xuất nơi khác.
- Admin sửa được họ tên, Gmail, số điện thoại, ảnh của mình; không sửa được thông tin hợp đồng.

## 5.5 Đường xử lý ở máy chủ
- GET /api/ho-so: trả thông tin cá nhân theo vai trò (học viên thêm nghe_nghiep, ngay_sinh; người cung cấp thêm da_dang_khoa_hoc; admin thêm thông tin hợp đồng).
- PUT /api/ho-so: nhận ho_ten, gmail, so_dien_thoai (học viên thêm nghe_nghiep, ngay_sinh). Kiểm tra theo 5.4; người cung cấp đã đăng khóa mà gửi họ tên hoặc số điện thoại khác giá trị đang lưu thì trả 400. Trả 200 kèm dữ liệu mới.
- POST /api/ho-so/anh-dai-dien: nhận một file (multipart). Sai loại hoặc quá 2MB trả 400 hoặc 413.
- POST /api/ho-so/doi-mat-khau: nhận mat_khau_hien_tai, mat_khau_moi, xac_nhan.

## 5.6 Bảng dữ liệu dùng
- nguoi_dung: ho_ten, gmail, so_dien_thoai, anh_dai_dien (đường dẫn tương đối tính từ luu_tru, ví dụ anh_dai_dien/<uuid>.png; trang lấy ảnh qua GET /api/anh/anh_dai_dien/<tên file>), mat_khau_da_bam.
- hoc_vien: nghe_nghiep, ngay_sinh. don_hang (đếm đơn của học viên).
- khoa_hoc (đếm khóa của người cung cấp, kể cả da_xoa = 1).
- quan_tri_vien: so_cccd, ngay_cap_cccd, noi_cap_cccd, so_hop_dong, ngay_bat_dau_lam.

## 5.7 Câu thông báo
- "Họ tên từ 2 đến 100 ký tự, chỉ gồm chữ và dấu cách"
- "Số điện thoại gồm 10 chữ số, bắt đầu bằng số 0"
- "Vui lòng nhập Gmail", "Gmail phải có đuôi @gmail.com", "Gmail không đúng định dạng. Ví dụ: ten@gmail.com", "Gmail này đã được sử dụng"
- "Ngày sinh không hợp lệ"
- "Nghề nghiệp tối đa 100 ký tự"
- Học viên đã có đơn xóa trống: "Bạn đã có đơn hàng nên cần giữ họ tên và số điện thoại."
- "Ảnh phải là jpg hoặc png, tối đa 2MB"
- "Đã cập nhật thông tin"
- "Vui lòng nhập mật khẩu" (ô mật khẩu hiện tại, mật khẩu mới để trống), "Vui lòng nhập lại mật khẩu" (ô xác nhận mật khẩu mới để trống), "Mật khẩu phải gồm đúng 6 chữ số", "Mật khẩu nhập lại không khớp", "Mật khẩu hiện tại không đúng", "Mật khẩu mới trùng với mật khẩu cũ, vui lòng nhập mật khẩu khác", "Đã đổi mật khẩu"
- "Đã đăng khóa học nên không đổi được họ tên và số điện thoại."

## 5.8 Kiểm tra khi làm xong
- Bấm từng mục ở menu trái cuộn đúng chỗ; mở /ho-so#doi-mat-khau tự cuộn tới.
- Học viên có đơn hàng xóa trống số điện thoại thì bị báo lỗi; học viên chưa có đơn thì xóa được.
- Người cung cấp sau khi đăng một khóa thì ô họ tên, số điện thoại bị mờ; gửi thẳng lên máy chủ cũng bị từ chối.
- Admin thấy thông tin hợp đồng; học viên và người cung cấp gọi API hồ sơ không thấy phần hợp đồng.
- Danh sách kiểm thử đầy đủ: docs/kiem_thu/phan_05_ho_so.md
