# Danh sách kiểm thử Phần 2. Đăng ký tài khoản

- Đặc tả: docs/dac_ta/phan_02_dang_ky.md
- Code kiểm thử tự động: backend/tests/phan_02_dang_ky.test.js
- Cách kiểm: "Tự động" là Claude Code viết code kiểm thử và chạy bằng npm test; "Bấm tay" là người dùng mở web và làm theo các bước.
- Dữ liệu chung: database ava_test do npm test tạo lại. Mọi yêu cầu POST gửi kèm tiêu đề Origin hợp lệ (trừ P02-16).

## P02-01 Đăng ký học viên hợp lệ
- Mục tiêu: tạo đúng tài khoản học viên.
- Dữ liệu: ten_dang_nhap "An01", gmail "an01@gmail.com", mat_khau "123456", xac_nhan_mat_khau "123456", vai_tro 2, dong_y true.
- Các bước: gọi POST /api/tai-khoan/dang-ky.
- Kết quả mong đợi: 201; có một dòng nguoi_dung với ten_dang_nhap "An01", vai_tro 2, khoa 0, ma_gioi_thieu đúng 8 ký tự A-Z, 0-9, ho_ten, so_dien_thoai, anh_dai_dien trống; mat_khau_da_bam không phải "123456" và so khớp được bằng bcrypt; đúng một dòng hoc_vien trỏ về người này với dia_chi_ip trống; không có dòng nguoi_cung_cap.
- Cách kiểm: Tự động
- Nguồn: Phần 2 mục 2.5, 2.6, 2.8

## P02-02 Đăng ký người cung cấp hợp lệ
- Mục tiêu: tạo đúng tài khoản người cung cấp.
- Dữ liệu: "Binh02", "binh02@gmail.com", "654321", "654321", vai_tro 3, dong_y true.
- Các bước: gọi POST /api/tai-khoan/dang-ky.
- Kết quả mong đợi: 201; dòng nguoi_dung vai_tro 3; đúng một dòng nguoi_cung_cap với ten_ngan_hang, so_tai_khoan, chu_tai_khoan trống; không có dòng hoc_vien.
- Cách kiểm: Tự động
- Nguồn: Phần 2 mục 2.5, 2.6

## P02-03 Mã giới thiệu không trùng
- Mục tiêu: mỗi tài khoản có mã giới thiệu riêng.
- Dữ liệu: đăng ký liên tiếp 5 tài khoản hợp lệ.
- Các bước: gọi POST /api/tai-khoan/dang-ky 5 lần với tên và Gmail khác nhau.
- Kết quả mong đợi: 5 mã giới thiệu khác nhau, đều đúng mẫu ^[A-Z0-9]{8}$.
- Cách kiểm: Tự động
- Nguồn: Phần 2 mục 2.5

## P02-04 Trùng tên đăng nhập không phân biệt hoa thường
- Mục tiêu: "an01" bị coi là trùng với "An01".
- Dữ liệu: đã có "An01" (P02-01).
- Các bước: đăng ký "an01" với Gmail khác.
- Kết quả mong đợi: 409, cac_o.ten_dang_nhap = "Tên đăng nhập đã được sử dụng"; không thêm dòng nào.
- Cách kiểm: Tự động
- Nguồn: Phần 2 mục 2.4, 2.5, 2.7, 2.8

## P02-05 Gmail lưu chữ thường và trùng không phân biệt hoa thường
- Mục tiêu: Gmail lưu chữ thường, so trùng không phân biệt hoa thường.
- Dữ liệu: đăng ký với gmail "Abc@GMAIL.com"; sau đó đăng ký tài khoản khác với "abc@gmail.com".
- Các bước: gọi POST /api/tai-khoan/dang-ky hai lần.
- Kết quả mong đợi: lần một 201, cột gmail lưu "abc@gmail.com"; lần hai 409, cac_o.gmail = "Gmail này đã được sử dụng".
- Cách kiểm: Tự động
- Nguồn: Phần 2 mục 2.4, 2.7, 2.8

## P02-06 Tên đăng nhập lưu đúng như người dùng gõ
- Mục tiêu: không đổi chữ hoa thường của tên đăng nhập.
- Dữ liệu: "NguyenAn".
- Các bước: đăng ký rồi đọc dòng nguoi_dung.
- Kết quả mong đợi: ten_dang_nhap là "NguyenAn".
- Cách kiểm: Tự động
- Nguồn: Phần 2 mục 2.4

