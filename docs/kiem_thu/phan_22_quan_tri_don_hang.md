# Danh sách kiểm thử Phần 22. Quản trị đơn hàng và hoàn tiền

- Đặc tả: docs/dac_ta/phan_22_quan_tri_don_hang.md
- Code kiểm thử tự động: backend/tests/phan_22_quan_tri_don_hang.test.js
- Cách kiểm: "Tự động" là Claude Code viết code kiểm thử và chạy bằng npm test; "Bấm tay" là người dùng mở web và làm theo các bước.
- Dữ liệu chung: admin và admin thứ hai; học viên "hv01" có đơn Đ1 'Đã thanh toán' 2 khóa K1 ('Giới thiệu' 90, giá 299.000) và K2 ('Tự nhiên' 60, giá 450.000), thanh toán 1 ngày trước, có 2 dòng sổ (một 'Trình duyệt' 00, một 'Kiểm tra lại' 91); đơn Đ2 'Chờ thanh toán'; đơn Đ3 'Thất bại'; đơn Đ4 'Hết hạn'.

## P22-01 Danh sách và số đếm
- Mục tiêu: năm lựa chọn kèm số, mới nhất ở trên, 20 dòng mỗi trang.
- Dữ liệu: dữ liệu chung.
- Các bước: gọi GET /api/quan-tri/don-hang với từng trang_thai.
- Kết quả mong đợi: số đếm đúng từng trạng thái; mỗi dòng có mã đơn, học viên (tên đăng nhập, Gmail), ngày tạo, khóa đầu tiên kèm "+N khóa khác", tổng tiền, trạng thái.
- Cách kiểm: Tự động
- Nguồn: Phần 22 mục 22.3, 22.6

## P22-02 Tìm theo mã đơn, tên, Gmail
- Mục tiêu: mã đúng dạng tìm đúng một đơn; còn lại tìm chứa chữ.
- Dữ liệu: mã đơn của Đ1; "hv0"; "gmail.com".
- Các bước: gọi GET /api/quan-tri/don-hang?tu_khoa=...
- Kết quả mong đợi: mã đơn ra đúng Đ1; "hv0" ra các đơn của học viên có tên chứa "hv0"; "gmail.com" ra mọi đơn.
- Cách kiểm: Tự động
- Nguồn: Phần 22 mục 22.3, 22.9

## P22-03 Danh sách chạy câu chuyển hết hạn
- Mục tiêu: đơn chờ quá 30 phút thành 'Hết hạn' trước khi trả.
- Dữ liệu: Đ2 có ngay_tao lùi 31 phút.
- Các bước: gọi GET /api/quan-tri/don-hang.
- Kết quả mong đợi: Đ2 hiện 'Hết hạn'.
- Cách kiểm: Tự động
- Nguồn: Phần 22 mục 22.3; Phần 13 mục 13.9

## P22-04 Chi tiết đơn đã thanh toán
- Mục tiêu: đủ dữ liệu hộp chi tiết.
- Dữ liệu: Đ1.
- Các bước: gọi GET /api/quan-tri/don-hang/<Đ1>.
- Kết quả mong đợi: họ tên, Gmail, số điện thoại từ hồ sơ hiện tại; ghi chú (không có thì cờ không có ghi chú); K1 nguồn 'Giới thiệu', mức 90, người cung cấp nhận 269.100, AVA nhận 29.900; K2 'Tự nhiên', 60, 270.000 và 180.000; tổng tiền, ngày tạo, ngày thanh toán, mã giao dịch VNPay; lịch sử giao dịch 2 dòng mới nhất trên, kết quả "00 - Thành công" và "91 - Không tìm thấy giao dịch", nguồn theo chữ C11, ngân hàng từ vnp_BankCode hoặc "-".
- Cách kiểm: Tự động
- Nguồn: Phần 22 mục 22.4

## P22-05 Chi tiết đơn chưa thanh toán và dòng chữ ký sai
- Mục tiêu: bốn ô tiền hiện "-", không có hoàn tiền; dòng chữ ký sai có ghi chú.
- Dữ liệu: Đ3 có một dòng sổ chu_ky_hop_le 0 gắn đơn (nguồn 'Kiểm tra lại').
- Các bước: gọi GET /api/quan-tri/don-hang/<Đ3>.
- Kết quả mong đợi: không có số tiền chia, không cho hoàn tiền; ngày thanh toán "Chưa thanh toán", mã giao dịch "Chưa có"; dòng sổ có thêm "(chữ ký không hợp lệ)".
- Cách kiểm: Tự động
- Nguồn: Phần 22 mục 22.4

