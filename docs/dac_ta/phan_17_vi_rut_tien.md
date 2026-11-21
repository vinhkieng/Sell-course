# PHẦN 17. VÍ VÀ RÚT TIỀN (NGƯỜI CUNG CẤP)

Làm sau Phần 13 (cần có đơn đã thanh toán). Phía admin duyệt rút tiền ở Phần 23.

## 17.1 Mục đích và ai dùng
- Người cung cấp xem doanh thu, khai thông tin nhận tiền, gửi yêu cầu rút tiền, xem lịch sử yêu cầu.

## 17.2 Màn thiết kế
- thiet_ke/ho_so/ho_so_nguoi_cung_cap.html (màn "Hồ sơ người cung cấp"): hai mục "Ví" và "Rút tiền" trong hồ sơ người cung cấp.
- thiet_ke/vi_rut_tien/thieu_thong_tin_nhan_tien.html (màn "Hồ sơ người cung cấp - Thiếu thông tin nhận tiền"): chưa có thông tin nhận tiền mà bấm gửi.
- thiet_ke/vi_rut_tien/rut_qua_so_du.html (màn "Hồ sơ người cung cấp - Rút quá số dư"): số tiền lớn hơn số có thể rút.
- thiet_ke/vi_rut_tien/dang_co_yeu_cau_cho.html (màn "Hồ sơ người cung cấp - Đang có yêu cầu chờ"): đang có một yêu cầu chờ duyệt.
- thiet_ke/vi_rut_tien/da_gui_yeu_cau.html (màn "Hồ sơ người cung cấp - Đã gửi yêu cầu rút"): vừa gửi yêu cầu.

## 17.3 Ví (/ho-so#vi)
- Ví không có bảng riêng, không lưu số dư. Mỗi lần mở trang tính lại từ dữ liệu:
  - Một lượt bán = một dòng chi_tiet_don_hang của khóa thuộc người cung cấp, nằm trong đơn 'Đã thanh toán'. Thời điểm thanh toán = thoi_diem_nhan_ket_qua của dòng giao_dich_thanh_toan mà đơn trỏ tới.
  - Tiền người cung cấp nhận của một lượt = gia nhân ti_le_chia chia 100, làm tròn xuống đồng; lượt đã hoàn tiền (da_hoan_tien = 1) tính 0.
  - "Đang tạm giữ" = tổng tiền nhận của các lượt có thời điểm thanh toán chưa đủ 7 ngày (NOW() nhỏ hơn thời điểm thanh toán cộng 7 ngày).
  - "Đang chờ duyệt rút" = tổng so_tien các yêu cầu 'Chờ duyệt'.
  - "Đã rút" = tổng so_tien các yêu cầu 'Đã chuyển'.
  - "Có thể rút" = tổng tiền nhận của các lượt đã qua 7 ngày, trừ "Đang chờ duyệt rút", trừ "Đã rút".
- Bốn thẻ: "Có thể rút", "Đang tạm giữ", "Đang chờ duyệt rút", "Đã rút".
- Bảng "Doanh thu gần đây": cột Ngày (ngày thanh toán), Khóa học (tên đã chụp lúc mua), Giá bán, Nguồn ("Giới thiệu", "Học viên giới thiệu", "Tự nhiên"), Mức chia ("90%" hoặc "60%"), Bạn nhận (lượt đã hoàn tiền ghi "0đ (Đã hoàn tiền)", giá bán giữ nguyên). Mới nhất ở trên, 5 dòng mỗi trang, dòng "Hiển thị 1-5 trên N lượt bán", nút "‹ Trước", số trang, "Sau ›". Không hiện tên học viên. Chưa có lượt bán nào thì hiện "Chưa có lượt bán nào.".

## 17.4 Thông tin nhận tiền (đầu mục Rút tiền, /ho-so#rut-tien)
- Ba ô: "Ngân hàng" (chọn một trong 15 ngân hàng: Vietcombank, VietinBank, BIDV, Agribank, Techcombank, MB Bank, ACB, VPBank, Sacombank, TPBank, HDBank, VIB, SHB, OCB, MSB), "Số tài khoản" (6 đến 20 chữ số), "Tên chủ tài khoản" (tự đổi sang chữ in hoa không dấu khi gõ, ví dụ "Trần Thị Bích" thành "TRAN THI BICH"; chỉ chữ A-Z và dấu cách, tối đa 100 ký tự). Nút "Lưu thông tin".
- Ba ô cùng có hoặc cùng trống (xóa trắng cả ba rồi lưu thì xóa thông tin). Không phải nhập lại mật khẩu.
- Lỗi: thiếu một trong ba ô "Vui lòng nhập đủ ngân hàng, số tài khoản và tên chủ tài khoản"; số tài khoản sai "Số tài khoản gồm 6 đến 20 chữ số". Lưu xong ô thông báo nhỏ "Đã lưu thông tin nhận tiền".
- Đổi thông tin nhận tiền không làm đổi yêu cầu đã gửi (yêu cầu giữ bản chép riêng).

