# Danh sách kiểm thử Phần 13. Đặt hàng, thanh toán VNPay, lịch sử đơn hàng

- Đặc tả: docs/dac_ta/phan_13_dat_hang_thanh_toan.md
- Code kiểm thử tự động: backend/tests/phan_13_dat_hang_thanh_toan.test.js
- Cách kiểm: "Tự động" là Claude Code viết code kiểm thử và chạy bằng npm test; "Bấm tay" là người dùng mở web và làm theo các bước.
- Dữ liệu chung: học viên "hv01" có họ tên và số điện thoại, mã giới thiệu HV01MAGT; học viên "hv02" thiếu số điện thoại; người cung cấp "ncc01" (mã MAINCC01) có K1 giá 299.000, K2 giá 450.000 'Đang bán'; K3 'Bị ẩn'; khóa K9 hv01 đã mua. Khi kiểm thử dùng VNPay giả: kiểm thử tự dựng tham số kết quả và tự ký bằng VNP_HASH_SECRET của kiểm thử; đường tra cứu (querydr) trả câu trả lời giả do kiểm thử chọn.

## P13-01 Xem trước đơn
- Mục tiêu: trả thông tin người đặt, khóa mua được, khóa bị bỏ, tên cổng.
- Dữ liệu: hv01 với khoa=K1,K2,K3,K9.
- Các bước: gọi GET /api/dat-hang/xem-truoc?khoa=...
- Kết quả mong đợi: họ tên, Gmail, số điện thoại từ hồ sơ, hồ sơ đủ; K1, K2 mua được với giá hiện tại; K3 bị bỏ (không còn bán), K9 bị bỏ (đã sở hữu); tên cổng "VNPay". Không ghi gì vào database.
- Cách kiểm: Tự động
- Nguồn: Phần 13 mục 13.3, 13.11

## P13-02 Tạo đơn hợp lệ
- Mục tiêu: ghi đơn và chi tiết đơn đúng, trả đường dẫn thanh toán.
- Dữ liệu: hv01 gửi K1 (299000), K2 (450000), ghi chú "  " (chỉ dấu cách).
- Các bước: gọi POST /api/don-hang.
- Kết quả mong đợi: trả { duong_dan_thanh_toan }; don_hang có id_cong_thanh_toan 1, tong_tien 749000, trang_thai 'Chờ thanh toán', ghi_chu NULL, ngay_gui_cong_thanh_toan có giá trị; hai dòng chi_tiet_don_hang chụp tên và giá, 'Tự nhiên' và 60.
- Cách kiểm: Tự động
- Nguồn: Phần 13 mục 13.4

## P13-03 Tham số và chữ ký đường dẫn VNPay
- Mục tiêu: đường dẫn có đủ tham số và chữ ký đúng.
- Dữ liệu: đơn ở P13-02.
- Các bước: tách tham số trong duong_dan_thanh_toan; tự tính lại chữ ký.
- Kết quả mong đợi: vnp_Version 2.1.0, vnp_Command pay, vnp_TmnCode, vnp_Amount = 74900000, vnp_CurrCode VND, vnp_TxnRef dạng AVA-yymmdd-nnnn, vnp_OrderInfo "Thanh toan don hang <mã đơn>", vnp_OrderType other, vnp_Locale vn, vnp_ReturnUrl = CLIENT_ORIGIN + "/thanh-toan/ket-qua", vnp_IpAddr là IP đã chuẩn hóa, vnp_CreateDate và vnp_ExpireDate (ngay_tao + 30 phút) dạng yyyyMMddHHmmss; vnp_SecureHash khớp HMAC SHA512; không có họ tên, Gmail, số điện thoại, ghi chú.
- Cách kiểm: Tự động
- Nguồn: Phần 13 mục 13.4, 13.5

## P13-04 Đơn chờ cũ thành hết hạn khi tạo đơn mới
- Mục tiêu: mỗi học viên chỉ một đơn đang chờ.
- Dữ liệu: hv01 đang có đơn 'Chờ thanh toán'.
- Các bước: tạo đơn mới.
- Kết quả mong đợi: đơn cũ 'Hết hạn'; đơn mới 'Chờ thanh toán'.
- Cách kiểm: Tự động
- Nguồn: Phần 13 mục 13.4, 13.14