## P02-07 Để trống các ô bắt buộc
- Mục tiêu: báo lỗi đúng từng ô.
- Dữ liệu: gửi rỗng tất cả các ô (không gửi vai_tro).
- Các bước: gọi POST /api/tai-khoan/dang-ky.
- Kết quả mong đợi: 400; cac_o có "Vui lòng nhập tên đăng nhập", "Vui lòng nhập Gmail", "Vui lòng nhập mật khẩu", "Vui lòng nhập lại mật khẩu", "Vui lòng chọn vai trò", "Vui lòng đồng ý với Chính sách và điều khoản" ở đúng ô; không thêm dòng nào.
- Cách kiểm: Tự động
- Nguồn: Phần 2 mục 2.5, 2.7

## P02-08 Tên đăng nhập sai định dạng
- Mục tiêu: chỉ nhận 4 đến 30 chữ không dấu và số.
- Dữ liệu: lần lượt "abc", chuỗi 31 ký tự "a", "an 01", "an_01", "ân01", "an@01".
- Các bước: gọi POST /api/tai-khoan/dang-ky với từng giá trị, các ô khác hợp lệ.
- Kết quả mong đợi: mỗi lần 400, cac_o.ten_dang_nhap = "Tên đăng nhập chỉ gồm chữ không dấu và số, không có khoảng trắng, dấu hay ký tự đặc biệt (4 đến 30 ký tự)". Biên đúng: "abcd" (4 ký tự) và 30 ký tự được nhận.
- Cách kiểm: Tự động
- Nguồn: Phần 2 mục 2.4, 2.7

## P02-09 Gmail sai đuôi và sai phần trước @
- Mục tiêu: hai câu lỗi khác nhau cho hai kiểu sai.
- Dữ liệu: "an01@yahoo.com", "an01"; sau đó ".an01@gmail.com", "an..01@gmail.com", "an_01@gmail.com".
- Các bước: gọi POST /api/tai-khoan/dang-ky với từng giá trị.
- Kết quả mong đợi: hai giá trị đầu báo "Gmail phải có đuôi @gmail.com"; ba giá trị sau báo "Gmail không đúng định dạng. Ví dụ: ten@gmail.com"; đều 400.
- Cách kiểm: Tự động
- Nguồn: Phần 2 mục 2.4, 2.7; ràng buộc ck_nguoi_dung_gmail

## P02-10 Mật khẩu sai định dạng và không khớp
- Mục tiêu: mật khẩu đúng 6 chữ số, hai ô phải giống nhau.
- Dữ liệu: mat_khau "12345", "1234567", "12345a"; sau đó mat_khau "123456", xac_nhan "123457".
- Các bước: gọi POST /api/tai-khoan/dang-ky với từng bộ.
- Kết quả mong đợi: ba bộ đầu báo "Mật khẩu phải gồm đúng 6 chữ số"; bộ cuối báo "Mật khẩu nhập lại không khớp" ở ô xác nhận; đều 400.
- Cách kiểm: Tự động
- Nguồn: Phần 2 mục 2.4, 2.7

## P02-11 Không tích ô đồng ý
- Mục tiêu: chưa đồng ý thì không tạo tài khoản.
- Dữ liệu: các ô hợp lệ, dong_y false.
- Các bước: gọi POST /api/tai-khoan/dang-ky.
- Kết quả mong đợi: 400, báo "Vui lòng đồng ý với Chính sách và điều khoản"; không thêm dòng nào.
- Cách kiểm: Tự động
- Nguồn: Phần 2 mục 2.4, 2.7, 2.8

## P02-12 Không đăng ký được admin hoặc vai trò lạ
- Mục tiêu: chỉ nhận vai_tro 2 hoặc 3.
- Dữ liệu: vai_tro 1; vai_tro 4.
- Các bước: gửi thẳng lên máy chủ.
- Kết quả mong đợi: 400, không thêm dòng nào, không có admin mới.
- Cách kiểm: Tự động
- Nguồn: Phần 2 mục 2.1, 2.4, 2.8

