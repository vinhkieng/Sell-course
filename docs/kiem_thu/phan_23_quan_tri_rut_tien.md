# Danh sách kiểm thử Phần 23. Quản trị yêu cầu rút tiền

- Đặc tả: docs/dac_ta/phan_23_quan_tri_rut_tien.md
- Code kiểm thử tự động: backend/tests/phan_23_quan_tri_rut_tien.test.js
- Cách kiểm: "Tự động" là Claude Code viết code kiểm thử và chạy bằng npm test; "Bấm tay" là người dùng mở web và làm theo các bước.
- Dữ liệu chung: admin và admin thứ hai; người cung cấp "ncc01" (họ tên "Trần Thị Bích") có yêu cầu Y1 'Chờ duyệt' 500.000 với bản chép "Vietcombank", "0123456789", "TRAN THI BICH"; vài yêu cầu 'Đã chuyển' và 'Từ chối' cũ.

## P23-01 Danh sách và số đếm
- Mục tiêu: bốn lựa chọn kèm số, mới nhất ở trên, 20 dòng mỗi trang.
- Dữ liệu: dữ liệu chung.
- Các bước: gọi GET /api/quan-tri/rut-tien với từng trang_thai.
- Kết quả mong đợi: số đếm đúng; mỗi dòng có họ tên người cung cấp, số tiền, bản chép ngân hàng, số tài khoản, chủ tài khoản, ngày gửi, trạng thái, mã giao dịch hoặc lý do từ chối nếu có.
- Cách kiểm: Tự động
- Nguồn: Phần 23 mục 23.3, 23.5

## P23-02 Đã chuyển có mã giao dịch
- Mục tiêu: cập nhật yêu cầu, thông báo, ví.
- Dữ liệu: Y1.
- Các bước: gọi POST /api/quan-tri/rut-tien/<Y1>/da-chuyen với { ma_giao_dich "FT26101400123" }; ncc01 đọc ví và lịch sử yêu cầu.
- Kết quả mong đợi: 'Đã chuyển', ma_giao_dich_ngan_hang đúng, id_quan_tri_vien, ngay_xu_ly; một thông báo 'Đã chuyển tiền' kèm mã; ví: "Đã rút" tăng 500.000, "Đang chờ duyệt rút" 0; lịch sử hiện mã giao dịch.
- Cách kiểm: Tự động
- Nguồn: Phần 23 mục 23.4, 23.8

## P23-03 Đã chuyển không có mã
- Mục tiêu: mã bỏ trống thì NULL.
- Dữ liệu: một yêu cầu chờ khác; ma_giao_dich "".
- Các bước: gọi POST .../da-chuyen; thử mã 51 ký tự.
- Kết quả mong đợi: ma_giao_dich_ngan_hang NULL, thông báo dừng ở "đã được chuyển."; mã 51 ký tự bị từ chối.
- Cách kiểm: Tự động
- Nguồn: Phần 23 mục 23.3, 23.4; Phần 18 mục 18.4

## P23-04 Từ chối
- Mục tiêu: lý do bắt buộc; tiền quay lại; người cung cấp gửi được yêu cầu mới.
- Dữ liệu: một yêu cầu chờ 300.000.
- Các bước: gọi POST .../tu-choi với ly_do rỗng; 256 ký tự; "Tên chủ tài khoản không khớp"; ncc01 đọc ví rồi gửi yêu cầu mới.
- Kết quả mong đợi: rỗng báo "Vui lòng nhập lý do"; quá dài bị từ chối; lần đúng: 'Từ chối', ly_do_tu_choi, id_quan_tri_vien, ngay_xu_ly, thông báo 'Từ chối rút tiền' kèm lý do; "Có thể rút" tăng lại 300.000; gửi yêu cầu mới được.
- Cách kiểm: Tự động
- Nguồn: Phần 23 mục 23.3, 23.4, 23.8

## P23-05 Xử lý một lần
- Mục tiêu: hai admin cùng xử lý thì lần sau 409, chỉ một thông báo.
- Dữ liệu: một yêu cầu chờ.
- Các bước: hai admin gửi đồng thời "Đã chuyển" (hoặc một "Đã chuyển", một "Từ chối").
- Kết quả mong đợi: một lần thành công; lần kia 409 "Yêu cầu này đã được xử lý."; đúng một thông báo.
- Cách kiểm: Tự động
- Nguồn: Phần 23 mục 23.4, 23.8

## P23-06 Phân quyền
- Mục tiêu: chỉ admin.
- Dữ liệu: học viên, người cung cấp, khách.
- Các bước: gọi các đường của phần này.
- Kết quả mong đợi: 403 hoặc 401 tương ứng.
- Cách kiểm: Tự động
- Nguồn: Phần 23 mục 23.5

## P23-07 Trang yêu cầu rút tiền
- Mục tiêu: giao diện đúng thiết kế.
- Dữ liệu: dữ liệu chung.
- Các bước: mở /quan-tri/rut-tien; đổi bộ lọc; bấm "Đã chuyển"; bấm "Từ chối" gửi trống rồi có lý do.
- Kết quả mong đợi: dòng "Bản thử nghiệm: chuyển khoản chỉ mô phỏng", bốn lựa chọn kèm số, "Mới nhất ở trên"; cột Thông tin ngân hàng có "STK: …", "Chủ TK: …"; chỉ dòng chờ có hai nút; hộp "Xác nhận đã chuyển tiền" với "Bạn đã chuyển khoản cho người cung cấp này?", ô "Mã giao dịch ngân hàng (không bắt buộc)" gợi ý "Ví dụ: FT26101400123", dòng "Người cung cấp sẽ nhìn thấy mã này trong lịch sử yêu cầu."; hộp "Từ chối yêu cầu rút tiền?" với ô "Lý do từ chối *", hai dòng nhắc; xong có "Đã xác nhận chuyển tiền" hoặc "Đã từ chối yêu cầu", số tròn ở menu cập nhật; giống thiet_ke/quan_tri_rut_tien/yeu_cau_rut_tien.html.
- Cách kiểm: Bấm tay
- Nguồn: Phần 23 mục 23.3, 23.7
