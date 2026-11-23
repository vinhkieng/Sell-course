# PHẦN 22. QUẢN TRỊ - ĐƠN HÀNG VÀ HOÀN TIỀN

Làm sau Phần 21.

## 22.1 Mục đích và ai dùng
- Chỉ admin. Tìm và xem đơn, xem sổ kết quả thanh toán của đơn, ghi nhận hoàn tiền từng khóa. Ngoài nút "Hoàn tiền", admin không sửa được gì của đơn.

## 22.2 Màn thiết kế
- thiet_ke/quan_tri_don_hang/don_hang.html (màn "Quản trị - Đơn hàng"): danh sách đơn hàng, kèm hộp chi tiết và hộp "Hoàn tiền khóa học này?".
- thiet_ke/quan_tri_don_hang/don_hang_chi_tiet_don_moi.html (màn "Quản trị - Đơn hàng (đơn mới)"): hộp chi tiết đơn mới thanh toán (có nút "Hoàn tiền") và đơn chưa thanh toán.
- thiet_ke/quan_tri_don_hang/don_hang_chi_tiet_qua_7_ngay.html (màn "Quản trị - Đơn hàng (đơn quá 7 ngày)"): hộp chi tiết đơn đã quá 7 ngày (nút "Hoàn tiền" mờ, dòng "Đã quá 7 ngày").

## 22.3 Danh sách đơn (/quan-tri/don-hang)
- Ô tìm "Tìm theo mã đơn, tên đăng nhập hoặc Gmail học viên": gõ đúng dạng AVA-yymmdd-nnnn thì tìm đúng đơn đó; còn lại tìm chứa chữ trong tên đăng nhập hoặc Gmail.
- Năm lựa chọn lọc kèm số: "Tất cả", "Đã thanh toán", "Chờ thanh toán", "Thất bại", "Hết hạn". Dòng "Mới nhất ở trên. Bấm vào một dòng để xem chi tiết".
- Cột: Mã đơn, Học viên (tên đăng nhập và Gmail), Ngày tạo (ngày và giờ), Các khóa trong đơn (tên khóa đầu tiên kèm "+N khóa khác" nếu có), Tổng tiền, Trạng thái. 20 dòng mỗi trang, "Hiển thị 1-9 trên 9 đơn hàng (20 dòng mỗi trang)".
- Trước khi trả dữ liệu, chạy câu chuyển hết hạn (Phần 13 mục 13.9).

## 22.4 Hộp "Chi tiết đơn hàng"
- Nhãn trạng thái, Mã đơn, Họ tên, Gmail, Số điện thoại (lấy từ hồ sơ hiện tại của học viên), "Ghi chú của học viên" (không có thì "Không có ghi chú").
- "Các khóa trong đơn (N khóa)": mỗi khóa có tên và giá đã chụp; Nguồn, Mức chia, Người cung cấp nhận (gia nhân ti_le_chia chia 100, làm tròn xuống), AVA nhận (giá trừ phần người cung cấp).
  - Đơn chưa thanh toán: bốn ô này hiện "-", không có nút hoàn tiền.
  - Khóa đã hoàn tiền: nhãn "Đã hoàn tiền", "Người cung cấp nhận: 0đ (Đã hoàn tiền)", "AVA nhận: 0đ".
  - Đơn đã thanh toán, khóa chưa hoàn: nút "Hoàn tiền"; quá 7 ngày kể từ thời điểm thanh toán thì nút mờ kèm dòng "Đã quá 7 ngày".
