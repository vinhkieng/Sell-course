# Danh sách kiểm thử Phần 21. Quản trị người dùng

- Đặc tả: docs/dac_ta/phan_21_quan_tri_nguoi_dung.md
- Code kiểm thử tự động: backend/tests/phan_21_quan_tri_nguoi_dung.test.js
- Cách kiểm: "Tự động" là Claude Code viết code kiểm thử và chạy bằng npm test; "Bấm tay" là người dùng mở web và làm theo các bước.
- Dữ liệu chung: admin kiểm thử và admin thứ hai; học viên "hv01" (đã mua K1, có đánh giá ở K1, 2 phiếu báo cáo chờ và 1 phiếu đã xử lý do hv01 gửi, 1 phiếu chờ người khác báo cáo đánh giá của hv01); người cung cấp "ncc01" có K1 'Đang bán' chưa từng bị ẩn, K2 'Đang bán' đã bị admin ẩn một lần rồi đăng lại, K3 'Tự ẩn', K4 'Bị gỡ vĩnh viễn', một yêu cầu rút 'Chờ duyệt' 500.000.

## P21-01 Danh sách, tìm kiếm, lọc
- Mục tiêu: tìm chứa chữ không phân biệt hoa thường; lọc vai trò; mới tạo ở trên; 20 dòng mỗi trang.
- Dữ liệu: dữ liệu chung.
- Các bước: gọi GET /api/quan-tri/nguoi-dung với tu_khoa "HV0"; tu_khoa "gmail.com"; vai_tro hoc-vien, nguoi-cung-cap, admin.
- Kết quả mong đợi: kết quả đúng; mỗi dòng có tên đăng nhập, họ tên, Gmail, vai trò, trạng thái, lý do khóa nếu có.
- Cách kiểm: Tự động
- Nguồn: Phần 21 mục 21.3, 21.6

## P21-02 Khóa học viên
- Mục tiêu: khóa tài khoản và các hệ quả.
- Dữ liệu: hv01 đang có phiên.
- Các bước: admin gọi POST /api/quan-tri/nguoi-dung/<hv01>/khoa với ly_do "Dùng chung tài khoản"; hv01 gọi GET /api/tai-khoan/toi bằng phiên cũ; đọc trang khóa K1.
- Kết quả mong đợi: khoa 1, ly_do_khoa đúng, id_quan_tri_vien là admin; phiên cũ nhận 401 TAI_KHOAN_BI_KHOA; hv01 không còn quyền học K1; đánh giá của hv01 không còn hiện, cột bi_an vẫn 0; 2 phiếu chờ do hv01 gửi và phiếu chờ báo cáo đánh giá của hv01 bị xóa; phiếu đã xử lý còn lại.
- Cách kiểm: Tự động
- Nguồn: Phần 21 mục 21.4, 21.9

## P21-03 Khóa người cung cấp
- Mục tiêu: ẩn, gỡ, từ chối rút tiền, thông báo đúng.
- Dữ liệu: ncc01; K1 có phiếu báo cáo chờ; K2 có phiếu báo cáo chờ.
- Các bước: admin khóa ncc01 với lý do "Vi phạm bản quyền".
- Kết quả mong đợi: K1 'Bị ẩn', 'Hệ thống - khóa tài khoản', ly_do_an "Tài khoản bị khóa", lịch sử 'Hệ thống ẩn do khóa tài khoản', phiếu chờ của K1 giữ nguyên "Chưa xử lý"; K2 'Bị gỡ vĩnh viễn' với lý do "Khóa học bị ẩn lần thứ 2 nên bị gỡ vĩnh viễn", lịch sử 'Hệ thống ẩn do khóa tài khoản' rồi 'Hệ thống gỡ vĩnh viễn', mọi bài khong_chan_ma_bam 1, phiếu chờ của K2 thành 'Gỡ vĩnh viễn'; K3, K4 giữ nguyên; yêu cầu rút 'Từ chối', ly_do_tu_choi "Tài khoản bị khóa", có ngay_xu_ly; đúng 3 thông báo (ẩn K1, gỡ K2, từ chối rút tiền); mọi dòng lịch sử có id_nguoi_dung là admin; học viên đã mua K1 thấy "không khả dụng".
- Cách kiểm: Tự động
- Nguồn: Phần 21 mục 21.4, 21.9; Phần 18 mục 18.4

