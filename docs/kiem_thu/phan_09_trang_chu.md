# Danh sách kiểm thử Phần 9. Trang chủ

- Đặc tả: docs/dac_ta/phan_09_trang_chu.md
- Code kiểm thử tự động: backend/tests/phan_09_trang_chu.test.js
- Cách kiểm: "Tự động" là Claude Code viết code kiểm thử và chạy bằng npm test; "Bấm tay" là người dùng mở web và làm theo các bước.
- Dữ liệu chung (tạo thẳng trong database): 3 người cung cấp A, B, C (C bị khóa tài khoản); 6 khóa 'Đang bán' của A, B với số học viên khác nhau; 1 khóa 'Bị ẩn', 1 khóa 'Bị gỡ vĩnh viễn', 1 khóa đã xóa, 1 khóa 'Đang bán' của C; các đơn 'Đã thanh toán' tạo số học viên; một số đánh giá hợp lệ.

## P09-01 Ba con số
- Mục tiêu: đếm đúng ba con số.
- Dữ liệu: dữ liệu chung; thêm một học viên bị khóa có đơn 'Đã thanh toán'.
- Các bước: gọi GET /api/trang-chu.
- Kết quả mong đợi: số học viên = số học viên khác nhau có ít nhất một đơn 'Đã thanh toán', không tính người bị khóa; số khóa = số khóa 'Đang bán' chưa xóa; số người cung cấp = số người cung cấp không bị khóa có ít nhất một khóa 'Đang bán' (A, B là 2).
- Cách kiểm: Tự động
- Nguồn: Phần 9 mục 9.3

## P09-02 Chỉ hiện khóa hợp lệ
- Mục tiêu: không hiện khóa bị ẩn, bị gỡ, đã xóa hoặc của người cung cấp bị khóa.
- Dữ liệu: dữ liệu chung.
- Các bước: gọi GET /api/trang-chu, xem danh sách nổi bật và mới nhất.
- Kết quả mong đợi: không có khóa 'Bị ẩn', 'Bị gỡ vĩnh viễn', đã xóa, khóa của C.
- Cách kiểm: Tự động
- Nguồn: Phần 9 mục 9.4, 9.7

## P09-03 Khóa nổi bật theo số học viên
- Mục tiêu: 4 khóa nhiều học viên nhất; bằng nhau thì khóa mới hơn trước.
- Dữ liệu: 6 khóa có số học viên 5, 4, 3, 3, 1, 0; hai khóa 3 học viên có ngay_tao khác nhau.
- Các bước: gọi GET /api/trang-chu.
- Kết quả mong đợi: đúng 4 khóa theo thứ tự 5, 4, rồi khóa 3 học viên mới hơn, rồi khóa 3 học viên cũ hơn.
- Cách kiểm: Tự động
- Nguồn: Phần 9 mục 9.3

## P09-04 Số học viên của khóa
- Mục tiêu: học viên mua hai lần chỉ tính một; lượt đã hoàn tiền không tính.
- Dữ liệu: khóa X: học viên H1 có hai đơn 'Đã thanh toán' chứa X; H2 có một đơn 'Đã thanh toán' với da_hoan_tien 1; H3 có đơn 'Hết hạn'.
- Các bước: gọi GET /api/trang-chu, xem số học viên của X.
- Kết quả mong đợi: X có 1 học viên.
- Cách kiểm: Tự động
- Nguồn: Phần 9 mục 9.4, 9.7

## P09-05 Khóa mới nhất và nhãn "MỚI"
- Mục tiêu: 4 khóa có ngay_tao gần nhất; nhãn chỉ khi đăng trong 7 ngày.
- Dữ liệu: khóa đăng hôm nay, 3 ngày trước, 8 ngày trước, 20 ngày trước, 30 ngày trước.
- Các bước: gọi GET /api/trang-chu.
- Kết quả mong đợi: 4 khóa đầu theo ngày mới nhất, có ngày đăng; khóa hôm nay và 3 ngày có dấu là mới; khóa 8 ngày vẫn nằm trong danh sách nhưng không có nhãn mới.
- Cách kiểm: Tự động
- Nguồn: Phần 9 mục 9.3, 9.7

## P09-06 Dữ liệu thẻ khóa học
- Mục tiêu: thẻ có đủ dữ liệu đúng cách tính.
- Dữ liệu: khóa X có 5 bài, 1 bài đã xóa, 2 đánh giá hợp lệ 5 và 4 sao; khóa Y chưa có đánh giá.
- Các bước: gọi GET /api/trang-chu.
- Kết quả mong đợi: X có tên danh mục, tên khóa, họ tên người cung cấp, số bài 4, số học viên, điểm trung bình 4,5 và 2 lượt, giá; Y không có điểm (trang hiện "Chưa có đánh giá"). Đánh giá bị ẩn hoặc của lượt đã hoàn tiền không tính (Phần 16 mục 16.4).
- Cách kiểm: Tự động
- Nguồn: Phần 9 mục 9.3, 9.4

## P09-07 Sáu chuyên gia
- Mục tiêu: người cung cấp có tổng học viên nhiều nhất, không bị khóa, có khóa đang bán.
- Dữ liệu: A tổng 9 học viên, B tổng 7, C bị khóa có 20, D không có khóa đang bán có 15.
- Các bước: gọi GET /api/trang-chu.
- Kết quả mong đợi: danh sách A rồi B (chỉ 2 người vì không đủ 6), mỗi người có họ tên, ảnh hoặc chữ cái đầu, số học viên; không có C, D.
- Cách kiểm: Tự động
- Nguồn: Phần 9 mục 9.3

## P09-08 Danh mục ở trang chủ
- Mục tiêu: giống menu "Danh mục".
- Dữ liệu: dữ liệu chung.
- Các bước: gọi GET /api/trang-chu; so với GET /api/danh-muc/menu.
- Kết quả mong đợi: cùng danh sách và thứ tự.
- Cách kiểm: Tự động
- Nguồn: Phần 9 mục 9.3

## P09-09 Giao diện trang chủ
- Mục tiêu: giống thiết kế, đủ khối, liên kết đúng.
- Dữ liệu: dữ liệu chung.
- Các bước: mở /; bấm "Khám phá khóa học", một danh mục, hai nút "Xem tất cả", một thẻ khóa.
- Kết quả mong đợi: các khối như thiet_ke/trang_chu/trang_chu.html, không có khối "Học ở đây khác ở chỗ nào?" và "Câu hỏi thường gặp"; "Khám phá khóa học" mở /khoa-hoc; danh mục mở /khoa-hoc?danh_muc=<id>; "Xem tất cả" của nổi bật mở /khoa-hoc, của mới nhất mở /khoa-hoc?sap_xep=moi-nhat; thẻ mở /khoa-hoc/<id>; khóa không có ảnh bìa dùng ảnh mặc định; có chân trang chuẩn; hiển thị tốt ở 1280px, 768px, 375px.
- Cách kiểm: Bấm tay
- Nguồn: Phần 9 mục 9.3, 9.7; Phần chung C8
