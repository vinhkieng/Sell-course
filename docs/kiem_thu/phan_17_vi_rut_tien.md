# Danh sách kiểm thử Phần 17. Ví và rút tiền của người cung cấp

- Đặc tả: docs/dac_ta/phan_17_vi_rut_tien.md
- Code kiểm thử tự động: backend/tests/phan_17_vi_rut_tien.test.js
- Cách kiểm: "Tự động" là Claude Code viết code kiểm thử và chạy bằng npm test; "Bấm tay" là người dùng mở web và làm theo các bước.
- Dữ liệu chung: người cung cấp "ncc01" có khóa K1 giá 299.000 và K2 giá 1.000.000; các đơn 'Đã thanh toán' có dòng giao_dich_thanh_toan với thoi_diem_nhan_ket_qua chỉnh được để giả thời gian; admin.

## P17-01 Tiền nhận của một lượt và tạm giữ
- Mục tiêu: tính gia nhân ti_le_chia chia 100, làm tròn xuống; chưa đủ 7 ngày thì tạm giữ.
- Dữ liệu: một lượt K1 'Giới thiệu' 90, thanh toán 1 ngày trước.
- Các bước: gọi GET /api/nguoi-cung-cap/vi.
- Kết quả mong đợi: dòng doanh thu "Bạn nhận" 269.100; "Đang tạm giữ" 269.100; "Có thể rút" 0.
- Cách kiểm: Tự động
- Nguồn: Phần 17 mục 17.3, 17.10

## P17-02 Qua 7 ngày thì có thể rút
- Mục tiêu: mốc 7 ngày tính theo thoi_diem_nhan_ket_qua.
- Dữ liệu: lùi thoi_diem_nhan_ket_qua của lượt ở P17-01 thành 8 ngày trước.
- Các bước: gọi GET /api/nguoi-cung-cap/vi.
- Kết quả mong đợi: "Đang tạm giữ" 0; "Có thể rút" 269.100.
- Cách kiểm: Tự động
- Nguồn: Phần 17 mục 17.3, 17.10

## P17-03 Làm tròn xuống và mức 60%
- Mục tiêu: làm tròn xuống đồng.
- Dữ liệu: một lượt giá 333.333 'Tự nhiên' 60.
- Các bước: gọi GET /api/nguoi-cung-cap/vi.
- Kết quả mong đợi: "Bạn nhận" 199.999 (333.333 × 60 / 100 = 199.999,8 làm tròn xuống).
- Cách kiểm: Tự động
- Nguồn: Phần 17 mục 17.3; Phần chung C10

## P17-04 Lượt đã hoàn tiền tính 0
- Mục tiêu: hiện "0đ (Đã hoàn tiền)", giá bán giữ nguyên.
- Dữ liệu: lượt ở P17-01 đặt da_hoan_tien 1 khi còn trong 7 ngày.
- Các bước: gọi GET /api/nguoi-cung-cap/vi.
- Kết quả mong đợi: dòng đó có giá 299.000, phần nhận 0 và cờ đã hoàn tiền; "Đang tạm giữ" giảm 269.100.
- Cách kiểm: Tự động
- Nguồn: Phần 17 mục 17.3, 17.10

## P17-05 Bảng doanh thu gần đây
- Mục tiêu: chỉ lượt của khóa mình trong đơn đã thanh toán, mới nhất trên, 5 dòng mỗi trang, không có tên học viên.
- Dữ liệu: 7 lượt đã thanh toán của ncc01; 1 lượt trong đơn 'Chờ thanh toán'; 1 lượt của người cung cấp khác.
- Các bước: gọi GET /api/nguoi-cung-cap/vi?trang=1 và trang=2.
- Kết quả mong đợi: tổng 7 lượt; trang 1 có 5, trang 2 có 2; mỗi dòng có ngày thanh toán, tên khóa đã chụp, giá, nguồn, mức chia, phần nhận; không có tên học viên.
- Cách kiểm: Tự động
- Nguồn: Phần 17 mục 17.3; Phần chung C16