- Tổng tiền, Ngày tạo đơn, Ngày thanh toán ("Chưa thanh toán"), "Mã giao dịch VNPay" ("Chưa có").
- Bảng "Lịch sử giao dịch VNPay": mọi dòng giao_dich_thanh_toan có id_don_hang là đơn này, mới nhất ở trên. Cột Thời điểm, Nguồn (Phần chung C11), Kết quả (mã kèm chữ, ví dụ "00 - Thành công", "24 - Học viên hủy"; dòng 'Kiểm tra lại' lấy trạng thái giao dịch trong du_lieu_goc, mã 91 là "91 - Không tìm thấy giao dịch"; dòng chữ ký sai thêm "(chữ ký không hợp lệ)"), Số tiền, Ngân hàng (vnp_BankCode trong du_lieu_goc, không có thì "-"). Bảng chữ cho các mã thường gặp: 00 Thành công; 07 Trừ tiền thành công, giao dịch bị nghi ngờ; 09 Thẻ chưa đăng ký Internet Banking; 10 Xác thực thông tin sai quá 3 lần; 11 Hết hạn chờ thanh toán; 12 Thẻ bị khóa; 13 Sai mã xác thực; 24 Học viên hủy; 51 Không đủ số dư; 65 Vượt hạn mức trong ngày; 75 Ngân hàng đang bảo trì; 79 Sai mật khẩu thanh toán quá số lần; 99 Lỗi khác; mã khác hiện số mã. Claude Code đối chiếu bảng mã trong tài liệu VNPay.
- Nút "Đóng".
- Dòng sổ không gắn với đơn nào (chữ ký sai, không tìm thấy đơn) không có trang xem; admin xem trực tiếp trong cơ sở dữ liệu (hạn chế đã biết).

## 22.5 Hoàn tiền
- Học viên xin hoàn tiền qua email ngoài website. Admin tự xét điều kiện 30% (hộp không hiện tiến độ học), việc học viên đã từng được hoàn khóa này hay chưa, và tài khoản có bị khóa vì vi phạm không. Admin chuyển tiền ngoài website (mô phỏng).
- Bấm "Hoàn tiền" mở hộp "Hoàn tiền khóa học này?" với nút "Hủy" và "Hoàn tiền".
- Máy chủ, trong một giao dịch, khóa dòng chi_tiet_don_hang bằng SELECT … FOR UPDATE và kiểm: đơn 'Đã thanh toán'; da_hoan_tien = 0; NOW() nhỏ hơn thời điểm thanh toán cộng 7 ngày. Quá 7 ngày: 409 "Đã quá 7 ngày, không hoàn tiền được.". Đã hoàn: 409 "Khóa học này đã được hoàn tiền.".
- Hợp lệ: da_hoan_tien = 1, id_quan_tri_vien = admin. Bấm rồi không bỏ được. Ô thông báo nhỏ "Đã ghi nhận hoàn tiền", hộp cập nhật nhãn "Đã hoàn tiền".
- Hệ quả tự có nhờ câu truy vấn: học viên mất quyền học khóa đó (khóa biến khỏi "Khóa học của tôi", trang chi tiết hiện lại nút mua), đánh giá của học viên cho khóa đó không còn hiện, phần tiền của người cung cấp cho lượt bán đó tính 0 trong ví (tiền này chắc chắn còn ở "Đang tạm giữ" nên ví không bị âm).
- Học viên mua lại khóa đã hoàn thì có quyền học theo lượt mua mới; đánh giá cũ hiện lại.

## 22.6 Đường xử lý ở máy chủ (chỉ admin)
- GET /api/quan-tri/don-hang?tu_khoa=&trang_thai=&trang=: danh sách và số đếm năm lựa chọn.
- GET /api/quan-tri/don-hang/:id: dữ liệu hộp chi tiết.
- POST /api/quan-tri/chi-tiet-don-hang/:id/hoan-tien.

## 22.7 Bảng dữ liệu dùng
- don_hang, chi_tiet_don_hang, giao_dich_thanh_toan, cong_thanh_toan, nguoi_dung, hoc_vien.

## 22.8 Câu thông báo
- "Hoàn tiền khóa học này?", "Đã quá 7 ngày", "Đã quá 7 ngày, không hoàn tiền được.", "Khóa học này đã được hoàn tiền.", "Đã ghi nhận hoàn tiền", "Đã hoàn tiền", "Không có ghi chú"

## 22.9 Kiểm tra khi làm xong
- Tìm "AVA-261012-0033": ra đúng một đơn. Tìm "gmail.com": ra mọi đơn.
- Hoàn tiền một khóa trong đơn 2 khóa: chỉ khóa đó có nhãn "Đã hoàn tiền", học viên còn học được khóa kia.
- Sửa tay thời điểm thanh toán lùi 8 ngày: nút mờ "Đã quá 7 ngày"; gọi thẳng API hoàn tiền: 409.
- Hai admin bấm hoàn tiền cùng lúc: chỉ một lần được ghi, lần sau nhận 409.
- Danh sách kiểm thử đầy đủ: docs/kiem_thu/phan_22_quan_tri_don_hang.md