## P13-05 Đơn có thay đổi
- Mục tiêu: chưa tạo đơn, trả 409 kèm danh sách mới.
- Dữ liệu: hv01 gửi K1 với giá 299000 sau khi giá K1 đã đổi thành 349000; gửi K3 (bị ẩn); gửi K9 (đã sở hữu).
- Các bước: gọi POST /api/don-hang.
- Kết quả mong đợi: 409, ma "DON_THAY_DOI", trường cùng cấp chứa danh sách mới (K1 giá 349000, K3 và K9 bị bỏ kèm lý do); không có đơn nào được tạo.
- Cách kiểm: Tự động
- Nguồn: Phần 13 mục 13.4, 13.11, 13.14

## P13-06 Hồ sơ thiếu thông tin
- Mục tiêu: máy chủ chặn.
- Dữ liệu: hv02.
- Các bước: gọi POST /api/don-hang với K1.
- Kết quả mong đợi: 400 với "Hồ sơ của bạn còn thiếu họ tên hoặc số điện thoại. Vui lòng cập nhật hồ sơ để thanh toán."; không tạo đơn.
- Cách kiểm: Tự động
- Nguồn: Phần 13 mục 13.3, 13.11

## P13-07 Nguồn bán và mức chia
- Mục tiêu: chốt theo ghi nhớ link giới thiệu cho từng khóa.
- Dữ liệu: cookie ava_gioi_thieu: K1 mã MAINCC01 (chủ khóa) ghi 1 giờ trước; K2 mã của học viên khác ghi 1 giờ trước. Lần hai: K1 mã HV01MAGT (chính người mua). Lần ba: K1 mã MAINCC01 ghi 25 giờ trước.
- Các bước: tạo đơn cho mỗi lần.
- Kết quả mong đợi: lần một K1 'Giới thiệu' 90, K2 'Học viên giới thiệu' 60; lần hai K1 'Tự nhiên' 60; lần ba K1 'Tự nhiên' 60.
- Cách kiểm: Tự động
- Nguồn: Phần 13 mục 13.4, 13.14

## P13-08 Trình duyệt quay về, thành công
- Mục tiêu: hoàn tất đơn, ghi sổ, xóa khỏi giỏ.
- Dữ liệu: đơn 'Chờ thanh toán' chứa K1, K2; giỏ hv01 có K1, K2, K5; tham số kết quả hợp lệ vnp_ResponseCode 00, vnp_TransactionStatus 00, đúng số tiền.
- Các bước: hv01 gọi GET /api/thanh-toan/vnpay-tra-ve?<tham số>.
- Kết quả mong đợi: một dòng giao_dich_thanh_toan nguon_den 'Trình duyệt', chu_ky_hop_le 1, ma_don_cong_gui_ve, ma_ket_qua, so_tien, ma_giao_dich_cong, du_lieu_goc đầy đủ, id_don_hang đúng; đơn 'Đã thanh toán', id_giao_dich_thanh_toan trỏ dòng đó; giỏ chỉ còn K5; trả thông tin đơn để hiện "Thanh toán thành công".
- Cách kiểm: Tự động
- Nguồn: Phần 13 mục 13.6, 13.7, 13.14

## P13-09 Kết quả không thành công
- Mục tiêu: đơn chờ thành 'Thất bại', giỏ giữ nguyên.
- Dữ liệu: đơn 'Chờ thanh toán'; vnp_ResponseCode 24.
- Các bước: gọi đường trình duyệt quay về.
- Kết quả mong đợi: sổ có dòng mới; đơn 'Thất bại'; giỏ giữ nguyên.
- Cách kiểm: Tự động
- Nguồn: Phần 13 mục 13.6, 13.14

