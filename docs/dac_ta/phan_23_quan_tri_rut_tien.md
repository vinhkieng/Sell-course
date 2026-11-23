# PHẦN 23. QUẢN TRỊ - YÊU CẦU RÚT TIỀN

Làm sau Phần 22.

## 23.1 Mục đích và ai dùng
- Chỉ admin. Xem yêu cầu rút tiền, đánh dấu đã chuyển hoặc từ chối.

## 23.2 Màn thiết kế
- thiet_ke/quan_tri_rut_tien/yeu_cau_rut_tien.html (màn "Quản trị - Yêu cầu rút tiền"): danh sách yêu cầu, kèm hộp "Xác nhận đã chuyển tiền" và "Từ chối yêu cầu rút tiền?".

## 23.3 Giao diện và hành vi
- Dòng "Bản thử nghiệm: chuyển khoản chỉ mô phỏng". Bốn lựa chọn lọc kèm số: "Tất cả", "Chờ duyệt", "Đã chuyển", "Từ chối". Dòng "Mới nhất ở trên".
- Cột: Người cung cấp (họ tên trong hồ sơ, để admin so với tên chủ tài khoản), Số tiền, Thông tin ngân hàng (bản chép lúc gửi: tên ngân hàng, "STK: [số tài khoản]", "Chủ TK: [chủ tài khoản]" in hoa không dấu như đã lưu), Ngày gửi, Trạng thái ("Chờ duyệt"; "Đã chuyển" kèm "Mã giao dịch: [mã giao dịch]" nếu có; "Từ chối" kèm "Lý do từ chối: [lý do từ chối]"), Hành động (chỉ dòng "Chờ duyệt" có nút "Đã chuyển" và "Từ chối").
- 20 dòng mỗi trang, "Hiển thị 1-10 trên 10 yêu cầu (20 dòng mỗi trang)" (đổi chữ theo bộ lọc như thiết kế).
- Hộp "Xác nhận đã chuyển tiền": dòng "Bạn đã chuyển khoản cho người cung cấp này?", ô "Mã giao dịch ngân hàng (không bắt buộc)" (gợi ý "Ví dụ: FT26101400123", tối đa 50 ký tự), dòng "Người cung cấp sẽ nhìn thấy mã này trong lịch sử yêu cầu.", nút "Hủy" và "Đã chuyển".
- Hộp "Từ chối yêu cầu rút tiền?": ô "Lý do từ chối *" (bắt buộc, tối đa 255 ký tự, bỏ trống báo "Vui lòng nhập lý do"), dòng "Người cung cấp sẽ nhìn thấy lý do này." và "Số tiền sẽ quay lại mục có thể rút.", nút "Hủy" và "Từ chối".
- Admin so tên chủ tài khoản với họ tên người cung cấp, không khớp thì từ chối. Admin cũng từ chối khi nghi gian lận.
- Xong thì ô thông báo nhỏ "Đã xác nhận chuyển tiền" hoặc "Đã từ chối yêu cầu", bảng và số tròn ở menu cập nhật.

## 23.4 Quy tắc
- Mỗi yêu cầu chỉ xử lý một lần: câu cập nhật có điều kiện trang_thai = 'Chờ duyệt'; không dòng nào được cập nhật (admin khác vừa xử lý) thì trả 409 "Yêu cầu này đã được xử lý.".
- Đã chuyển: trang_thai 'Đã chuyển', ma_giao_dich_ngan_hang (bỏ trống thì NULL), id_quan_tri_vien, ngay_xu_ly = NOW(); thông báo 'Đã chuyển tiền'. Số tiền chuyển sang "Đã rút" trong ví.
- Từ chối: trang_thai 'Từ chối', ly_do_tu_choi, id_quan_tri_vien, ngay_xu_ly = NOW(); thông báo 'Từ chối rút tiền'. Số tiền quay lại "Có thể rút".
- Thông báo tạo trong cùng giao dịch (Phần 18).
- Yêu cầu tự bị từ chối khi khóa tài khoản người cung cấp: Phần 21.

## 23.5 Đường xử lý ở máy chủ (chỉ admin)
- GET /api/quan-tri/rut-tien?trang_thai=tat-ca|cho-duyet|da-chuyen|tu-choi&trang=.
- POST /api/quan-tri/rut-tien/:id/da-chuyen: nhận { ma_giao_dich }.
- POST /api/quan-tri/rut-tien/:id/tu-choi: nhận { ly_do }.

## 23.6 Bảng dữ liệu dùng
- yeu_cau_rut_tien, nguoi_cung_cap, nguoi_dung, thong_bao.

## 23.7 Câu thông báo
- "Bản thử nghiệm: chuyển khoản chỉ mô phỏng"
- "Xác nhận đã chuyển tiền", "Bạn đã chuyển khoản cho người cung cấp này?", "Người cung cấp sẽ nhìn thấy mã này trong lịch sử yêu cầu."
- "Từ chối yêu cầu rút tiền?", "Người cung cấp sẽ nhìn thấy lý do này.", "Số tiền sẽ quay lại mục có thể rút.", "Vui lòng nhập lý do"
- "Đã xác nhận chuyển tiền", "Đã từ chối yêu cầu", "Yêu cầu này đã được xử lý."

## 23.8 Kiểm tra khi làm xong
- Bấm "Đã chuyển" có mã: người cung cấp nhận thông báo kèm mã, ví chuyển số tiền sang "Đã rút", lịch sử yêu cầu hiện "Mã giao dịch: [mã giao dịch]".
- Từ chối: người cung cấp nhận thông báo kèm lý do, tiền quay lại "Có thể rút", người cung cấp gửi được yêu cầu mới.
- Hai admin cùng bấm "Đã chuyển" một yêu cầu: lần sau nhận "Yêu cầu này đã được xử lý.", chỉ có một thông báo.
- Danh sách kiểm thử đầy đủ: docs/kiem_thu/phan_23_quan_tri_rut_tien.md
