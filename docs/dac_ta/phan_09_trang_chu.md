# PHẦN 9. TRANG CHỦ

Làm sau Phần 8 (cần có vài khóa đang bán để thử).

## 9.1 Mục đích và ai dùng
- Mọi người, kể cả khách. Người cung cấp và admin xem được như mọi người.

## 9.2 Màn thiết kế
- thiet_ke/trang_chu/trang_chu.html (màn "Trang chủ"): trang chủ (đầu trang trong màn vẽ kiểu khách; người đã đăng nhập thì đầu trang theo Phần chung C9).

## 9.3 Giao diện và hành vi
- Khối mở đầu (chữ cố định theo thiết kế) và nút "Khám phá khóa học" mở /khoa-hoc.
- Khối ba con số: [Số] Học viên = số học viên khác nhau có ít nhất một đơn 'Đã thanh toán' (tài khoản không bị khóa); [Số] Khóa học = số khóa 'Đang bán' chưa xóa; [Số] Người cung cấp khóa học = số người cung cấp không bị khóa có ít nhất một khóa 'Đang bán'.
- "Khám phá các khóa học trực tuyến": các danh mục như menu "Danh mục"; bấm một danh mục mở /khoa-hoc?danh_muc=<id>.
- "Khóa học nổi bật": 4 khóa 'Đang bán' có nhiều học viên nhất (bằng nhau thì khóa mới hơn đứng trước); "Xem tất cả →" mở /khoa-hoc (sắp xếp mặc định nhiều học viên nhất).
- "Khóa học mới nhất": 4 khóa 'Đang bán' có ngay_tao gần nhất, dòng nhỏ có thêm "· đăng dd/mm/yyyy"; nhãn "MỚI" chỉ hiện khi khóa đăng trong 7 ngày qua; "Xem tất cả →" mở /khoa-hoc?sap_xep=moi-nhat.
- Thẻ khóa học (dùng chung ở trang chủ, danh sách, khối "Khóa học cùng danh mục"): ảnh bìa (không có thì ảnh mặc định theo thiết kế), tên danh mục, tên khóa, "[họ tên người cung cấp] · N bài · N học viên", điểm trung bình kèm số lượt đánh giá trong ngoặc (chưa có đánh giá thì "Chưa có đánh giá"), giá. Bấm thẻ mở /khoa-hoc/:id.
- "Học hỏi và gặp gỡ cùng những chuyên gia": 6 người cung cấp có tổng số học viên (cộng số học viên của mọi khóa của họ) nhiều nhất, chỉ tính người không bị khóa tài khoản và có ít nhất một khóa 'Đang bán'; mỗi người hiện ảnh đại diện (hoặc chữ cái đầu), họ tên, "· N học viên". Không đủ 6 người thì hiện bấy nhiêu.
- Trang chủ không có khối "Học ở đây khác ở chỗ nào?" và khối "Câu hỏi thường gặp" (đã bỏ khỏi thiết kế).
- Chân trang là chân trang chuẩn ở Phần chung C9 (màn này là màn gốc của chân trang chuẩn).

## 9.4 Quy tắc
- Số học viên của một khóa là số học viên khác nhau có dòng chi_tiet_don_hang của khóa đó trong đơn 'Đã thanh toán' và da_hoan_tien = 0; một học viên lỡ mua hai lần chỉ tính một.
- Số bài của khóa là số bài chưa xóa.
- Điểm trung bình và số lượt đánh giá chỉ tính đánh giá hợp lệ theo Phần 16 mục 16.4.
- Chỉ hiện khóa 'Đang bán', chưa xóa, người cung cấp không bị khóa tài khoản.

## 9.5 Đường xử lý ở máy chủ
- GET /api/trang-chu: trả ba con số, danh mục, 4 khóa nổi bật, 4 khóa mới nhất, 6 chuyên gia (mỗi khóa đủ dữ liệu cho thẻ khóa học).

## 9.6 Bảng dữ liệu dùng
- khoa_hoc, danh_muc, bai_hoc (đếm bài chưa xóa), nguoi_dung và nguoi_cung_cap (họ tên, ảnh, khoa), don_hang và chi_tiet_don_hang (số học viên), danh_gia (điểm).

## 9.7 Kiểm tra khi làm xong
- Khóa bị ẩn, bị gỡ, đã xóa, hoặc của người cung cấp bị khóa không hiện ở trang chủ.
- Học viên mua một khóa hai lần chỉ làm số học viên tăng 1.
- Khóa đăng 8 ngày trước vẫn có thể nằm trong "Khóa học mới nhất" nhưng không có nhãn "MỚI".
- Trang chủ không còn khối "Học ở đây khác ở chỗ nào?" và "Câu hỏi thường gặp".
- Danh sách kiểm thử đầy đủ: docs/kiem_thu/phan_09_trang_chu.md