## P13-10 Chữ ký sai
- Mục tiêu: không tin gì, vẫn ghi sổ nguyên văn.
- Dữ liệu: tham số hợp lệ rồi sửa vnp_Amount mà không ký lại.
- Các bước: gọi đường trình duyệt quay về.
- Kết quả mong đợi: dòng sổ chu_ky_hop_le 0, id_don_hang NULL, chép nguyên giá trị nhận được; đơn không đổi; trả trường hợp "Không xác nhận được kết quả thanh toán. Nếu bạn đã bị trừ tiền, vui lòng bấm Kiểm tra lại thanh toán ở Lịch sử đơn hàng hoặc liên hệ hỗ trợ.".
- Cách kiểm: Tự động
- Nguồn: Phần 13 mục 13.6, 13.7, 13.14

## P13-11 Không tìm thấy đơn và lệch số tiền
- Mục tiêu: dừng đúng bước.
- Dữ liệu: vnp_TxnRef trỏ id không có (đã ký đúng); vnp_TxnRef đúng id nhưng sai phần ngày; vnp_Amount khác tong_tien (đã ký đúng).
- Các bước: gọi đường trình duyệt quay về với từng bộ.
- Kết quả mong đợi: hai bộ đầu: dòng sổ id_don_hang NULL, không đơn nào đổi; bộ ba: dòng sổ gắn đơn, đơn giữ nguyên.
- Cách kiểm: Tự động
- Nguồn: Phần 13 mục 13.6

## P13-12 Làm sạch trước khi ghi sổ
- Mục tiêu: dữ liệu lạ không làm lệnh ghi bị MySQL từ chối.
- Dữ liệu: thiếu vnp_TxnRef; vnp_Amount "abc"; vnp_TransactionNo dài 500 ký tự.
- Các bước: gọi đường trình duyệt quay về.
- Kết quả mong đợi: mỗi lần đều ghi được một dòng sổ (ma_don_cong_gui_ve rỗng; so_tien NULL; giá trị bị cắt, bản đầy đủ trong du_lieu_goc); không lỗi 500.
- Cách kiểm: Tự động
- Nguồn: Phần 13 mục 13.6

## P13-13 Kết quả đến lần hai
- Mục tiêu: đơn đã thanh toán không đổi, sổ vẫn ghi.
- Dữ liệu: đơn đã 'Đã thanh toán' ở P13-08.
- Các bước: gửi lại đúng tham số thành công.
- Kết quả mong đợi: sổ thêm một dòng; đơn không đổi, id_giao_dich_thanh_toan vẫn trỏ dòng cũ.
- Cách kiểm: Tự động
- Nguồn: Phần 13 mục 13.6, 13.14

## P13-14 Thành công đến muộn cho đơn hết hạn hoặc thất bại
- Mục tiêu: đơn chưa thanh toán vẫn được hoàn tất khi kết quả thành công tới, kể cả khóa vừa bị ẩn.
- Dữ liệu: đơn 'Hết hạn'; đơn 'Thất bại'; đơn chứa khóa vừa bị admin ẩn.
- Các bước: gửi kết quả thành công hợp lệ cho từng đơn.
- Kết quả mong đợi: cả ba đơn 'Đã thanh toán'.
- Cách kiểm: Tự động
- Nguồn: Phần 13 mục 13.6

## P13-15 Đơn quá 30 phút chuyển hết hạn trước khi xét
- Mục tiêu: kết quả không thành công đến khi đơn đã quá hạn thì đơn là 'Hết hạn'.
- Dữ liệu: đơn 'Chờ thanh toán' có ngay_tao lùi 31 phút; kết quả vnp_ResponseCode 24.
- Các bước: gọi đường trình duyệt quay về.
- Kết quả mong đợi: đơn 'Hết hạn' (không phải 'Thất bại'); trả trường hợp "Đơn hàng đã hết hạn".
- Cách kiểm: Tự động
- Nguồn: Phần 13 mục 13.6, 13.7

## P13-16 Người xem không phải chủ đơn
- Mục tiêu: đơn vẫn được xử lý, người khác nhận 404.
- Dữ liệu: đơn của hv01; người gọi là học viên khác (hoặc khách).
- Các bước: gọi đường trình duyệt quay về với kết quả thành công.
- Kết quả mong đợi: đơn 'Đã thanh toán'; người gọi nhận 404.
- Cách kiểm: Tự động
- Nguồn: Phần 13 mục 13.7

