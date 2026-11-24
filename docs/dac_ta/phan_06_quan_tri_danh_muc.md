# PHẦN 6. QUẢN TRỊ - DANH MỤC

Làm sau Phần 5. Làm sớm vì người cung cấp cần danh mục khi tạo khóa (Phần 7).

## 6.1 Mục đích và ai dùng
- Admin thêm, sửa tên, xóa và gộp danh mục. Danh mục cũng được tạo khi người cung cấp đăng khóa với lựa chọn "Khác" (Phần 7).

## 6.2 Màn thiết kế
- thiet_ke/quan_tri_danh_muc/danh_muc.html (màn "Quản trị - Danh mục"): trang Danh mục, kèm các hộp "Thêm danh mục", "Sửa tên danh mục", "Xóa danh mục này?".
- thiet_ke/quan_tri_danh_muc/danh_muc_gop.html (màn "Quản trị - Danh mục (gộp)"): chế độ gộp (tích chọn danh mục) và hộp "Gộp danh mục".

## 6.3 Giao diện và hành vi
- Bảng: Tên danh mục, Số khóa, Hành động ("Sửa tên", "Xóa"). Đầu trang có nút "+ Thêm danh mục" và nút "Gộp". Sắp theo tên. 20 dòng mỗi trang.
- Cột "Số khóa" đếm mọi khóa thuộc danh mục ở cả bốn loại: đang bán, bị ẩn, bị gỡ vĩnh viễn và đã xóa.
- Nút "Xóa" bị mờ khi số khóa lớn hơn 0; rê chuột hiện "Danh mục đang có N khóa học". Số khóa bằng 0 thì bấm "Xóa" mở hộp "Xóa danh mục này?" với dòng "Danh mục "Tên" sẽ bị xóa khỏi hệ thống. Hành động này không thể hoàn tác." và hai nút "Hủy", "Xóa danh mục".
- Bấm "Gộp": mỗi dòng hiện ô tích; tích ít nhất hai danh mục thì nút "Gộp" sáng; bấm thì mở hộp "Gộp danh mục" có ô "Tên danh mục mới".

## 6.4 Quy tắc tên danh mục (dùng chung với Phần 7)
- 2 đến 50 ký tự; chỉ gồm chữ có dấu hoặc không dấu, chữ số, khoảng trắng và các ký tự + # . / - (ví dụ "C++", "UI/UX", "3D"). "Chữ" ở đây chỉ gồm chữ cái a-z (hoa hoặc thường) và chữ tiếng Việt có dấu (kể cả đ, Đ); không nhận chữ nước ngoài khác (ví dụ "中文", "Ж", "ñ"). Chữ số là 0-9.
- Tự bỏ khoảng trắng ở đầu, cuối và khoảng trắng thừa ở giữa; tự viết hoa chữ đầu của mọi từ (từ cách nhau bằng dấu cách), các chữ khác giữ nguyên ("luyện thi IELTS" thành "Luyện Thi IELTS").
- Không trùng danh mục đã có khi so không phân biệt chữ hoa chữ thường và không phân biệt dấu ("Nấu ăn" và "nau an" là trùng). Cột danh_muc.ten dùng bảng mã so sánh utf8mb4_0900_ai_ci nên câu SELECT … WHERE ten = ? và ràng buộc không trùng của MySQL đã tự so như vậy.
- Sửa tên mà giữ nguyên tên cũ (chỉ đổi hoa thường hoặc dấu của chính nó) thì không bị coi là trùng.

## 6.5 Quy tắc xóa và gộp
- Chỉ xóa được danh mục có số khóa bằng 0 (máy chủ kiểm tra lại).
- Gộp: tên mới theo luật tên ở 6.4. Tên mới có thể là tên mới hoàn toàn hoặc tên của một trong các danh mục đang tích, nhưng không được trùng một danh mục không được tích.
- Làm tất cả trong một giao dịch: nếu tên mới trùng một danh mục đang tích thì giữ lại danh mục đó (đổi theo cách viết mới) và dồn các danh mục kia vào; nếu là tên mới hoàn toàn thì tạo danh mục mới và dồn tất cả vào. Mọi khóa của các danh mục bị gộp đều được chuyển sang, kể cả khóa đã xóa và khóa bị gỡ vĩnh viễn. Chỉ khóa thật sự chuyển sang danh mục khác mới ghi lịch sử: khóa vốn đã nằm trong danh mục được giữ lại không ghi dòng nào, kể cả khi danh mục đó đổi cách viết (giống đổi tên ở 6.6). Mỗi khóa được chuyển ghi một dòng lịch sử 'Quản trị viên gộp danh mục' (id_nguoi_dung là admin, gia_tri_cu là tên danh mục cũ, gia_tri_moi là tên danh mục mới). Các danh mục cũ bị xóa.
- Ví dụ: "Nấu Ăn" có khóa Bánh Mì (đã xóa) và Món Chay (bị gỡ vĩnh viễn); "Nấu Ăn Gia Đình" có Cơm Nhà và Lẩu (đang bán). Gộp thành "Nấu Ăn" thì giữ Nấu Ăn, chuyển Cơm Nhà và Lẩu sang, xóa Nấu Ăn Gia Đình. Gộp thành "Ẩm Thực" thì chuyển cả bốn khóa sang danh mục mới và xóa cả hai danh mục cũ.

## 6.6 Đường xử lý ở máy chủ (chỉ admin)
- GET /api/quan-tri/danh-muc?trang=: danh sách kèm số khóa.
- POST /api/quan-tri/danh-muc: nhận ten. Chuẩn hóa tên, kiểm tra, thêm.
- PUT /api/quan-tri/danh-muc/:id: nhận ten. Đổi tên danh mục không ghi lịch sử khóa học.
- DELETE /api/quan-tri/danh-muc/:id: còn khóa thì trả 409.
- POST /api/quan-tri/danh-muc/gop: nhận danh sách id (ít nhất 2) và ten_moi.
- GET /api/danh-muc (mọi người dùng đã đăng nhập, dùng ở Phần 7): danh sách mọi danh mục (id, tên) sắp theo tên.

## 6.7 Bảng dữ liệu dùng
- danh_muc: id, ten (không trùng theo cách so ở 6.4).
- khoa_hoc: id_danh_muc (đếm số khóa, chuyển danh mục khi gộp).
- lich_su_khoa_hoc: dòng 'Quản trị viên gộp danh mục'.

## 6.8 Câu thông báo
- "Tên danh mục đã tồn tại"
- "Tên danh mục từ 2 đến 50 ký tự, gồm chữ có dấu hoặc không dấu, chữ số, khoảng trắng và các ký tự + # . / -"
- "Danh mục đang có N khóa học"
- "Danh mục không còn tồn tại." (danh mục vừa bị xóa hoặc gộp ở nơi khác)
- Thành công: "Đã thêm danh mục", "Đã đổi tên danh mục", "Đã xóa danh mục", "Đã gộp danh mục".

## 6.9 Kiểm tra khi làm xong
- Thêm "luyện thi IELTS" lưu thành "Luyện Thi IELTS"; thêm tiếp "LUYEN THI ielts" bị báo trùng.
- Đổi tên "Thiết kế" thành "Thiết Kế" (chính nó) không bị báo trùng.
- Làm lại đúng ví dụ gộp ở 6.5 và xem lịch sử của từng khóa có dòng gộp danh mục.
- Danh sách kiểm thử đầy đủ: docs/kiem_thu/phan_06_quan_tri_danh_muc.md