## 17.5 Gửi yêu cầu rút tiền
- Dòng "Số tiền có thể rút: 1.250.000đ", ô "Số tiền muốn rút" (gợi ý "Tối thiểu 100.000đ", tự thêm dấu chấm ngăn nghìn khi gõ), nút "Rút tối đa" (điền sẵn toàn bộ số có thể rút), nút "Gửi yêu cầu".
- Kiểm tra lần lượt, gặp lỗi đầu tiên thì dừng:
  - Chưa có thông tin nhận tiền: "Vui lòng nhập thông tin nhận tiền trước khi rút".
  - Đang có yêu cầu 'Chờ duyệt': ô nhập, "Rút tối đa" và "Gửi yêu cầu" mờ, dòng "Bạn đang có một yêu cầu chờ duyệt. Hãy đợi quản trị viên xử lý trước khi gửi yêu cầu mới.".
  - Số có thể rút dưới 100.000đ: ô nhập và các nút mờ, dòng "Cần có ít nhất 100.000đ có thể rút để gửi yêu cầu.".
  - Chưa nhập số tiền: "Vui lòng nhập số tiền muốn rút". Dưới 100.000đ: "Số tiền rút tối thiểu là 100.000đ". Lớn hơn số có thể rút: "Số tiền rút không được lớn hơn số tiền có thể rút (1.250.000đ)". Các lỗi này hiện chữ đỏ dưới ô.
- Hợp lệ: trong một giao dịch, khóa dòng nguoi_cung_cap bằng SELECT … FOR UPDATE, tính lại số có thể rút, thêm yeu_cau_rut_tien 'Chờ duyệt' với so_tien và bản chép ten_ngan_hang, so_tai_khoan, chu_tai_khoan lúc đó. Mỗi người cung cấp chỉ một yêu cầu 'Chờ duyệt' (cột nguoi_cung_cap_dang_cho_duyet có ràng buộc không trùng).
- Gửi xong: dòng xanh "Đã gửi yêu cầu rút tiền. Số tiền được giữ lại ở mục Đang chờ duyệt rút.", các thẻ ví cập nhật.
- Tài khoản bị khóa thì không đăng nhập được; máy chủ vẫn kiểm và từ chối (ví bị đóng băng).

## 17.6 Lịch sử yêu cầu
- Bảng "Lịch sử yêu cầu": Ngày gửi (dd/mm/yyyy HH:mm), Số tiền, Trạng thái ("Chờ duyệt", "Đã chuyển", "Từ chối"; dòng "Đã chuyển" có mã giao dịch thì thêm dòng nhỏ "Mã giao dịch: …"), Lý do từ chối (không có thì "-"). Mới nhất ở trên, 10 dòng mỗi trang. Chưa có yêu cầu nào thì hiện "Chưa có yêu cầu rút tiền nào.".
- Ô trống trong bảng hiện gạch ngắn "-" như thiết kế.

## 17.7 Đường xử lý ở máy chủ (chỉ người cung cấp)
- GET /api/nguoi-cung-cap/vi?trang=: bốn con số và một trang "Doanh thu gần đây".
- PUT /api/nguoi-cung-cap/thong-tin-nhan-tien: nhận { ten_ngan_hang, so_tai_khoan, chu_tai_khoan } (cả ba null để xóa). Máy chủ tự đổi tên chủ tài khoản sang in hoa không dấu và kiểm ngân hàng thuộc danh sách 15.
- POST /api/nguoi-cung-cap/rut-tien: nhận { so_tien }.
- GET /api/nguoi-cung-cap/rut-tien?trang=: thông tin nhận tiền, số có thể rút, có yêu cầu chờ không, lịch sử yêu cầu.

## 17.8 Bảng dữ liệu dùng
- chi_tiet_don_hang, don_hang, giao_dich_thanh_toan, khoa_hoc, yeu_cau_rut_tien, nguoi_cung_cap.

## 17.9 Câu thông báo
- "Vui lòng nhập thông tin nhận tiền trước khi rút"
- "Bạn đang có một yêu cầu chờ duyệt. Hãy đợi quản trị viên xử lý trước khi gửi yêu cầu mới."
- "Cần có ít nhất 100.000đ có thể rút để gửi yêu cầu."
- "Vui lòng nhập số tiền muốn rút", "Số tiền rút tối thiểu là 100.000đ", "Số tiền rút không được lớn hơn số tiền có thể rút (…)"
- "Đã gửi yêu cầu rút tiền. Số tiền được giữ lại ở mục Đang chờ duyệt rút."
- "Vui lòng nhập đủ ngân hàng, số tài khoản và tên chủ tài khoản", "Số tài khoản gồm 6 đến 20 chữ số", "Đã lưu thông tin nhận tiền"
- "Chưa có lượt bán nào.", "Chưa có yêu cầu rút tiền nào."

## 17.10 Kiểm tra khi làm xong
- Một lượt bán 299.000đ nguồn 'Giới thiệu': "Bạn nhận" 269.100đ, nằm ở "Đang tạm giữ" trong 7 ngày đầu. Sửa tay thoi_diem_nhan_ket_qua lùi 8 ngày: tiền sang "Có thể rút".
- Admin hoàn tiền lượt đó: dòng hiện "0đ (Đã hoàn tiền)", "Đang tạm giữ" giảm.
- Gửi yêu cầu 500.000đ: "Có thể rút" giảm 500.000đ, "Đang chờ duyệt rút" tăng. Gửi tiếp yêu cầu thứ hai: bị chặn. Admin từ chối: tiền quay lại "Có thể rút".
- Gõ tên chủ tài khoản "Đỗ Văn Đức": lưu thành "DO VAN DUC".
- Danh sách kiểm thử đầy đủ: docs/kiem_thu/phan_17_vi_rut_tien.md