## P13-17 IPN
- Mục tiêu: trả đúng RspCode, Message.
- Dữ liệu: chữ ký sai; đơn không có; lệch số tiền; đơn đã thanh toán từ trước; kết quả thành công cho đơn đang chờ; kết quả không thành công cho đơn đang chờ.
- Các bước: gọi GET /api/thanh-toan/vnpay-ipn không có cookie, không có Origin.
- Kết quả mong đợi: lần lượt { 97, "Invalid signature" }, { 01, "Order not found" }, { 04, "Invalid amount" }, { 02, "Order already confirmed" }, { 00, "Confirm Success" } (đơn thành 'Đã thanh toán'), { 00, "Confirm Success" } (đơn thành 'Thất bại'); mỗi lần ghi một dòng sổ nguon_den 'Máy chủ cổng thanh toán'.
- Cách kiểm: Tự động
- Nguồn: Phần 13 mục 13.6, 13.7

## P13-18 Thiếu cấu hình VNPay
- Mục tiêu: báo rõ thiếu dòng nào.
- Dữ liệu: chạy với VNP_TMN_CODE để trống (cấu hình kiểm thử riêng).
- Các bước: gọi POST /api/don-hang.
- Kết quả mong đợi: lỗi có câu nói rõ thiếu dòng VNP_TMN_CODE trong backend/.env; không ghi đơn dở.
- Cách kiểm: Tự động
- Nguồn: Phần 13 mục 13.5; Phần chung C2

## P13-19 Kiểm tra lại thanh toán: thành công
- Mục tiêu: tra cứu querydr và hoàn tất đơn.
- Dữ liệu: đơn 'Hết hạn' tạo 2 giờ trước; VNPay giả trả vnp_ResponseCode 00, vnp_TransactionStatus 00, đúng số tiền, chữ ký đúng.
- Các bước: gọi POST /api/don-hang/:id/kiem-tra-lai.
- Kết quả mong đợi: yêu cầu gửi đi có vnp_Command querydr, vnp_TxnRef = mã đơn, vnp_TransactionDate = ngay_gui_cong_thanh_toan dạng yyyyMMddHHmmss, chữ ký đúng thứ tự trường của querydr; sổ có dòng nguon_den 'Kiểm tra lại' gắn đơn; đơn 'Đã thanh toán'; trả thông tin để chuyển tới /thanh-toan/ket-qua?don=<id>.
- Cách kiểm: Tự động
- Nguồn: Phần 13 mục 13.8

## P13-20 Kiểm tra lại thanh toán: các câu trả lời khác
- Mục tiêu: xử lý đúng bảng 13.8.
- Dữ liệu: VNPay giả trả mã 91; trạng thái 01; trạng thái 02; chữ ký sai; không trả lời quá 10 giây (hoặc lỗi kết nối).
- Các bước: gọi POST /api/don-hang/:id/kiem-tra-lai với một đơn 'Chờ thanh toán' còn hạn cho từng câu trả lời.
- Kết quả mong đợi: 91 và 01: ghi sổ, đơn không đổi, câu "VNPay chưa ghi nhận thanh toán cho đơn này. Nếu bạn đã bị trừ tiền, vui lòng liên hệ hỗ trợ ở cuối trang."; 02: đơn 'Thất bại', cùng câu; chữ ký sai: sổ chu_ky_hop_le 0, id_don_hang là đơn đang kiểm tra, đơn không đổi, cùng câu; quá 10 giây: không ghi sổ, đơn không đổi, câu "Không kết nối được với VNPay. Vui lòng thử lại sau ít phút."
- Cách kiểm: Tự động
- Nguồn: Phần 13 mục 13.6, 13.8

## P13-21 Điều kiện nút kiểm tra lại
- Mục tiêu: chỉ đơn chờ còn hạn và đơn hết hạn trong 24 giờ, đơn của chính mình.
- Dữ liệu: đơn 'Thất bại'; đơn 'Hết hạn' tạo 25 giờ trước; đơn 'Đã thanh toán'; đơn của học viên khác.
- Các bước: gọi POST /api/don-hang/:id/kiem-tra-lai.
- Kết quả mong đợi: ba đơn đầu bị từ chối, không gọi VNPay; đơn của người khác 404.
- Cách kiểm: Tự động
- Nguồn: Phần 13 mục 13.8