## P17-06 Lưu thông tin nhận tiền
- Mục tiêu: ba ô cùng có hoặc cùng trống; tên tự đổi in hoa không dấu.
- Dữ liệu: { "Vietcombank", "0123456789", "Đỗ Văn Đức" }; sau đó cả ba null.
- Các bước: gọi PUT /api/nguoi-cung-cap/thong-tin-nhan-tien hai lần.
- Kết quả mong đợi: lần một lưu chu_tai_khoan "DO VAN DUC"; lần hai ba cột thành NULL.
- Cách kiểm: Tự động
- Nguồn: Phần 17 mục 17.4, 17.7, 17.10

## P17-07 Thông tin nhận tiền sai
- Mục tiêu: báo đúng lỗi.
- Dữ liệu: thiếu tên chủ tài khoản; số tài khoản "12345", "123456789012345678901", "12a456"; ngân hàng "Ngân hàng X" không thuộc 15 ngân hàng; tên quá 100 ký tự.
- Các bước: gọi PUT.
- Kết quả mong đợi: "Vui lòng nhập đủ ngân hàng, số tài khoản và tên chủ tài khoản"; "Số tài khoản gồm 6 đến 20 chữ số"; ngân hàng lạ và tên quá dài bị từ chối.
- Cách kiểm: Tự động
- Nguồn: Phần 17 mục 17.4, 17.7, 17.9

## P17-08 Gửi yêu cầu rút tiền hợp lệ
- Mục tiêu: thêm yêu cầu kèm bản chép thông tin nhận tiền; ví cập nhật.
- Dữ liệu: "Có thể rút" 1.250.000; đã có thông tin nhận tiền.
- Các bước: gọi POST /api/nguoi-cung-cap/rut-tien { so_tien 500000 }; đổi thông tin nhận tiền; gọi GET ví.
- Kết quả mong đợi: một dòng yeu_cau_rut_tien 'Chờ duyệt' 500.000 kèm ten_ngan_hang, so_tai_khoan, chu_tai_khoan lúc gửi (không đổi sau khi sửa thông tin); "Có thể rút" 750.000; "Đang chờ duyệt rút" 500.000.
- Cách kiểm: Tự động
- Nguồn: Phần 17 mục 17.4, 17.5, 17.10

## P17-09 Thứ tự kiểm khi gửi yêu cầu
- Mục tiêu: gặp lỗi đầu tiên thì dừng.
- Dữ liệu: (a) chưa có thông tin nhận tiền; (b) đang có yêu cầu chờ; (c) có thể rút 90.000; (d) không nhập số; (e) 99.999; (f) lớn hơn số có thể rút 1.250.000.
- Các bước: gọi POST /api/nguoi-cung-cap/rut-tien cho từng trường hợp.
- Kết quả mong đợi: (a) "Vui lòng nhập thông tin nhận tiền trước khi rút"; (b) "Bạn đang có một yêu cầu chờ duyệt. Hãy đợi quản trị viên xử lý trước khi gửi yêu cầu mới."; (c) "Cần có ít nhất 100.000đ có thể rút để gửi yêu cầu."; (d) "Vui lòng nhập số tiền muốn rút"; (e) "Số tiền rút tối thiểu là 100.000đ"; (f) "Số tiền rút không được lớn hơn số tiền có thể rút (1.250.000đ)"; không thêm yêu cầu nào.
- Cách kiểm: Tự động
- Nguồn: Phần 17 mục 17.5, 17.9, 17.10

## P17-10 Hai yêu cầu gửi cùng lúc
- Mục tiêu: khóa dòng, chỉ một yêu cầu 'Chờ duyệt'.
- Dữ liệu: "Có thể rút" 600.000.
- Các bước: gửi đồng thời hai yêu cầu 500.000.
- Kết quả mong đợi: chỉ một yêu cầu được tạo; yêu cầu kia bị từ chối.
- Cách kiểm: Tự động
- Nguồn: Phần 17 mục 17.5

