# Danh sách kiểm thử Phần 12. Giỏ hàng

- Đặc tả: docs/dac_ta/phan_12_gio_hang.md
- Code kiểm thử tự động: backend/tests/phan_12_gio_hang.test.js
- Cách kiểm: "Tự động" là Claude Code viết code kiểm thử và chạy bằng npm test; "Bấm tay" là người dùng mở web và làm theo các bước.
- Dữ liệu chung: học viên "hv01" đã mua K9; khóa K1, K2, K3 'Đang bán'; K4 'Bị ẩn'; K5 'Bị gỡ vĩnh viễn'; K6 đã xóa; người cung cấp "ncc01"; admin.

## P12-01 Thêm vào giỏ
- Mục tiêu: học viên thêm khóa đang bán.
- Dữ liệu: hv01, K1.
- Các bước: gọi POST /api/gio-hang với K1; gọi lại lần nữa.
- Kết quả mong đợi: lần một thành công, có dòng gio_hang; lần hai 409 "Khóa học đã có trong giỏ hàng", không thêm dòng.
- Cách kiểm: Tự động
- Nguồn: Phần 12 mục 12.4, 12.5, 12.7

## P12-02 Không thêm khóa không bán hoặc đã sở hữu
- Mục tiêu: chỉ khóa 'Đang bán'; không thêm khóa đang có quyền học.
- Dữ liệu: K4, K5, K6, K9.
- Các bước: gọi POST /api/gio-hang với từng khóa.
- Kết quả mong đợi: K4, K5, K6 bị từ chối; K9 trả 409 "Bạn đã sở hữu khóa học này".
- Cách kiểm: Tự động
- Nguồn: Phần 12 mục 12.4, 12.7

## P12-03 Xem giỏ và trạng thái từng khóa
- Mục tiêu: giá hiện tại, trạng thái mua được, không còn bán, đã sở hữu; khóa đã xóa tự biến mất.
- Dữ liệu: giỏ hv01 có K1, K4 (thêm trước khi bị ẩn), K6 (thêm trước khi bị xóa), K9 (thêm trước khi mua); đổi giá K1 sau khi thêm.
- Các bước: gọi GET /api/gio-hang.
- Kết quả mong đợi: có K1 (mua được, giá mới), K4 (không còn bán), K9 (đã sở hữu); không có K6 và dòng gio_hang của K6 đã bị xóa.
- Cách kiểm: Tự động
- Nguồn: Phần 12 mục 12.3, 12.4, 12.5

## P12-04 Xóa một khóa và xóa tất cả
- Mục tiêu: có tác dụng ngay.
- Dữ liệu: giỏ có K1, K2, K3.
- Các bước: gọi DELETE /api/gio-hang/<K1>; gọi DELETE /api/gio-hang.
- Kết quả mong đợi: sau lần một còn K2, K3; sau lần hai giỏ trống.
- Cách kiểm: Tự động
- Nguồn: Phần 12 mục 12.3, 12.5

## P12-05 Gộp giỏ tạm
- Mục tiêu: không trùng, bỏ id không tồn tại hoặc đã xóa, vẫn gộp khóa không còn bán hoặc đã sở hữu.
- Dữ liệu: giỏ hv01 có K1; giỏ tạm [K1, K2, K4, K9, K6, 99999].
- Các bước: gọi POST /api/gio-hang/gop.
- Kết quả mong đợi: giỏ có K1 (một dòng), K2, K4, K9; không có K6, 99999.
- Cách kiểm: Tự động
- Nguồn: Phần 12 mục 12.3, 12.5, 12.8

## P12-06 Xem giỏ tạm của khách
- Mục tiêu: không cần đăng nhập, trả thông tin hiện tại.
- Dữ liệu: [K1, K4, K6].
- Các bước: gọi POST /api/gio-hang/xem-tam không có phiên.
- Kết quả mong đợi: K1 mua được với giá hiện tại; K4 không còn bán; K6 không có.
- Cách kiểm: Tự động
- Nguồn: Phần 12 mục 12.4, 12.5

## P12-07 Người cung cấp, admin và khách gọi API giỏ
- Mục tiêu: chỉ học viên có giỏ trong cơ sở dữ liệu.
- Dữ liệu: ncc01, admin, khách.
- Các bước: gọi GET, POST /api/gio-hang và POST /api/gio-hang/gop.
- Kết quả mong đợi: ncc01 và admin 403; khách 401.
- Cách kiểm: Tự động
- Nguồn: Phần 12 mục 12.5, 12.8; Phần chung C5, C6