## P13-22 Đơn hết hạn
- Mục tiêu: việc chạy mỗi phút và mọi chỗ đọc đơn đều chuyển đơn quá 30 phút.
- Dữ liệu: đơn 'Chờ thanh toán' có ngay_tao lùi 31 phút.
- Các bước: gọi hàm của việc chạy mỗi phút; làm lại dữ liệu rồi gọi GET /api/don-hang (không chạy việc định kỳ).
- Kết quả mong đợi: cả hai cách đơn đều thành 'Hết hạn'.
- Cách kiểm: Tự động
- Nguồn: Phần 13 mục 13.9, 13.14; Phần chung C13

## P13-23 Lịch sử đơn và chi tiết đơn
- Mục tiêu: đúng dữ liệu, phân trang, quyền xem.
- Dữ liệu: hv01 có 12 đơn; một đơn đã thanh toán có một khóa da_hoan_tien 1; đơn của học viên khác.
- Các bước: gọi GET /api/don-hang?trang=1 và trang=2; gọi GET /api/don-hang/:id; gọi chi tiết đơn của người khác.
- Kết quả mong đợi: trang 1 có 10 đơn mới nhất ở trên, trang 2 có 2 đơn; mỗi đơn có mã đơn, ngày đặt, khóa (tên đã chụp), số tiền, trạng thái, có nút kiểm tra lại hay không; chi tiết có ngày thanh toán (thoi_diem_nhan_ket_qua của dòng sổ thành công), phương thức, mã giao dịch VNPay, thông tin người đặt từ hồ sơ hiện tại, ghi chú, khóa kèm giá lúc mua, khóa hoàn tiền có đánh dấu; không có nguồn bán và mức chia; đơn người khác 404.
- Cách kiểm: Tự động
- Nguồn: Phần 13 mục 13.6, 13.10, 13.14

## P13-24 Người cung cấp và admin
- Mục tiêu: các đường của phần này chỉ dành cho học viên.
- Dữ liệu: ncc01, admin.
- Các bước: gọi GET /api/dat-hang/xem-truoc, POST /api/don-hang, GET /api/don-hang.
- Kết quả mong đợi: 403.
- Cách kiểm: Tự động
- Nguồn: Phần 13 mục 13.1, 13.11

## P13-25 Trang Thông tin đơn hàng
- Mục tiêu: giao diện đúng thiết kế, không ghi gì khi mở trang.
- Dữ liệu: hv01 và hv02; giỏ có K1, K2, K3.
- Các bước: từ giỏ bấm "Mua"; từ trang chi tiết bấm "Mua ngay"; gõ ghi chú dài; hv02 mở trang; mở trang chỉ với K3.
- Kết quả mong đợi: đường dẫn trên cùng "Trang chủ / Giỏ hàng / Thông tin đơn hàng" (mua ngay thì tên khóa thay "Giỏ hàng"); khung "Thông tin người đặt" với "Lấy từ hồ sơ của bạn.", "Cập nhật hồ sơ", dòng "Gmail và số điện thoại dùng để quản trị viên liên hệ khi đơn hàng có sự cố."; ô ghi chú đếm "N/500 ký tự", không gõ quá 500; khung "Đơn hàng của bạn" có "Tổng tiền", "Thanh toán", "Thanh toán an toàn qua VNPay", "Bạn có 30 phút để hoàn tất thanh toán sau khi bấm nút này"; K3 bị bỏ kèm câu báo; hv02 thấy dải thiếu hồ sơ và nút "Thanh toán" mờ như thiet_ke/dat_hang_thanh_toan/thong_tin_don_hang_thieu_ho_so.html; chỉ K3 thì quay về với "Các khóa bạn chọn không còn mua được."
- Cách kiểm: Bấm tay
- Nguồn: Phần 13 mục 13.3, 13.13

