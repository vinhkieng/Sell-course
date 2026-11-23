# Danh sách kiểm thử Phần 10. Danh sách, tìm kiếm, lọc khóa học

- Đặc tả: docs/dac_ta/phan_10_danh_sach_khoa_hoc.md
- Code kiểm thử tự động: backend/tests/phan_10_danh_sach_khoa_hoc.test.js
- Cách kiểm: "Tự động" là Claude Code viết code kiểm thử và chạy bằng npm test; "Bấm tay" là người dùng mở web và làm theo các bước.
- Dữ liệu chung: danh mục "Lập Trình", "Đồ Họa", "Marketing"; 12 khóa 'Đang bán' với giá 150.000, 200.000, 349.000, 500.000, 650.000..., ngày tạo và số học viên khác nhau; một khóa tên "Lập trình web từ con số 0"; một khóa 'Bị ẩn'; một khóa của người cung cấp bị khóa.

## P10-01 Mặc định và phân trang
- Mục tiêu: 9 khóa mỗi trang, sắp nhiều học viên nhất, trả tổng số.
- Dữ liệu: 12 khóa hợp lệ.
- Các bước: gọi GET /api/khoa-hoc; gọi GET /api/khoa-hoc?trang=2.
- Kết quả mong đợi: trang 1 có 9 khóa, tổng số 12, sắp số học viên giảm dần (bằng nhau thì khóa mới hơn trước); trang 2 có 3 khóa; không có khóa bị ẩn hoặc của người cung cấp bị khóa.
- Cách kiểm: Tự động
- Nguồn: Phần 10 mục 10.3, 10.4, 10.5; Phần chung C16

## P10-02 Các cách sắp xếp
- Mục tiêu: năm cách sắp, bằng nhau thì khóa mới hơn trước.
- Dữ liệu: dữ liệu chung, có hai khóa cùng giá và hai khóa cùng số bài.
- Các bước: gọi với sap_xep moi-nhat, gia-tang, gia-giam, nhieu-bai.
- Kết quả mong đợi: thứ tự đúng từng cách; khi bằng nhau khóa có ngay_tao mới hơn đứng trước.
- Cách kiểm: Tự động
- Nguồn: Phần 10 mục 10.3, 10.5

## P10-03 Tìm không phân biệt hoa thường và dấu
- Mục tiêu: khớp tên khóa hoặc tên danh mục.
- Dữ liệu: "lap trinh"; "do hoa"; "LẬP TRÌNH".
- Các bước: gọi GET /api/khoa-hoc?tu_khoa=...
- Kết quả mong đợi: "lap trinh" ra khóa có "Lập trình" trong tên và mọi khóa thuộc danh mục "Lập Trình"; "do hoa" ra các khóa danh mục "Đồ Họa"; "LẬP TRÌNH" ra giống "lap trinh".
- Cách kiểm: Tự động
- Nguồn: Phần 10 mục 10.4, 10.7

## P10-04 Lọc danh mục
- Mục tiêu: lọc một hoặc nhiều danh mục.
- Dữ liệu: danh_muc=<id Lập Trình>,<id Marketing>.
- Các bước: gọi GET /api/khoa-hoc.
- Kết quả mong đợi: chỉ khóa thuộc hai danh mục đó.
- Cách kiểm: Tự động
- Nguồn: Phần 10 mục 10.3, 10.5

## P10-05 Lọc giá theo các khoảng có sẵn
- Mục tiêu: biên đúng.
- Dữ liệu: khóa giá 199.999, 200.000, 500.000, 500.001.
- Các bước: lọc dưới 200.000; lọc 200.000 đến 500.000; lọc trên 500.000.
- Kết quả mong đợi: dưới 200.000 chỉ có 199.999; khoảng giữa có 200.000 và 500.000; trên 500.000 chỉ có 500.001.
- Cách kiểm: Tự động
- Nguồn: Phần 10 mục 10.4

## P10-06 Lọc giá tự nhập
- Mục tiêu: bỏ trống một đầu được; từ lớn hơn đến thì không lọc.
- Dữ liệu: gia_tu=300000 (không có gia_den); gia_den=300000; gia_tu=500000&gia_den=200000.
- Các bước: gọi GET /api/khoa-hoc.
- Kết quả mong đợi: hai lần đầu lọc đúng một đầu; lần ba không lọc theo giá (trang báo "Khoảng giá không hợp lệ").
- Cách kiểm: Tự động
- Nguồn: Phần 10 mục 10.4

## P10-07 Kết hợp tìm kiếm và bộ lọc
- Mục tiêu: các điều kiện dùng chung với nhau.
- Dữ liệu: tu_khoa "web", hai danh mục, khoảng 200.000 đến 500.000, sắp giá tăng.
- Các bước: gọi GET /api/khoa-hoc với tất cả tham số.
- Kết quả mong đợi: chỉ khóa thỏa cả ba điều kiện, sắp giá tăng, tổng số đúng.
- Cách kiểm: Tự động
- Nguồn: Phần 10 mục 10.3, 10.7

## P10-08 Không có kết quả
- Mục tiêu: danh sách rỗng, tổng 0.
- Dữ liệu: tu_khoa "khongcokhoanaoten".
- Các bước: gọi GET /api/khoa-hoc.
- Kết quả mong đợi: danh sách rỗng, tổng 0.
- Cách kiểm: Tự động
- Nguồn: Phần 10 mục 10.3

## P10-09 Giao diện, đường dẫn và trạng thái rỗng
- Mục tiêu: trang đúng thiết kế, giữ lựa chọn trên đường dẫn.
- Dữ liệu: dữ liệu chung.
- Các bước: mở /khoa-hoc; tìm "lap trinh"; tích hai danh mục, chọn khoảng giá, bấm "Áp dụng bộ lọc"; tải lại trang; nhập "Từ" lớn hơn "Đến"; bấm "Xóa tất cả"; tìm từ khóa không có; bấm "Xóa bộ lọc"; sang trang 2.
- Kết quả mong đợi: tiêu đề "Khóa học nổi bật", khi tìm thì "Kết quả cho "lap trinh""; dòng "Hiển thị N khóa học"; bộ lọc chỉ liệt kê danh mục có khóa đang bán; đường dẫn ghi ?tu_khoa=&danh_muc=&gia=&sap_xep=&trang= và tải lại vẫn giữ; khoảng sai báo "Khoảng giá không hợp lệ"; không có kết quả hiện "Không tìm thấy khóa học phù hợp", "Hãy thử đổi từ khóa hoặc bỏ bớt bộ lọc", nút "Xóa bộ lọc"; giống các màn trong thiet_ke/danh_sach_khoa_hoc/; hiển thị tốt ở ba độ rộng.
- Cách kiểm: Bấm tay
- Nguồn: Phần 10 mục 10.3, 10.4, 10.7
