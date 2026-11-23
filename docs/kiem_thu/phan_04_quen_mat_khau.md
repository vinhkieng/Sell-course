# Danh sách kiểm thử Phần 4. Quên mật khẩu

- Đặc tả: docs/dac_ta/phan_04_quen_mat_khau.md
- Code kiểm thử tự động: backend/tests/phan_04_quen_mat_khau.test.js
- Cách kiểm: "Tự động" là Claude Code viết code kiểm thử và chạy bằng npm test; "Bấm tay" là người dùng mở web và làm theo các bước.
- Dữ liệu chung: học viên "hv01" (gmail "hv01@gmail.com", mật khẩu "123456", khoa 0); học viên "hvkhoa" (gmail "hvkhoa@gmail.com", khoa 1). Email dùng hộp thư giả.

## P04-01 Gmail có tài khoản đang hoạt động
- Mục tiêu: tạo mã và gửi email.
- Dữ liệu: "hv01@gmail.com".
- Các bước: gọi POST /api/tai-khoan/quen-mat-khau.
- Kết quả mong đợi: 200 với câu "Nếu Gmail này đã đăng ký, mã xác nhận đã được gửi. Vui lòng kiểm tra hộp thư."; có một dòng ma_dat_lai_mat_khau mới (so_lan_sai 0, da_dung 0, ma_6_so_da_bam không phải mã thô); hộp thư giả có thư tới hv01@gmail.com, tiêu đề "Mã đặt lại mật khẩu AVA", nội dung đúng câu ở mục 4.4 kèm mã 6 chữ số.
- Cách kiểm: Tự động
- Nguồn: Phần 4 mục 4.4, 4.5

## P04-02 Gmail không có tài khoản
- Mục tiêu: trả cùng một câu, không gửi gì.
- Dữ liệu: "khongcoai@gmail.com".
- Các bước: gọi POST /api/tai-khoan/quen-mat-khau.
- Kết quả mong đợi: 200, cùng câu như P04-01; không thêm dòng mã; không có thư.
- Cách kiểm: Tự động
- Nguồn: Phần 4 mục 4.4, 4.8

## P04-03 Gmail của tài khoản bị khóa
- Mục tiêu: không tạo mã, không gửi.
- Dữ liệu: "hvkhoa@gmail.com".
- Các bước: gọi POST /api/tai-khoan/quen-mat-khau.
- Kết quả mong đợi: 200, cùng câu; không thêm dòng mã; không có thư; tài khoản bị khóa sau khi đã nhận mã thì đặt lại báo "Mã xác nhận không đúng hoặc đã hết hạn", mật khẩu giữ nguyên.
- Cách kiểm: Tự động
- Nguồn: Phần 4 mục 4.4, 4.8

## P04-04 Gmail sai định dạng
- Mục tiêu: báo lỗi định dạng.
- Dữ liệu: "hv01"; "hv01@yahoo.com"; "hv..01@gmail.com".
- Các bước: gọi POST /api/tai-khoan/quen-mat-khau.
- Kết quả mong đợi: 400 với "Gmail không đúng định dạng. Ví dụ: ten@gmail.com".
- Cách kiểm: Tự động
- Nguồn: Phần 4 mục 4.3, 4.5, 4.7

## P04-05 Bấm "Gửi mã" lần hai trong 60 giây
- Mục tiêu: chưa đủ 60 giây thì không gửi thêm nhưng vẫn trả câu như thường.
- Dữ liệu: vừa làm P04-01.
- Các bước: gọi lại POST /api/tai-khoan/quen-mat-khau ngay.
- Kết quả mong đợi: 200 cùng câu; không thêm dòng mã; không có thư mới.
- Cách kiểm: Tự động
- Nguồn: Phần 4 mục 4.5

## P04-06 Đặt lại mật khẩu thành công
- Mục tiêu: lưu mật khẩu mới, mã chỉ dùng một lần.
- Dữ liệu: mã lấy trong hộp thư giả; mật khẩu mới "654321".
- Các bước: gọi POST /api/tai-khoan/dat-lai-mat-khau với gmail, ma, "654321", "654321"; đăng nhập bằng "654321"; đăng nhập bằng "123456"; gọi đặt lại lần nữa với cùng mã.
- Kết quả mong đợi: 200; da_dung = 1; đăng nhập bằng mật khẩu mới được, mật khẩu cũ báo sai; lần dùng lại mã báo "Mã xác nhận không đúng hoặc đã hết hạn".
- Cách kiểm: Tự động
- Nguồn: Phần 4 mục 4.4, 4.5, 4.8