## P12-08 Thêm vào giỏ trên trang
- Mục tiêu: thông báo, nút và số trên giỏ đổi đúng.
- Dữ liệu: học viên và khách, K1.
- Các bước: bấm "Thêm vào giỏ hàng".
- Kết quả mong đợi: ô thông báo "Đã thêm vào giỏ hàng"; nút đổi thành "Đã có trong giỏ - Xem giỏ hàng"; số trên biểu tượng giỏ tăng; khách thì khóa nằm trong localStorage, tải lại trang vẫn còn.
- Cách kiểm: Bấm tay
- Nguồn: Phần 12 mục 12.3

## P12-09 Trang giỏ hàng
- Mục tiêu: giao diện và tích chọn đúng.
- Dữ liệu: giỏ có K1, K2, K4, K9.
- Các bước: mở /gio-hang; bấm "Chọn tất cả"; bỏ tích hết; tích K1; bấm "Xóa tất cả" rồi "Hủy"; bấm "Xóa" ở K4.
- Kết quả mong đợi: "Bạn có 4 khóa học trong giỏ hàng."; không khóa nào được tích sẵn; "Chọn tất cả (2)" (chỉ K1, K2 tích được); K4 nhãn "Không còn bán", K9 "Bạn đã sở hữu khóa học này", hai dòng mờ, không tích được; chưa tích thì nút "Mua" mờ kèm "Hãy chọn ít nhất một khóa học"; khung tóm tắt "Đã chọn N khóa học", giá, "Tổng tiền" đúng; hộp "Xóa tất cả khóa học khỏi giỏ hàng?"; giống các màn thiet_ke/gio_hang/.
- Cách kiểm: Bấm tay
- Nguồn: Phần 12 mục 12.3, 12.7, 12.8

## P12-10 Giỏ trống
- Mục tiêu: trạng thái rỗng.
- Dữ liệu: giỏ trống.
- Các bước: mở /gio-hang.
- Kết quả mong đợi: "Giỏ hàng của bạn đang trống", nút "Khám phá khóa học".
- Cách kiểm: Bấm tay
- Nguồn: Phần 12 mục 12.3, 12.7

## P12-11 Bấm "Mua" và "Mua ngay"
- Mục tiêu: học viên sang trang đơn hàng; khách sang đăng nhập.
- Dữ liệu: học viên tích K1, K2; khách có giỏ tạm.
- Các bước: học viên bấm "Mua"; học viên bấm "Mua ngay" ở trang chi tiết K3; khách bấm "Mua"; khách bấm "Mua ngay" ở K3.
- Kết quả mong đợi: học viên sang /thong-tin-don-hang với K1, K2; "Mua ngay" sang /thong-tin-don-hang với đúng K3, giỏ không đổi; khách chuyển sang /dang-nhap?tu=mua&quay_lai=/gio-hang với dòng "Vui lòng đăng nhập để mua khóa học", giỏ tạm giữ nguyên; khách "Mua ngay" chuyển sang /dang-nhap?tu=mua&quay_lai=/thong-tin-don-hang?mua_ngay=<K3>.
- Cách kiểm: Bấm tay
- Nguồn: Phần 12 mục 12.3, 12.7

## P12-12 Đăng nhập khi có giỏ tạm
- Mục tiêu: gộp với học viên; xóa với người cung cấp, admin.
- Dữ liệu: khách thêm K1, K2; học viên hv02 đã có K1 trong giỏ.
- Các bước: khách bấm "Mua", đăng nhập bằng hv02; làm lại, đăng nhập bằng ncc01; làm lại với "Mua ngay" K3 rồi đăng nhập hv02.
- Kết quả mong đợi: hv02 quay lại /gio-hang, giỏ có K1, K2 không trùng, không khóa nào được tích, giỏ tạm bị xóa; ncc01 thấy ô thông báo "Tài khoản này không mua được khóa học", giỏ tạm bị xóa, đi tiếp như đăng nhập bình thường; "Mua ngay" thì hv02 đi thẳng tới trang Thông tin đơn hàng của K3.
- Cách kiểm: Bấm tay
- Nguồn: Phần 12 mục 12.3, 12.7, 12.8
