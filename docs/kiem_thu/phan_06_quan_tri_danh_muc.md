# Danh sách kiểm thử Phần 6. Quản trị danh mục

- Đặc tả: docs/dac_ta/phan_06_quan_tri_danh_muc.md
- Code kiểm thử tự động: backend/tests/phan_06_quan_tri_danh_muc.test.js
- Cách kiểm: "Tự động" là Claude Code viết code kiểm thử và chạy bằng npm test; "Bấm tay" là người dùng mở web và làm theo các bước.
- Dữ liệu chung: admin kiểm thử; một người cung cấp có họ tên, số điện thoại để tạo khóa mẫu trực tiếp trong database.

## P06-01 Thêm danh mục và chuẩn hóa tên
- Mục tiêu: bỏ khoảng trắng thừa, viết hoa chữ đầu mỗi từ, giữ nguyên các chữ khác.
- Dữ liệu: "  luyện   thi IELTS ".
- Các bước: admin gọi POST /api/quan-tri/danh-muc.
- Kết quả mong đợi: thành công; danh_muc.ten là "Luyện Thi IELTS".
- Cách kiểm: Tự động
- Nguồn: Phần 6 mục 6.4, 6.6, 6.9

## P06-02 Trùng không phân biệt hoa thường và dấu
- Mục tiêu: "LUYEN THI ielts" trùng "Luyện Thi IELTS"; "nau an" trùng "Nấu Ăn".
- Dữ liệu: đã có "Luyện Thi IELTS", "Nấu Ăn".
- Các bước: thêm "LUYEN THI ielts"; thêm "nau an".
- Kết quả mong đợi: đều bị từ chối với "Tên danh mục đã tồn tại"; không thêm dòng.
- Cách kiểm: Tự động
- Nguồn: Phần 6 mục 6.4, 6.8, 6.9

## P06-03 Tên sai luật
- Mục tiêu: chỉ nhận 2 đến 50 ký tự, chữ, số, khoảng trắng và + # . / -.
- Dữ liệu: "A"; chuỗi 51 ký tự; "Lập trình @Web"; "Thiết kế_UI". Biên đúng: "C++", "UI/UX", "3D", "C#".
- Các bước: thêm từng tên.
- Kết quả mong đợi: các tên sai báo "Tên danh mục từ 2 đến 50 ký tự, gồm chữ có dấu hoặc không dấu, chữ số, khoảng trắng và các ký tự + # . / -"; các tên biên đúng được thêm.
- Cách kiểm: Tự động
- Nguồn: Phần 6 mục 6.4, 6.8

## P06-04 Sửa tên, kể cả đổi hoa thường của chính nó
- Mục tiêu: đổi tên của chính nó không bị coi là trùng; đổi tên không ghi lịch sử khóa.
- Dữ liệu: danh mục "Thiết kế" có 1 khóa.
- Các bước: gọi PUT /api/quan-tri/danh-muc/:id với "Thiết Kế"; rồi với tên trùng một danh mục khác.
- Kết quả mong đợi: lần một thành công, tên "Thiết Kế", lich_su_khoa_hoc không thêm dòng; lần hai báo "Tên danh mục đã tồn tại".
- Cách kiểm: Tự động
- Nguồn: Phần 6 mục 6.4, 6.6, 6.9

## P06-05 Số khóa đếm cả bốn loại
- Mục tiêu: đếm khóa đang bán, bị ẩn, bị gỡ vĩnh viễn và đã xóa.
- Dữ liệu: danh mục X có 4 khóa: 1 'Đang bán', 1 'Bị ẩn', 1 'Bị gỡ vĩnh viễn', 1 da_xoa = 1.
- Các bước: gọi GET /api/quan-tri/danh-muc.
- Kết quả mong đợi: dòng X có số khóa 4; danh sách sắp theo tên; 20 dòng mỗi trang.
- Cách kiểm: Tự động
- Nguồn: Phần 6 mục 6.3, 6.6; Phần chung C16

## P06-06 Xóa danh mục
- Mục tiêu: chỉ xóa được danh mục không có khóa nào.
- Dữ liệu: danh mục X ở P06-05; danh mục Y không có khóa.
- Các bước: gọi DELETE /api/quan-tri/danh-muc/:id với X rồi với Y.
- Kết quả mong đợi: X trả 409, còn nguyên; Y xóa được.
- Cách kiểm: Tự động
- Nguồn: Phần 6 mục 6.5, 6.6

