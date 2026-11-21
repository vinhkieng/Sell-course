# PHẦN 2. ĐĂNG KÝ TÀI KHOẢN

Làm sau Phần 1.

## 2.1 Mục đích và ai dùng
- Khách tạo tài khoản học viên hoặc người cung cấp. Không đăng ký được admin. Người đã đăng nhập mở trang đăng ký thì về trang chủ.

## 2.2 Màn thiết kế
- thiet_ke/dang_ky/dang_ky.html (màn "Đăng ký"): trang đăng ký lúc mới mở.
- thiet_ke/dang_ky/dang_ky_de_trong.html (màn "Đăng ký (để trống ô bắt buộc)"): bấm "Đăng ký" khi còn ô bắt buộc để trống.
- thiet_ke/dang_ky/dang_ky_sai_dinh_dang.html (màn "Đăng ký (sai định dạng)"): nhập sai định dạng.
- thiet_ke/dang_ky/dang_ky_da_ton_tai.html (màn "Đăng ký (tên và Gmail đã tồn tại)"): tên đăng nhập hoặc Gmail đã có người dùng.

## 2.3 Giao diện và hành vi
- Các ô: Tên đăng nhập, Gmail, Mật khẩu, Xác nhận mật khẩu, chọn vai trò (Học viên hoặc Người cung cấp khóa học), ô tích "Tôi đã đọc và đồng ý với Chính sách và điều khoản của AVA" (chữ "Chính sách và điều khoản" là liên kết mở /chinh-sach ở thẻ mới), nút "Đăng ký", liên kết sang đăng nhập.
- Khác thiết kế: ô tích đồng ý mặc định KHÔNG được tích (màn thiết kế đang vẽ tích sẵn, không làm theo chỗ đó). Vai trò mặc định chưa chọn.
- Ô mật khẩu chỉ cho gõ chữ số, hiện dấu chấm thay chữ số.
- Bấm "Đăng ký": trang kiểm tra trước từng ô theo quy tắc 2.4, ô nào sai thì hiện chữ đỏ ngay dưới ô đó và chưa gửi lên máy chủ. Hợp lệ thì gửi lên máy chủ; máy chủ kiểm tra lại toàn bộ.
- Thành công: chuyển sang /dang-nhap, hiện ô thông báo nhỏ "Đăng ký thành công, vui lòng đăng nhập." Không tự đăng nhập, không gửi email.

## 2.4 Quy tắc
- Tên đăng nhập: bắt buộc, 4 đến 30 ký tự, chỉ chữ cái không dấu và chữ số (không khoảng trắng, không dấu gạch dưới, không ký tự đặc biệt), chưa ai dùng. So trùng không phân biệt chữ hoa chữ thường ("An01" và "an01" là một). Lưu đúng như người dùng gõ. Không sửa được sau này.
- Gmail: bắt buộc, đúng định dạng và có đuôi @gmail.com (theo ràng buộc ck_nguoi_dung_gmail trong SQL), chưa có tài khoản nào dùng (so không phân biệt hoa thường). Lưu chữ thường.
- Mật khẩu: đúng 6 chữ số; ô xác nhận phải giống ô mật khẩu.
- Vai trò: bắt buộc chọn, chỉ nhận học viên (2) hoặc người cung cấp (3).
- Phải tích ô đồng ý.
- Họ tên, số điện thoại không nhập lúc đăng ký. Mỗi Gmail chỉ lập một tài khoản. Không có chức năng xóa tài khoản.

## 2.5 Đường xử lý ở máy chủ
POST /api/tai-khoan/dang-ky (chỉ khi chưa đăng nhập)
- Nhận: ten_dang_nhap, gmail, mat_khau, xac_nhan_mat_khau, vai_tro, dong_y.
- Kiểm tra theo 2.4; gom mọi lỗi theo từng ô và trả 400 kèm cac_o. Trùng tên đăng nhập hoặc trùng Gmail trả 409 kèm lỗi đúng ô.
- Hợp lệ, làm trong một giao dịch: băm mật khẩu bằng bcrypt; tạo mã giới thiệu 8 ký tự chữ in hoa và chữ số ngẫu nhiên, chưa trùng ai (trùng thì tạo lại); thêm dòng nguoi_dung; thêm dòng hoc_vien (nếu vai_tro = 2, dia_chi_ip để trống) hoặc nguoi_cung_cap (nếu vai_tro = 3, thông tin ngân hàng để trống).
- Trả 201.

## 2.6 Bảng dữ liệu dùng
- nguoi_dung: ten_dang_nhap, gmail, mat_khau_da_bam, vai_tro, ma_gioi_thieu (8 ký tự A-Z, 0-9, không trùng), khoa = 0. ho_ten, so_dien_thoai, anh_dai_dien để trống.
- hoc_vien (id_nguoi_dung) hoặc nguoi_cung_cap (id_nguoi_dung).

## 2.7 Câu thông báo
- Ô để trống: "Vui lòng nhập tên đăng nhập", "Vui lòng nhập Gmail", "Vui lòng nhập mật khẩu", "Vui lòng nhập lại mật khẩu", "Vui lòng chọn vai trò".
- Sai định dạng: "Tên đăng nhập chỉ gồm chữ không dấu và số, không có khoảng trắng, dấu hay ký tự đặc biệt (4 đến 30 ký tự)"; Gmail không có đuôi @gmail.com: "Gmail phải có đuôi @gmail.com"; Gmail có đuôi đúng nhưng phần trước @ sai: "Gmail không đúng định dạng. Ví dụ: ten@gmail.com"; "Mật khẩu phải gồm đúng 6 chữ số"; "Mật khẩu nhập lại không khớp".
- Trùng: "Tên đăng nhập đã được sử dụng", "Gmail này đã được sử dụng".
- Chưa tích ô đồng ý: "Vui lòng đồng ý với Chính sách và điều khoản".
- Thành công: "Đăng ký thành công, vui lòng đăng nhập."

## 2.8 Kiểm tra khi làm xong
- Đăng ký "An01" xong, đăng ký tiếp "an01" bị báo trùng. Gmail "Abc@GMAIL.com" lưu thành chữ thường; đăng ký lại "abc@gmail.com" bị báo trùng.
- Bỏ tích ô đồng ý thì bị báo lỗi. Gửi thẳng vai_tro = 1 lên máy chủ thì bị từ chối.
- Sau khi đăng ký: có một dòng nguoi_dung với mã giới thiệu 8 ký tự và đúng một dòng hoc_vien hoặc nguoi_cung_cap.
- Danh sách kiểm thử đầy đủ: docs/kiem_thu/phan_02_dang_ky.md