## P02-13 Người đã đăng nhập không đăng ký được
- Mục tiêu: đường đăng ký chỉ dành cho người chưa đăng nhập.
- Dữ liệu: học viên đã có phiên.
- Các bước: gọi POST /api/tai-khoan/dang-ky kèm cookie phiên với dữ liệu hợp lệ mới.
- Kết quả mong đợi: bị từ chối, không thêm dòng nào.
- Cách kiểm: Tự động
- Nguồn: Phần 2 mục 2.5

## P02-14 Gom nhiều lỗi cùng lúc
- Mục tiêu: máy chủ trả lỗi của mọi ô sai trong một lần.
- Dữ liệu: tên "ab", Gmail "x@yahoo.com", mật khẩu "1", không chọn vai trò.
- Các bước: gọi POST /api/tai-khoan/dang-ky.
- Kết quả mong đợi: 400, cac_o có đủ lỗi của bốn ô ten_dang_nhap, gmail, mat_khau, vai_tro.
- Cách kiểm: Tự động
- Nguồn: Phần 2 mục 2.5

## P02-15 Ô mật khẩu và mặc định của trang
- Mục tiêu: trang đăng ký lúc mới mở đúng đặc tả.
- Dữ liệu: khách.
- Các bước: mở /dang-ky; gõ chữ cái vào ô mật khẩu.
- Kết quả mong đợi: ô đồng ý KHÔNG được tích sẵn, vai trò chưa chọn; ô mật khẩu chỉ nhận chữ số và hiện dấu chấm; chữ "Chính sách và điều khoản" mở /chinh-sach ở thẻ mới; không có chân trang; giao diện giống thiet_ke/dang_ky/dang_ky.html.
- Cách kiểm: Bấm tay
- Nguồn: Phần 2 mục 2.3

## P02-16 Thiếu tiêu đề Origin
- Mục tiêu: thao tác ghi dữ liệu từ trang lạ bị chặn.
- Dữ liệu: dữ liệu hợp lệ, không gửi tiêu đề Origin (hoặc Origin "http://trang-la.vn").
- Các bước: gọi POST /api/tai-khoan/dang-ky.
- Kết quả mong đợi: 403, không thêm dòng nào.
- Cách kiểm: Tự động
- Nguồn: Phần chung C6

## P02-17 Trang báo lỗi trước khi gửi
- Mục tiêu: trang kiểm tra trước, ô sai hiện chữ đỏ ngay dưới ô và chưa gửi lên máy chủ.
- Dữ liệu: để trống mọi ô; sau đó nhập sai định dạng như P02-08 đến P02-10.
- Các bước: bấm "Đăng ký".
- Kết quả mong đợi: chữ đỏ dưới đúng ô như màn thiet_ke/dang_ky/dang_ky_de_trong.html và dang_ky_sai_dinh_dang.html; tab Network của Chrome không có yêu cầu gửi đi.
- Cách kiểm: Bấm tay
- Nguồn: Phần 2 mục 2.3, 2.7

## P02-18 Trùng tên và Gmail hiện trên trang
- Mục tiêu: lỗi trùng do máy chủ trả hiện dưới đúng ô.
- Dữ liệu: đã có "An01" và "an01@gmail.com".
- Các bước: đăng ký "an01" và "AN01@gmail.com".
- Kết quả mong đợi: dưới ô tên "Tên đăng nhập đã được sử dụng", dưới ô Gmail "Gmail này đã được sử dụng", như thiet_ke/dang_ky/dang_ky_da_ton_tai.html.
- Cách kiểm: Bấm tay
- Nguồn: Phần 2 mục 2.7

## P02-19 Đăng ký thành công
- Mục tiêu: sau khi đăng ký chuyển sang đăng nhập, không tự đăng nhập.
- Dữ liệu: dữ liệu hợp lệ mới.
- Các bước: điền đủ rồi bấm "Đăng ký".
- Kết quả mong đợi: chuyển sang /dang-nhap, ô thông báo nhỏ "Đăng ký thành công, vui lòng đăng nhập."; chưa đăng nhập; không có email nào được gửi.
- Cách kiểm: Bấm tay
- Nguồn: Phần 2 mục 2.3, 2.7

## P02-20 Người đã đăng nhập mở trang đăng ký
- Mục tiêu: về trang chủ.
- Dữ liệu: học viên đã đăng nhập.
- Các bước: mở /dang-ky.
- Kết quả mong đợi: về trang chủ.
- Cách kiểm: Bấm tay
- Nguồn: Phần 2 mục 2.1