## P21-04 Mở khóa người cung cấp
- Mục tiêu: khóa bị hệ thống ẩn bán lại, khóa khác giữ nguyên, lần ẩn vẫn tính.
- Dữ liệu: sau P21-03.
- Các bước: admin gọi POST /api/quan-tri/nguoi-dung/<ncc01>/mo-khoa; admin ẩn K1 (Phần 19).
- Kết quả mong đợi: khoa 0, ly_do_khoa và id_quan_tri_vien NULL; K1 'Đang bán', lịch sử 'Hệ thống bán lại do mở khóa tài khoản' với id_nguoi_dung là admin mở khóa; K2 vẫn gỡ; K3 vẫn tự ẩn; không có thông báo mới; yêu cầu rút cũ vẫn 'Từ chối'; ẩn K1 sau đó làm K1 bị gỡ ngay (lần thứ hai).
- Cách kiểm: Tự động
- Nguồn: Phần 21 mục 21.5, 21.9

## P21-05 Mở khóa học viên
- Mục tiêu: học lại được, đánh giá hiện lại, phiếu đã xóa không quay lại.
- Dữ liệu: sau P21-02.
- Các bước: mở khóa hv01; hv01 đăng nhập; đọc trang K1.
- Kết quả mong đợi: đăng nhập được; học được K1, tiến độ còn; đánh giá hiện lại; các phiếu đã xóa không quay lại.
- Cách kiểm: Tự động
- Nguồn: Phần 21 mục 21.4, 21.5

## P21-06 Không khóa được admin
- Mục tiêu: từ chối 403, kể cả chính mình.
- Dữ liệu: admin thứ hai; chính admin đang đăng nhập.
- Các bước: gọi POST .../khoa với từng id.
- Kết quả mong đợi: 403, không đổi gì.
- Cách kiểm: Tự động
- Nguồn: Phần 21 mục 21.4, 21.9; Phần chung C6

## P21-07 Lý do khóa và trạng thái sai
- Mục tiêu: lý do 5 đến 255 ký tự; khóa hai lần hoặc mở khi chưa khóa trả 409.
- Dữ liệu: ly_do "abc"; ly_do 256 ký tự; khóa người đã bị khóa; mở người chưa bị khóa.
- Các bước: gọi các đường khóa và mở khóa.
- Kết quả mong đợi: hai lý do sai báo "Lý do từ 5 đến 255 ký tự."; hai trường hợp sau 409.
- Cách kiểm: Tự động
- Nguồn: Phần 21 mục 21.3, 21.6, 21.8

## P21-08 Phân quyền
- Mục tiêu: chỉ admin.
- Dữ liệu: học viên, người cung cấp, khách.
- Các bước: gọi GET /api/quan-tri/nguoi-dung và POST .../khoa.
- Kết quả mong đợi: 403 hoặc 401 tương ứng.
- Cách kiểm: Tự động
- Nguồn: Phần 21 mục 21.6

## P21-09 Trang quản trị người dùng
- Mục tiêu: giao diện đúng thiết kế.
- Dữ liệu: dữ liệu chung.
- Các bước: mở /quan-tri/nguoi-dung; tìm và lọc; bấm "Khóa", bấm các nút chọn nhanh và "Khác"; gửi lý do 3 ký tự; gửi đúng; bấm "Mở khóa".
- Kết quả mong đợi: ô tìm "Tìm theo tên đăng nhập hoặc Gmail", bộ lọc "Vai trò:"; trạng thái "Hoạt động" hoặc "Bị khóa" kèm "Lý do: [lý do]"; dòng admin hiện "-"; "Hiển thị 1-20 trên N người dùng (20 dòng mỗi trang)"; hộp "Khóa tài khoản này?" với ô "Lý do *", nút chọn nhanh điền chữ vào ô, "Khác" xóa trắng ô; lỗi "Lý do từ 5 đến 255 ký tự."; "Đã khóa tài khoản"; hộp "Mở khóa tài khoản này?" có "Lý do đã khóa: [lý do]"; "Đã mở khóa tài khoản"; giống thiet_ke/quan_tri_nguoi_dung/.
- Cách kiểm: Bấm tay
- Nguồn: Phần 21 mục 21.3, 21.8

## P21-10 Người bị khóa đang dùng web
- Mục tiêu: bị đẩy ra ở lần bấm kế tiếp, kể cả ở trang công khai.
- Dữ liệu: học viên đang mở trang chủ ở một trình duyệt; admin khóa người đó ở trình duyệt khác.
- Các bước: học viên bấm sang trang khác.
- Kết quả mong đợi: về trang đăng nhập với câu "Tài khoản đã bị khóa. Lý do: [lý do]. Liên hệ hỗ trợ nếu bạn cho rằng có nhầm lẫn."
- Cách kiểm: Bấm tay
- Nguồn: Phần 21 mục 21.4, 21.9