## P06-07 Gộp vào tên của một danh mục đang tích
- Mục tiêu: giữ danh mục đó, dồn danh mục kia vào, ghi lịch sử từng khóa.
- Dữ liệu: đúng ví dụ 6.5: "Nấu Ăn" có Bánh Mì (đã xóa) và Món Chay (bị gỡ vĩnh viễn); "Nấu Ăn Gia Đình" có Cơm Nhà và Lẩu (đang bán).
- Các bước: gọi POST /api/quan-tri/danh-muc/gop với hai id và ten_moi "nấu ăn".
- Kết quả mong đợi: còn danh mục "Nấu Ăn" (cùng id cũ), cả 4 khóa thuộc danh mục này; "Nấu Ăn Gia Đình" bị xóa; Cơm Nhà và Lẩu mỗi khóa có một dòng lich_su_khoa_hoc 'Quản trị viên gộp danh mục' với id_nguoi_dung là admin, gia_tri_cu "Nấu Ăn Gia Đình", gia_tri_moi "Nấu Ăn".
- Cách kiểm: Tự động
- Nguồn: Phần 6 mục 6.5, 6.9

## P06-08 Gộp thành tên mới hoàn toàn
- Mục tiêu: tạo danh mục mới, chuyển mọi khóa kể cả đã xóa và bị gỡ.
- Dữ liệu: làm lại dữ liệu ví dụ 6.5.
- Các bước: gộp hai danh mục với ten_moi "Ẩm Thực".
- Kết quả mong đợi: có danh mục mới "Ẩm Thực" chứa cả 4 khóa; hai danh mục cũ bị xóa; mỗi khóa có một dòng lịch sử gộp danh mục với tên cũ tương ứng và tên mới "Ẩm Thực".
- Cách kiểm: Tự động
- Nguồn: Phần 6 mục 6.5, 6.9

## P06-09 Gộp bị từ chối
- Mục tiêu: tên mới không được trùng danh mục không tích; cần ít nhất 2 danh mục.
- Dữ liệu: các danh mục A, B, C.
- Các bước: gộp A, B với ten_moi là tên của C; gộp chỉ một id; gộp với tên sai luật.
- Kết quả mong đợi: lần một báo "Tên danh mục đã tồn tại"; lần hai và ba bị từ chối; không danh mục nào thay đổi (giao dịch không làm dở).
- Cách kiểm: Tự động
- Nguồn: Phần 6 mục 6.5, 6.6

## P06-10 Chỉ admin dùng được
- Mục tiêu: phân quyền đường quản trị.
- Dữ liệu: học viên, người cung cấp, khách.
- Các bước: gọi GET, POST /api/quan-tri/danh-muc.
- Kết quả mong đợi: học viên và người cung cấp 403, khách 401.
- Cách kiểm: Tự động
- Nguồn: Phần 6 mục 6.6; Phần chung C5

## P06-11 Danh sách danh mục cho người đã đăng nhập
- Mục tiêu: GET /api/danh-muc trả mọi danh mục sắp theo tên.
- Dữ liệu: 3 danh mục, một danh mục không có khóa.
- Các bước: người cung cấp gọi GET /api/danh-muc; khách gọi.
- Kết quả mong đợi: người cung cấp nhận đủ 3 danh mục (id, tên) theo thứ tự tên; khách bị 401.
- Cách kiểm: Tự động
- Nguồn: Phần 6 mục 6.6

## P06-12 Trang quản trị danh mục
- Mục tiêu: giao diện và thao tác đúng thiết kế.
- Dữ liệu: như P06-05 và ví dụ 6.5.
- Các bước: mở /quan-tri/danh-muc; rê chuột vào "Xóa" của danh mục có khóa; bấm "Xóa" ở danh mục không có khóa; bấm "Gộp", tích hai danh mục, nhập tên mới.
- Kết quả mong đợi: bảng có Tên danh mục, Số khóa, Hành động ("Sửa tên", "Xóa"), nút "+ Thêm danh mục" và "Gộp"; nút "Xóa" mờ, rê chuột hiện "Danh mục đang có N khóa học"; hộp "Xóa danh mục này?" với dòng "Danh mục “Tên” sẽ bị xóa khỏi hệ thống. Hành động này không thể hoàn tác." và hai nút "Hủy", "Xóa danh mục"; chế độ gộp hiện ô tích, nút "Gộp" sáng khi tích từ hai danh mục, hộp "Gộp danh mục" có ô "Tên danh mục mới"; thông báo "Đã thêm danh mục", "Đã đổi tên danh mục", "Đã xóa danh mục", "Đã gộp danh mục"; giống thiet_ke/quan_tri_danh_muc/.
- Cách kiểm: Bấm tay
- Nguồn: Phần 6 mục 6.3, 6.8