## P13-26 Đơn có thay đổi trên trang
- Mục tiêu: dải vàng và giá mới.
- Dữ liệu: hv01 đang ở trang Thông tin đơn hàng với K1; tài khoản ncc01 đổi giá K1 ở thẻ khác.
- Các bước: bấm "Thanh toán".
- Kết quả mong đợi: dải "Đơn hàng có thay đổi, vui lòng xem lại trước khi thanh toán."; dưới K1 "Giá đã đổi từ 299.000đ thành 349.000đ."; tổng tiền tính lại; chưa có đơn nào được tạo.
- Cách kiểm: Bấm tay
- Nguồn: Phần 13 mục 13.4, 13.14

## P13-27 Thanh toán thật trên sandbox
- Mục tiêu: chạy hết luồng với VNPay sandbox.
- Dữ liệu: điền VNP_TMN_CODE, VNP_HASH_SECRET trong backend/.env; thẻ thử của sandbox VNPay.
- Các bước: thanh toán đơn có K1; làm đơn khác rồi bấm hủy trên trang VNPay; sửa tay vnp_Amount trên đường dẫn quay về rồi tải lại; tải lại đúng đường dẫn thành công lần hai.
- Kết quả mong đợi: thành công thì trang "Thanh toán thành công" với "Cảm ơn bạn. Các khóa học đã được mở, bạn có thể học ngay.", mã đơn, ngày thanh toán, phương thức, thông tin người đặt, "Khóa học trong đơn (N)", "Tổng tiền", nút "Về trang chủ"; K1 biến khỏi giỏ, trang chi tiết K1 hiện "Đã sở hữu"; hủy thì trang "Thanh toán không thành công" với "Giao dịch bị hủy hoặc gặp lỗi. Bạn chưa bị trừ tiền cho đơn này, và giỏ hàng của bạn vẫn được giữ lại.", giỏ còn nguyên; sửa tham số thì trang báo "Không xác nhận được kết quả thanh toán. Nếu bạn đã bị trừ tiền, vui lòng bấm Kiểm tra lại thanh toán ở Lịch sử đơn hàng hoặc liên hệ hỗ trợ."; tải lại lần hai thì sổ thêm dòng, đơn không đổi.
- Cách kiểm: Bấm tay
- Nguồn: Phần 13 mục 13.7, 13.14

## P13-28 Lịch sử đơn, chi tiết đơn và đơn hết hạn trên trang
- Mục tiêu: giao diện đúng thiết kế.
- Dữ liệu: hv01 có đơn thành công, thất bại, hết hạn trong 24 giờ, hết hạn quá 24 giờ; một học viên chưa có đơn.
- Các bước: mở /ho-so#lich-su-don-hang; bấm "Kiểm tra lại thanh toán"; bấm "Xem chi tiết"; mở trang "Đơn hàng đã hết hạn" của đơn trong 24 giờ.
- Kết quả mong đợi: bảng Mã đơn, Ngày đặt, Khóa học, Số tiền, Trạng thái, Hành động; nút kiểm tra lại chỉ ở đơn hết hạn trong 24 giờ; bấm thì hiện "Đang kiểm tra với VNPay" rồi câu kết quả như các màn kiem_tra_lai_*.html; chi tiết có "Mã giao dịch VNPay", "Ngày thanh toán", "Chưa thanh toán", "Chưa có", nhãn "Đã hoàn tiền", "Quay lại lịch sử đơn hàng"; trang hết hạn có câu "Bạn chưa hoàn tất thanh toán trong 30 phút nên đơn đã hết hạn. Nếu bạn đã bị trừ tiền, hãy bấm 'Kiểm tra lại thanh toán' hoặc liên hệ hỗ trợ ở cuối trang. Nếu muốn mua, vui lòng đặt lại từ đầu." và nút kiểm tra lại; học viên chưa có đơn thấy "Bạn chưa có đơn hàng nào."; người cung cấp mở các trang này thấy trang 403.
- Cách kiểm: Bấm tay
- Nguồn: Phần 13 mục 13.1, 13.7, 13.8, 13.10, 13.13
