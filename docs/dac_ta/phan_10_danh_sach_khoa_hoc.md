# PHẦN 10. DANH SÁCH KHÓA HỌC, TÌM KIẾM, LỌC, SẮP XẾP

Làm sau Phần 9.

## 10.1 Mục đích và ai dùng
- Mọi người, kể cả khách.

## 10.2 Màn thiết kế
- thiet_ke/danh_sach_khoa_hoc/chua_dang_nhap.html (màn "Danh sách khóa học (chưa đăng nhập)"): danh sách khi chưa đăng nhập.
- thiet_ke/danh_sach_khoa_hoc/da_dang_nhap.html (màn "Danh sách khóa học (đã đăng nhập)"): danh sách khi đã đăng nhập.
- thiet_ke/danh_sach_khoa_hoc/dang_loc.html (màn "Danh sách khóa học (đang lọc)"): đang lọc (có bảng bộ lọc bên trái).
- thiet_ke/danh_sach_khoa_hoc/khong_co_ket_qua.html (màn "Danh sách khóa học (không có kết quả)"): không có kết quả.

## 10.3 Giao diện và hành vi
- Trang /khoa-hoc. Tiêu đề và đường dẫn trên cùng ghi "Khóa học nổi bật" như thiết kế; khi có từ khóa tìm kiếm thì tiêu đề là "Kết quả cho "từ khóa"".
- Dòng "Hiển thị N khóa học" (N là tổng số khóa thỏa điều kiện). Ô "Sắp xếp": Nhiều học viên nhất (mặc định), Mới nhất, Giá thấp đến cao, Giá cao đến thấp, Nhiều bài nhất. Hai khóa bằng nhau theo cách đang sắp thì khóa mới hơn đứng trước.
- Bảng "Bộ lọc": Danh mục (tích một hoặc nhiều, chỉ liệt kê danh mục đang có khóa đang bán), Giá bán (Dưới 200.000đ, 200.000đ - 500.000đ, Trên 500.000đ, hoặc tự nhập "Từ" "Đến"), nút "Áp dụng bộ lọc", "Xóa tất cả" bỏ mọi bộ lọc. Bộ lọc dùng chung được với nhau và với tìm kiếm.
- Mọi lựa chọn ghi lên đường dẫn (?tu_khoa=&danh_muc=1,3&gia=duoi-200|200-500|tren-500|<từ>-<đến>&sap_xep=&trang=) để tải lại trang hoặc chia sẻ vẫn giữ nguyên.
- 9 khóa mỗi trang, có phân trang. Thẻ khóa học như Phần 9.
- Không có kết quả: "Không tìm thấy khóa học phù hợp", "Hãy thử đổi từ khóa hoặc bỏ bớt bộ lọc", nút "Xóa bộ lọc".

## 10.4 Quy tắc
- Chỉ hiện khóa 'Đang bán', chưa xóa, người cung cấp không bị khóa.
- Tìm kiếm: khóa khớp khi từ khóa nằm trong tên khóa hoặc tên danh mục, không phân biệt chữ hoa chữ thường và không phân biệt dấu (gõ "lap trinh" ra "Lập trình"; "do hoa" ra "Đồ Họa"). Hai cột ten_khoa_hoc và danh_muc.ten dùng bảng mã so sánh utf8mb4_0900_ai_ci nên câu LIKE '%…%' đã tự so như vậy. Từ khóa để trống thì không tìm (Phần chung C9).
- Giá: "Dưới 200.000đ" là nhỏ hơn 200.000; "200.000đ - 500.000đ" là từ 200.000 tới 500.000; "Trên 500.000đ" là lớn hơn 500.000; tự nhập thì lấy từ "Từ" tới "Đến" (được bỏ trống một đầu; nhập "Từ" lớn hơn "Đến" thì báo "Khoảng giá không hợp lệ" và không lọc).
- Số học viên, số bài, điểm: như Phần 9 mục 9.4.

## 10.5 Đường xử lý ở máy chủ
- GET /api/khoa-hoc?tu_khoa=&danh_muc=&gia_tu=&gia_den=&sap_xep=nhieu-hoc-vien|moi-nhat|gia-tang|gia-giam|nhieu-bai&trang=: trả danh sách 9 khóa của trang đó và tổng số.

## 10.6 Bảng dữ liệu dùng
- Như Phần 9.

## 10.7 Kiểm tra khi làm xong
- Gõ "lap trinh" ra các khóa có chữ "Lập trình" trong tên hoặc thuộc danh mục "Lập Trình".
- Lọc hai danh mục cùng khoảng giá cùng từ khóa cho đúng kết quả; tải lại trang vẫn giữ bộ lọc.
- Ô tìm kiếm để trống bấm Enter không đổi trang.
- Danh sách kiểm thử đầy đủ: docs/kiem_thu/phan_10_danh_sach_khoa_hoc.md