## P04-07 Mật khẩu mới sai định dạng hoặc không khớp
- Mục tiêu: kiểm mật khẩu mới trước khi xét mã.
- Dữ liệu: mã đúng; mật khẩu "12345"; sau đó "654321" và "654320".
- Các bước: gọi POST /api/tai-khoan/dat-lai-mat-khau.
- Kết quả mong đợi: 400 "Mật khẩu phải gồm đúng 6 chữ số"; 400 "Mật khẩu nhập lại không khớp"; so_lan_sai của mã không tăng.
- Cách kiểm: Tự động
- Nguồn: Phần 4 mục 4.4, 4.5, 4.7

## P04-08 Mã sai và sai đủ 5 lần
- Mục tiêu: sai 5 lần thì mã bị hủy.
- Dữ liệu: một mã mới.
- Các bước: gửi mã sai 5 lần; rồi gửi mã đúng.
- Kết quả mong đợi: lần 1 đến 4 báo "Mã xác nhận không đúng hoặc đã hết hạn", so_lan_sai tăng dần; lần 5 báo "Bạn đã nhập sai quá nhiều lần, vui lòng gửi lại mã mới" và da_dung = 1; mã đúng sau đó báo "Mã xác nhận không đúng hoặc đã hết hạn".
- Cách kiểm: Tự động
- Nguồn: Phần 4 mục 4.4, 4.5, 4.7

## P04-09 Mã quá 10 phút
- Mục tiêu: mã hết hạn.
- Dữ liệu: một mã mới; sửa thoi_diem_gui lùi 11 phút.
- Các bước: đặt lại bằng mã đúng.
- Kết quả mong đợi: "Mã xác nhận không đúng hoặc đã hết hạn"; mật khẩu không đổi.
- Cách kiểm: Tự động
- Nguồn: Phần 4 mục 4.4, 4.8

## P04-10 Gửi lại mã
- Mục tiêu: chờ 60 giây; mã mới làm mã cũ hết hiệu lực.
- Dữ liệu: một mã vừa gửi.
- Các bước: gọi POST /api/tai-khoan/gui-lai-ma-dat-lai ngay; lùi thoi_diem_gui 61 giây rồi gọi lại; đặt lại bằng mã cũ; đặt lại bằng mã mới.
- Kết quả mong đợi: lần đầu 429 kèm số giây còn lại; lần sau 200, có thư mới, mã cũ bị hủy (da_dung = 1 hoặc bị xóa); mã cũ báo "Mã xác nhận không đúng hoặc đã hết hạn"; mã mới đặt lại được.
- Cách kiểm: Tự động
- Nguồn: Phần 4 mục 4.4, 4.5, 4.8

## P04-11 Gửi lại mã với Gmail không có tài khoản
- Mục tiêu: không lộ Gmail.
- Dữ liệu: "khongcoai@gmail.com", gọi hai lần liên tiếp.
- Các bước: gọi POST /api/tai-khoan/gui-lai-ma-dat-lai.
- Kết quả mong đợi: cả hai lần 200, không có thư.
- Cách kiểm: Tự động
- Nguồn: Phần 4 mục 4.5

## P04-12 Đặt lại mật khẩu gỡ tạm chặn đăng nhập
- Mục tiêu: xóa số lần sai và gỡ tạm chặn của tên đăng nhập.
- Dữ liệu: học viên "hv12" đã sai mật khẩu 5 lần (đang bị chặn 5 phút).
- Các bước: làm quên mật khẩu và đặt lại mật khẩu mới; đăng nhập bằng mật khẩu mới.
- Kết quả mong đợi: đăng nhập được ngay, không bị 429.
- Cách kiểm: Tự động
- Nguồn: Phần 4 mục 4.4; Phần 3 mục 3.8

## P04-13 Trang quên mật khẩu và đặt lại
- Mục tiêu: giao diện và luồng đúng thiết kế.
- Dữ liệu: Gmail thật của người kiểm (cần điền GMAIL_USER, GMAIL_APP_PASSWORD trong backend/.env).
- Các bước: mở /quen-mat-khau; gõ Gmail sai định dạng; gõ Gmail đúng rồi bấm "Gửi mã"; xem đếm ngược "Gửi lại mã"; nhập mã trong thư, mật khẩu mới rồi bấm "Đặt lại mật khẩu".
- Kết quả mong đợi: Gmail sai báo dưới ô, không gửi; gửi đúng thì sang /dat-lai-mat-khau với dòng "Nếu Gmail này đã đăng ký, mã xác nhận đã được gửi. Vui lòng kiểm tra hộp thư.", dòng "Gmail bạn đã nhập: [Gmail]" và liên kết "Nhập lại Gmail"; "Gửi lại mã" đếm ngược 60 giây; thành công thì về trang chủ với ô thông báo "Đặt lại mật khẩu thành công, vui lòng đăng nhập", chưa đăng nhập; hai trang không có chân trang.
- Cách kiểm: Bấm tay
- Nguồn: Phần 4 mục 4.3, 4.7