## P22-06 Hoàn tiền một khóa
- Mục tiêu: chỉ khóa đó đổi; các hệ quả tự có.
- Dữ liệu: dòng chi tiết K1 của Đ1.
- Các bước: gọi POST /api/quan-tri/chi-tiet-don-hang/<id>/hoan-tien; đọc lại hộp chi tiết; hv01 đọc trang K1, K2; ví của người cung cấp K1.
- Kết quả mong đợi: da_hoan_tien 1, id_quan_tri_vien là admin; K1 nhận "0đ (Đã hoàn tiền)" cho người cung cấp và AVA nhận 0đ; hv01 mất quyền học K1, còn học được K2; đánh giá của hv01 ở K1 không còn hiện; ví người cung cấp K1 tính lượt này 0.
- Cách kiểm: Tự động
- Nguồn: Phần 22 mục 22.4, 22.5, 22.9

## P22-07 Hoàn tiền bị từ chối
- Mục tiêu: các điều kiện ở 22.5.
- Dữ liệu: K1 đã hoàn (P22-06); K2 với thời điểm thanh toán lùi 8 ngày; một dòng của đơn Đ3 'Thất bại'.
- Các bước: gọi POST .../hoan-tien cho từng dòng.
- Kết quả mong đợi: K1 409 "Khóa học này đã được hoàn tiền."; K2 409 "Đã quá 7 ngày, không hoàn tiền được."; dòng của Đ3 bị từ chối; không đổi gì.
- Cách kiểm: Tự động
- Nguồn: Phần 22 mục 22.5, 22.8, 22.9

## P22-08 Hai admin hoàn tiền cùng lúc
- Mục tiêu: khóa dòng, chỉ ghi một lần.
- Dữ liệu: dòng chưa hoàn trong 7 ngày.
- Các bước: hai admin gửi đồng thời POST .../hoan-tien.
- Kết quả mong đợi: một yêu cầu thành công, yêu cầu kia 409 "Khóa học này đã được hoàn tiền.".
- Cách kiểm: Tự động
- Nguồn: Phần 22 mục 22.5, 22.9

## P22-09 Mua lại sau khi hoàn tiền
- Mục tiêu: có quyền học theo lượt mua mới, đánh giá cũ hiện lại.
- Dữ liệu: hv01 sau P22-06 mua lại K1 (đơn mới 'Đã thanh toán').
- Các bước: hv01 vào học K1; đọc danh sách đánh giá K1.
- Kết quả mong đợi: hv01 học được; đánh giá cũ hiện lại.
- Cách kiểm: Tự động
- Nguồn: Phần 22 mục 22.5

## P22-10 Phân quyền
- Mục tiêu: chỉ admin.
- Dữ liệu: học viên, người cung cấp, khách.
- Các bước: gọi các đường của phần này.
- Kết quả mong đợi: 403 hoặc 401 tương ứng.
- Cách kiểm: Tự động
- Nguồn: Phần 22 mục 22.6

## P22-11 Trang đơn hàng và hộp chi tiết
- Mục tiêu: giao diện đúng thiết kế.
- Dữ liệu: dữ liệu chung, có một đơn thanh toán 8 ngày trước.
- Các bước: mở /quan-tri/don-hang; tìm mã đơn; đổi bộ lọc; bấm một dòng; bấm "Hoàn tiền" rồi xác nhận; mở đơn 8 ngày trước.
- Kết quả mong đợi: ô tìm "Tìm theo mã đơn, tên đăng nhập hoặc Gmail học viên", năm lựa chọn kèm số, dòng "Mới nhất ở trên · Bấm vào một dòng để xem chi tiết", "Hiển thị 1-N trên M đơn hàng (20 dòng mỗi trang)"; hộp chi tiết có "Ghi chú của học viên" hoặc "Không có ghi chú", "Các khóa trong đơn (N khóa)", bảng "Lịch sử giao dịch VNPay"; hộp "Hoàn tiền khóa học này?"; xong có "Đã ghi nhận hoàn tiền" và nhãn "Đã hoàn tiền"; đơn 8 ngày nút mờ kèm "Đã quá 7 ngày"; giống các màn thiet_ke/quan_tri_don_hang/.
- Cách kiểm: Bấm tay
- Nguồn: Phần 22 mục 22.3, 22.4, 22.5, 22.8