## P17-11 Yêu cầu bị từ chối thì tiền quay lại
- Mục tiêu: "Có thể rút" tính lại.
- Dữ liệu: yêu cầu ở P17-08 chuyển 'Từ chối' (Phần 23); một yêu cầu khác 'Đã chuyển' 200.000.
- Các bước: gọi GET ví.
- Kết quả mong đợi: "Đang chờ duyệt rút" 0; "Đã rút" 200.000; "Có thể rút" = tổng nhận đã qua 7 ngày trừ 200.000.
- Cách kiểm: Tự động
- Nguồn: Phần 17 mục 17.3, 17.10

## P17-12 Lịch sử yêu cầu
- Mục tiêu: mới nhất trên, 10 dòng mỗi trang.
- Dữ liệu: 12 yêu cầu các trạng thái, một yêu cầu 'Đã chuyển' có mã giao dịch, một 'Từ chối' có lý do.
- Các bước: gọi GET /api/nguoi-cung-cap/rut-tien?trang=1 và 2.
- Kết quả mong đợi: trang 1 có 10, trang 2 có 2; có mã giao dịch và lý do từ chối đúng dòng; có thông tin nhận tiền, số có thể rút, có yêu cầu chờ hay không.
- Cách kiểm: Tự động
- Nguồn: Phần 17 mục 17.6, 17.7

## P17-13 Phân quyền
- Mục tiêu: chỉ người cung cấp.
- Dữ liệu: học viên, admin, khách.
- Các bước: gọi GET /api/nguoi-cung-cap/vi và POST /api/nguoi-cung-cap/rut-tien.
- Kết quả mong đợi: học viên và admin 403, khách 401.
- Cách kiểm: Tự động
- Nguồn: Phần 17 mục 17.7; Phần chung C5

## P17-14 Mục Ví trên trang
- Mục tiêu: giao diện đúng thiết kế.
- Dữ liệu: ncc01 có 7 lượt bán, một lượt đã hoàn tiền; một người cung cấp chưa bán được gì.
- Các bước: mở /ho-so#vi; chuyển trang bảng.
- Kết quả mong đợi: bốn thẻ "Có thể rút", "Đang tạm giữ", "Đang chờ duyệt rút", "Đã rút"; bảng Ngày, Khóa học, Giá bán, Nguồn, Mức chia ("90%", "60%"), Bạn nhận ("0đ (Đã hoàn tiền)" ở lượt hoàn tiền); "Hiển thị 1-5 trên 7 lượt bán", "‹ Trước", số trang, "Sau ›"; người chưa bán thấy "Chưa có lượt bán nào."
- Cách kiểm: Bấm tay
- Nguồn: Phần 17 mục 17.3, 17.9

## P17-15 Mục Rút tiền trên trang
- Mục tiêu: thông tin nhận tiền, gửi yêu cầu, lịch sử.
- Dữ liệu: ncc01.
- Các bước: mở /ho-so#rut-tien; gõ tên "Trần Thị Bích"; lưu thiếu ô; lưu đủ; gõ số tiền 1250000; bấm "Rút tối đa"; gửi; xem lịch sử.
- Kết quả mong đợi: danh sách 15 ngân hàng; tên đổi thành "TRAN THI BICH" khi gõ; lỗi như thiet_ke/vi_rut_tien/thieu_thong_tin_nhan_tien.html; "Đã lưu thông tin nhận tiền"; ô số tiền tự thêm dấu chấm, gợi ý "Tối thiểu 100.000đ"; "Rút tối đa" điền đủ số có thể rút; vượt số có thể rút báo như thiet_ke/vi_rut_tien/rut_qua_so_du.html; gửi xong dòng xanh "Đã gửi yêu cầu rút tiền. Số tiền được giữ lại ở mục Đang chờ duyệt rút."; khi có yêu cầu chờ thì ô và nút mờ như thiet_ke/vi_rut_tien/dang_co_yeu_cau_cho.html; bảng lịch sử có "Mã giao dịch: …", ô trống là "-"; chưa có yêu cầu thì "Chưa có yêu cầu rút tiền nào."
- Cách kiểm: Bấm tay
- Nguồn: Phần 17 mục 17.4, 17.5, 17.6, 17.9
